import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { DeleteUserController } from './controllers/deleteUser.controller';
import { GetUserController } from './controllers/getUser.controller';
import { GetUserByIdController } from './controllers/getUserById.controller';
import { createUserController } from './controllers/createUser.controller';
import { UpdateUserController } from './controllers/updateUser.controller';
import { DeleteUserService } from './services/deleteUser.service';
import { UpdateUserService } from './services/UpdateUser.service';
import { GetUserService } from './services/GetUser.service';
import { GetUserByIdService } from './services/GetUserById.service';
import { CreateUserService } from './services/createUser.service';
import { AdvancedUserQueryController } from './controllers/advancedUserQuery.controller';
import { AdvancedUserQueryService } from './services/advancedUserQuery.service';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { FileStorageService } from 'src/common/storage/file-storage.service';
import { UserProfileImageController } from './controllers/user-profile-image.controller';
import { UserProfileImageService } from './services/user-profile-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,Organization])],
  controllers: [GetUserController, GetUserByIdController, createUserController, UpdateUserController, DeleteUserController, AdvancedUserQueryController, UserProfileImageController],
  providers: [GetUserService, GetUserByIdService, CreateUserService, UpdateUserService, DeleteUserService, AdvancedUserQueryService, UserProfileImageService, FileStorageService],
})
export class UserModule {}
