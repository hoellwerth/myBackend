import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CommentService } from '../services/comment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { AdminGuard } from '../../auth/guard/admin.guard';

@Throttle()
@UseGuards(ThrottlerGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // GET /:comment_id  (Get a specific comment)
  @Get(':comment_id')
  getComment(@Param('comment_id') comment_id: string): any {
    return this.commentService.getCommentById(comment_id);
  }

  // POST /  (New Comment)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard, AdminGuard)
  @Post('')
  newComment(
    @Request() req,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('parent') parent: string,
  ): any {
    return this.commentService.createComment(
      req.user.id,
      title,
      content,
      parent,
    );
  }
}
