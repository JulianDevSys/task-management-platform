import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/User.entity';
import { UserModule } from './users/user.module';
import { OrganizationModule } from './organizations/organization.module';
import { Organization } from './organizations/entity/Organization.entity';
import { MembersOrganization } from './memberOrganization/entity/memberOrganization.entity';
import { MembersModule } from './memberOrganization/members.module';
import { TaskModule } from './task/task.module';
import { Tasks } from './task/entity/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')) || 5432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Organization,MembersOrganization,Tasks],
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    OrganizationModule,
    MembersModule,
    TaskModule
  ],
})
export class AppModule {}
