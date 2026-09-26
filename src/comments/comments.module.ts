import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CreateCommentController } from './controllers/create-comment.controller';
import { GetCommentByIdController } from './controllers/get-comment-by-id.controller';
import { GetCommentsByTaskController } from './controllers/get-comments-by-task.controller';
import { GetMyCommentsController } from './controllers/get-my-comments.controller';
import { UpdateCommentController } from './controllers/update-comment.controller';
import { DeleteCommentController } from './controllers/delete-comment.controller';
import { CreateCommentService } from './services/create-comment.service';
import { GetCommentByIdService } from './services/get-comment-by-id.service';
import { GetCommentsByTaskService } from './services/get-comments-by-task.service';
import { GetMyCommentsService } from './services/get-my-comments.service';
import { UpdateCommentService } from './services/update-comment.service';
import { DeleteCommentService } from './services/delete-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Tasks, MembersOrganization])],
  controllers: [
    CreateCommentController,
    GetCommentByIdController,
    GetCommentsByTaskController,
    GetMyCommentsController,
    UpdateCommentController,
    DeleteCommentController,
  ],
  providers: [
    CreateCommentService,
    GetCommentByIdService,
    GetCommentsByTaskService,
    GetMyCommentsService,
    UpdateCommentService,
    DeleteCommentService,
  ],
})
export class CommentsModule {}
