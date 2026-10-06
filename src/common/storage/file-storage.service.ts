import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { existsSync, mkdirSync, renameSync, unlinkSync } from 'fs';
import { isAbsolute, join, sep } from 'path';

@Injectable()
export class FileStorageService {
  async save(
    file: any,
    folder: string,
  ): Promise<{ key: string; path: string; originalName: string; mimeType: string; size: number }> {
    if (!file) {
      throw new BadRequestException('No file was provided');
    }

    const safeFolder = folder.replace(/^\/+|\/+$/g, '');
    const targetDir = join(process.cwd(), 'uploads', safeFolder);

    mkdirSync(targetDir, { recursive: true });

    const originalName = file.originalname || 'upload';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${this.getExtension(originalName)}`;
    const targetPath = join(targetDir, fileName);

    if (!file.path || !existsSync(file.path)) {
      throw new InternalServerErrorException('Uploaded file could not be located');
    }

    renameSync(file.path, targetPath);

    const key = join('uploads', safeFolder, fileName).split(sep).join('/');

    return {
      key,
      path: targetPath,
      originalName,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async delete(key?: string | null): Promise<void> {
    if (!key) {
      return;
    }

    const filePath = this.resolvePath(key);

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  resolvePath(key: string): string {
    if (!key) {
      throw new NotFoundException('File key is required');
    }

    return isAbsolute(key) ? key : join(process.cwd(), key);
  }

  private getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot === -1) {
      return '';
    }

    return fileName.slice(lastDot);
  }
}
