import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { FileStorageService } from 'src/common/storage/file-storage.service';

@Injectable()
export class UserProfileImageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadProfileImage(
    authenticatedUser: { userId: string; email: string; role: string },
    file: any,
  ) {
    if (!file) {
      throw new NotFoundException('Profile image file is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: authenticatedUser.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const previousKey = user.profileImageKey;
    const savedFile = await this.fileStorageService.save(file, 'users/profile-images');

    user.profileImageKey = savedFile.key;
    user.profileImageMimeType = savedFile.mimeType;
    user.avatarUrl = savedFile.key;

    await this.userRepository.save(user);

    if (previousKey && previousKey !== savedFile.key) {
      await this.fileStorageService.delete(previousKey);
    }

    return {
      id: user.id,
      profileImageKey: user.profileImageKey,
      profileImageMimeType: user.profileImageMimeType,
      avatarUrl: user.avatarUrl,
    };
  }

  async getProfileImage(
    userId: string,
    authenticatedUser: { userId: string; email: string; role: string },
  ) {
    if (authenticatedUser.userId !== userId && authenticatedUser.role !== 'admin') {
      throw new ForbiddenException('You are not allowed to view this profile image');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profileImageKey) {
      throw new NotFoundException('User profile image not found');
    }

    return {
      fileKey: user.profileImageKey,
      mimeType: user.profileImageMimeType ?? 'image/jpeg',
      originalName: user.name,
    };
  }
}
