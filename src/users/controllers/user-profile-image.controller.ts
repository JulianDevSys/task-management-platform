import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync, statSync } from 'fs';
import { isAbsolute, join } from 'path';
import { UserProfileImageService } from '../services/user-profile-image.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserProfileImageController {
  constructor(
    private readonly userProfileImageService: UserProfileImageService,
  ) {}

  @Post('me/profile-image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { dest: './uploads/users/profile-images' }))
  @ApiOperation({ summary: 'Subir o reemplazar la imagen de perfil del usuario autenticado' })
  async uploadProfileImage(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i }),
        ],
      }),
    )
    file: any,
  ) {
    return this.userProfileImageService.uploadProfileImage(req.user, file);
  }

  @Get(':userId/profile-image')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la imagen de perfil de un usuario' })
  async getProfileImage(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const image = await this.userProfileImageService.getProfileImage(userId, req.user);
    const filePath = isAbsolute(image.fileKey)
      ? image.fileKey
      : join(process.cwd(), image.fileKey);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Profile image file not found');
    }

    const file = createReadStream(filePath);

    res.set({
      'Content-Type': image.mimeType,
      'Content-Disposition': 'inline',
      'Content-Length': String(statSync(filePath).size),
    });

    return new StreamableFile(file);
  }
}
