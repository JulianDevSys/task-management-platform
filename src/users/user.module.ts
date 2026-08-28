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

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [GetUserController, GetUserByIdController, createUserController, UpdateUserController, DeleteUserController],
  providers: [GetUserService, GetUserByIdService, CreateUserService, UpdateUserService, DeleteUserService],
})
export class UserModule {}
