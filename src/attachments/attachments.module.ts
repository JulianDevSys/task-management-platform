import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attachment } from './entity/attachment.entity';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { UploadAttachmentService } from './services/upload-attachment.service';
import { DownloadAttachmentController } from './controllers/download-attachment.controller';
import { DownloadAttachmentService } from './services/download-attachment.service';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attachment,
      Tasks,
      MembersOrganization,
    ]),
  ],
  controllers: [
    UploadAttachmentController,
    DownloadAttachmentController,
  ],
  providers: [
    UploadAttachmentService,
    DownloadAttachmentService,
  ],
})
export class AttachmentsModule {}