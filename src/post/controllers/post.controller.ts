import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { VoteService } from '../services/vote.service';
import { UserGuard } from '../../auth/guard/user.guard';
import { PostService } from '../services/post.service';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { AdminGuard } from '../../auth/guard/admin.guard';

@UseGuards(ThrottlerGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly voteService: VoteService,
  ) {}

  // GET /:post_id  (Get a specific Posts)
  @SkipThrottle()
  @Get(':post_id')
  getPosts(@Param('post_id') post_id: string): any {
    return this.postService.getPostById(post_id);
  }

  // GET / (Get all posts)
  @SkipThrottle()
  @Get('')
  getAllPosts(): any {
    return this.postService.getAllPosts();
  }

  // POST /  (New Post)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard, AdminGuard)
  @Post('')
  newPost(
    @Request() req,
    @Body('title') title: string,
    @Body('content') content: string,
  ): any {
    return this.postService.createPost(req.user.id, title, content);
  }

  // PUT /:postId (Up/Down-vote)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch(':postId')
  upvote(
    @Request() req,
    @Body('type') type: boolean,
    @Param('postId') postId: string,
  ): any {
    return this.voteService.vote(type, postId, req.user.id);
  }

  // PATCH / (Edit Post)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch(':postId')
  editPost(
    @Param('postId') postId,
    @Body('title') title,
    @Body('content') content,
    @Request() req,
  ): any {
    return this.postService.editPost(postId, req.user.id, title, content, null);
  }

  // DELETE /:post_od (Delete A post)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Delete(':post_id')
  deletePost(@Param('post_id') post_id: string, @Request() req): any {
    return this.postService.deletePost(post_id, req.user.id);
  }
}
