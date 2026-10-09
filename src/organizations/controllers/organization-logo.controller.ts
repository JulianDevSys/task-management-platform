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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync, statSync } from 'fs';
import { isAbsolute, join } from 'path';
import { OrganizationLogoService } from '../services/organization-logo.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationLogoController {
  constructor(
    private readonly organizationLogoService: OrganizationLogoService,
  ) {}

  @Post(':organizationId/logo')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', { dest: './uploads/organizations/logos' }))
  @ApiOperation({ summary: 'Subir o reemplazar el logo de una organización' })
  async uploadLogo(
    @Param('organizationId') organizationId: string,
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
    return this.organizationLogoService.uploadLogo(organizationId, req.user, file);
  }

  @Get(':organizationId/logo')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener el logo de una organización' })
  async getLogo(
    @Param('organizationId') organizationId: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const logo = await this.organizationLogoService.getLogo(organizationId, req.user);
    const filePath = isAbsolute(logo.fileKey)
      ? logo.fileKey
      : join(process.cwd(), logo.fileKey);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Organization logo not found');
    }

    const file = createReadStream(filePath);

    res.set({
      'Content-Type': logo.mimeType,
      'Content-Disposition': 'inline',
      'Content-Length': String(statSync(filePath).size),
    });

    return new StreamableFile(file);
  }
}
