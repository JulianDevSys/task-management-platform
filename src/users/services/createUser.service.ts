import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../Dtos/createUser.dto';
import { UserResponseDto } from '../Dtos/response/userResponseDto';
import { UserRole } from '../enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { FileStorageService } from 'src/common/storage/file-storage.service';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileStorageService?: FileStorageService,
  ) {}

  async createUser(userData: CreateUserDto, file?: any): Promise<UserResponseDto> {
    const userExists = await this.userRepository.exists({
      where: { email: userData.email },
    });

    if (userExists) {
      throw new ConflictException(
        `the email ${userData.email} is already in use`
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    let storedProfileImage: { key: string; mimeType: string; path: string } | null = null;

    if (file && this.fileStorageService) {
      storedProfileImage = await this.fileStorageService.save(file, 'users/profile-images');
    }

    const newUser = this.userRepository.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone ?? undefined,
      avatarUrl: storedProfileImage?.key ?? userData.avatarUrl ?? undefined,
      profileImageKey: storedProfileImage?.key ?? null,
      profileImageMimeType: storedProfileImage?.mimeType ?? null,
      role: UserRole.USER,
    });
    return this.userRepository.save(newUser);
  }
}
