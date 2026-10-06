import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { UploadAttachmentService } from '../services/upload-attachment.service';

@Controller('tasks')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAttachmentService: UploadAttachmentService,
  ) {}

@Post(':taskId/attachments')
@UseInterceptors(
  FileInterceptor('file', {
    dest: './uploads',
  }),
)
upload(
  @Param('taskId') taskId: string,

  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 10 * 1024 * 1024,
        }),

        new FileTypeValidator({
          fileType: /(pdf|doc|docx|jpg|jpeg|png)$/,
        }),
      ],
    }),
  )
  file: any,
) {
  return this.uploadAttachmentService.upload(file, taskId);
}
}