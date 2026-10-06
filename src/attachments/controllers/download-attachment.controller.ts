import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  StreamableFile,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync, statSync } from 'fs';
import { isAbsolute, join } from 'path';
import { DownloadAttachmentService } from '../services/download-attachment.service';

@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('attachments')
@UseGuards(AuthGuard('jwt'))
export class DownloadAttachmentController {
  constructor(
    private readonly downloadAttachmentService: DownloadAttachmentService,
  ) {}

  @Get(':attachmentId')
  @ApiOperation({ summary: 'Descargar un archivo adjunto autenticado' })
  async downloadAttachment(
    @Param('attachmentId') attachmentId: string,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const attachment = await this.downloadAttachmentService.getAttachmentForDownload(
      attachmentId,
      req.user,
    );

    const filePath = isAbsolute(attachment.path)
      ? attachment.path
      : join(process.cwd(), attachment.path);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo físico no encontrado');
    }

    const file = createReadStream(filePath);

    res.set({
      'Content-Type': attachment.mimeType,
      'Content-Disposition': `attachment; filename="${attachment.originalName}"`,
      'Content-Length': String(statSync(filePath).size),
    });

    return new StreamableFile(file);
  }
}
