import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { CommentService } from '../services/comment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { VoteService } from '../services/vote.service';

@UseGuards(ThrottlerGuard)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly voteService: VoteService,
  ) {}

  // GET /:comment_id  (Get a specific comment)
  @SkipThrottle()
  @Get(':comment_id')
  getComment(@Param('comment_id') comment_id: string): any {
    return this.commentService.getCommentById(comment_id);
  }

  // POST / (New Comment)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
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

  // PATCH /:comment_id  (Edit Comment)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch(':comment_id')
  editComment(
    @Request() req,
    @Param('comment_id') comment_id: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): any {
    return this.commentService.editComment(
      req.user.id,
      comment_id,
      title,
      content,
    );
  }

  // DELETE /:comment_id  (Delete Comment)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Delete(':comment_id')
  deleteComment(@Request() req, @Param('commentId') commentId: string): any {
    return this.commentService.deleteComment(req.user.id, commentId);
  }

  // PUT /:postId (Vote for Comments)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Put(':commentId')
  vote(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body('type') type: boolean,
  ): any {
    return this.voteService.vote(type, commentId, req.user.id);
  }
}
