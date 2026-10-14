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
import { Invitation } from './invitation/entity/invitation.entity';
import { InvitationModule } from './invitation/invitation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HidePasswordInterceptor } from './common/interceptors/hidePassword.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './auth/entity/auth.entity';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entity/comment.entity';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entity/notification.entity';
import { AttachmentsModule } from './attachments/attachments.module';
import { Attachment } from './attachments/entity/attachment.entity';
import { AiModule } from './ai/ai.module';

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
        entities: [User, Organization,MembersOrganization,Tasks,Invitation,RefreshToken, Comment, Notification,Attachment],
        synchronize: true,
        logging: false,
      }),
    }),
    ScheduleModule.forRoot(), //Activa cron jobs en tu aplicación
    UserModule,
    OrganizationModule,
    MembersModule,
    TaskModule,
    InvitationModule,
    CommentsModule,
    NotificationsModule,
    JwtModule,
    AuthModule,
    RedisModule,
    AttachmentsModule,
    AiModule
  ],
    providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HidePasswordInterceptor, 
    },
  ],
})
export class AppModule {}
