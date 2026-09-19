import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserService } from '../services/createUser.service';

import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';

import { User } from '../entity/User.entity';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { Invitation } from 'src/invitation/entity/invitation.entity';
import { RefreshToken } from 'src/auth/entity/auth.entity';
import { Comment } from 'src/comments/entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';

import { DataSource, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';

describe('CreateUserService', () => {
  // TestingModule representa el módulo de Nest que construiremos
  // exclusivamente para nuestros integration tests.
  let module: TestingModule;

  // Repository REAL de User.
  // No es un mock.
  // Este repository se comunica con PostgreSQL.
  let userRepository: Repository<User>;

  // Instancia REAL de nuestro servicio.
  let service: CreateUserService;

  // DataSource REAL de TypeORM.
  // Representa la conexión completa con PostgreSQL.
  let dataSource: DataSource;

  // ============================================================
  // BEFORE ALL
  // ============================================================
  // beforeAll se ejecuta UNA SOLA VEZ antes de todos los tests
  // que estén dentro de este describe.
  //
  // Aquí construimos nuestro entorno de integración:
  //
  // Jest
  //   ↓
  // Nest TestingModule
  //   ↓
  // TypeORM
  //   ↓
  // PostgreSQL
  //
  beforeAll(async () => {
    // Crea un módulo de Nest exclusivo para nuestros tests.
    //
    // Esto NO utiliza directamente nuestro AppModule.
    // Estamos creando solamente las partes que necesitamos
    // para probar CreateUserService.
    module = await Test.createTestingModule({
      imports: [
        // ======================================================
        // CONFIG MODULE
        // ======================================================
        //
        // Permite que Nest lea las variables de nuestro .env.
        //
        // Por ejemplo:
        //
        // DB_HOST=localhost
        // DB_PORT=5432
        // DB_USER=postgres
        // DB_PASSWORD=...
        //
        ConfigModule.forRoot({
          // Hace que ConfigService esté disponible globalmente
          // dentro de este TestingModule.
          isGlobal: true,

          // Archivo donde tenemos las variables de entorno.
          envFilePath: '.env',
        }),

        // ======================================================
        // TYPEORM
        // ======================================================
        //
        // Configuramos la conexión REAL con PostgreSQL.
        //
        // Esta configuración es prácticamente la misma idea
        // que tendrías en tu AppModule.
        //
        TypeOrmModule.forRootAsync({
          // Necesitamos ConfigModule porque vamos a utilizar
          // ConfigService para leer las variables del .env.
          imports: [ConfigModule],

          // Le decimos a Nest:
          // "Necesito que me inyectes ConfigService".
          inject: [ConfigService],

          // Esta función recibe ConfigService y devuelve
          // la configuración de TypeORM.
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',

            // Datos de conexión obtenidos desde .env.
            host: configService.get<string>('DB_HOST'),

            port:
              Number(configService.get<string>('DB_PORT')) || 5432,

            username: configService.get<string>('DB_USER'),

            password: configService.get<string>('DB_PASSWORD'),

            // IMPORTANTE:
            // Utilizamos una base de datos EXCLUSIVA para tests.
            //
            // Nunca queremos ejecutar estos tests contra
            // nuestra base de datos de desarrollo.
            database: 'task_management_test',

            // ==================================================
            // ENTITIES
            // ==================================================
            //
            // TypeORM necesita conocer estas entidades para
            // construir correctamente sus metadatos y resolver
            // las relaciones entre ellas.
            //
            // Esto NO significa que nuestro test esté probando
            // todas estas entidades.
            //
            // Solamente le estamos diciendo a TypeORM:
            // "Estas son las entidades que existen en esta
            // conexión y sus relaciones deben ser conocidas".
            //
            entities: [
              User,
              Organization,
              MembersOrganization,
              Invitation,
              RefreshToken,
              Comment,
              Tasks,
            ],

            // SOLO para nuestra base de pruebas.
            //
            // TypeORM crea/actualiza las tablas automáticamente
            // según nuestras entidades.
            //
            // No debemos utilizar esto de esta manera en
            // producción.
            synchronize: true,
          }),
        }),

        // ======================================================
        // FOR FEATURE
        // ======================================================
        //
        // Le dice a Nest:
        //
        // "Dentro de este TestingModule necesito que exista
        // un Repository<User> para poder inyectarlo".
        //
        // Nuestro CreateUserService tiene:
        //
        // @InjectRepository(User)
        //
        // Por eso necesitamos registrar User aquí.
        //
        TypeOrmModule.forFeature([User]),
      ],

      // ========================================================
      // PROVIDERS
      // ========================================================
      //
      // Le decimos a Nest que debe construir CreateUserService.
      //
      // Nest se encargará de inyectarle automáticamente
      // Repository<User>.
      //
      providers: [CreateUserService],
    }).compile();

    // ==========================================================
    // OBTENER EL SERVICE
    // ==========================================================
    //
    // Le pedimos a Nest la instancia REAL de CreateUserService
    // que acaba de construir.
    //
    // En un unit test hacíamos:
    //
    // new CreateUserService(mockRepository)
    //
    // Aquí NO hacemos eso.
    //
    // Nest construye el servicio y le proporciona el
    // Repository<User> REAL.
    //
    service = module.get(CreateUserService);

    // ==========================================================
    // OBTENER REPOSITORY
    // ==========================================================
    //
    // Obtenemos el Repository<User> REAL que TypeORM registró.
    //
    // getRepositoryToken(User) obtiene el token que Nest utiliza
    // para identificar el Repository de User.
    //
    // Esto nos permite consultar directamente PostgreSQL
    // desde nuestro test.
    //
    userRepository = module.get(getRepositoryToken(User));

    // ==========================================================
    // OBTENER DATASOURCE
    // ==========================================================
    //
    // DataSource representa la conexión completa de TypeORM
    // con PostgreSQL.
    //
    // getDataSourceToken() obtiene el token utilizado por Nest
    // para identificar ese DataSource.
    //
    // Lo utilizaremos para ejecutar SQL directamente cuando
    // necesitemos limpiar nuestra base de pruebas.
    //
    dataSource = module.get(getDataSourceToken());
  });

  // ============================================================
  // BEFORE EACH
  // ============================================================
  //
  // Se ejecuta ANTES DE CADA "it".
  //
  // Su objetivo es que cada test comience con una base limpia.
  //
  // NO utilizamos:
  //
  // userRepository.clear()
  //
  // porque User tiene relaciones mediante foreign keys.
  //
  // En su lugar utilizamos TRUNCATE ... CASCADE.
  //
  beforeEach(async () => {
    await dataSource.query(`
      TRUNCATE TABLE
        "users",
        "organizations",
        "member_organization",
        "invitations",
        "refresh_tokens",
        "comments",
        "tasks"
      RESTART IDENTITY CASCADE;
    `);
  });

  // ============================================================
  // TEST
  // ============================================================

  it('should create a user in the database', async () => {
    // Datos que enviaría normalmente un cliente
    // al endpoint de creación de usuario.
    const userData = {
      name: 'Julian Test',
      email: 'julian.integration@test.com',
      password: 'Password123!',
    };

    // Ejecutamos nuestro servicio REAL.
    //
    // Esto termina ejecutando:
    //
    // CreateUserService
    //       ↓
    // Repository<User>
    //       ↓
    // PostgreSQL
    //
    const result = await service.createUser(userData);

    // ==========================================================
    // COMPROBAR PERSISTENCIA REAL
    // ==========================================================
    //
    // Ahora hacemos una consulta REAL a PostgreSQL.
    //
    // Esto es importante:
    //
    // No estamos comprobando solamente lo que devolvió
    // el servicio.
    //
    // Estamos preguntando directamente a la base:
    //
    // "¿El usuario realmente quedó guardado?"
    //
    const userInDatabase = await userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    // Esperamos encontrar el usuario.
    expect(userInDatabase).toBeDefined();

    // Comprobamos que el usuario encontrado tiene
    // el email que enviamos.
    expect(userInDatabase?.email).toBe(userData.email);

    // ==========================================================
    // COMPROBAR RESPUESTA DEL SERVICE
    // ==========================================================
    //
    // También verificamos que nuestro servicio
    // devolvió un resultado.
    //
    expect(result).toBeDefined();

    // Y comprobamos que el objeto devuelto contiene
    // el email esperado.
    expect(result.email).toBe(userData.email);
  });


  it('should throw ConflictException if email already exists', async () => {
  const userData = {
    name: 'Julian Test',
    email: 'julian.integration@test.com',
    password: 'Password123!',
  };

  // Primero creamos realmente el usuario en PostgreSQL.
  await service.createUser(userData);

  // Ahora intentamos crear otro usuario utilizando
  // exactamente el mismo email.
  //
  // El servicio consultará PostgreSQL y exists() devolverá true.
  await expect(
    service.createUser({
      name: 'Another User',
      email: userData.email,
      password: 'AnotherPassword123!',
    }),
  ).rejects.toThrow(ConflictException);
});
});