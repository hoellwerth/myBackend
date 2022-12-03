import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../post/models/post.model';
import { Model } from 'mongoose';
import { PostService } from '../../post/services/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Post>,
    private readonly postService: PostService,
  ) {}

  getCommentById(commentId: string): object {
    return this.commentModel.findById(commentId);
  }

  async createComment(
    id: string,
    title: string,
    content: string,
    parentId,
  ): Promise<object> {
    const newComment = new this.commentModel({
      title: title,
      content: content,
      authorId: id,
      likedBy: [],
      dislikedBy: [],
      created: new Date(),
      updated: null,
      parent: parentId,
    });

    const comment = await newComment.save();

    // Edit comment array in parent post
    let parent = await this.postService.getPostById(parentId);

    if (!parent) {
      parent = await this.getCommentById(parentId);
      if (!parent) {
        throw new NotFoundException('Parent not found!');
      }
    }

    const commentIds = parent.comments;

    commentIds.push(comment._id.toString());

    parent.comments = commentIds;

    parent.save();
    return comment;
  }

  // Edit comments
  async editComment(
    userId: string,
    commentId: string,
    title: string,
    content: string,
  ): Promise<object> {
    if (!commentId || !userId || !title || !content) {
      throw new BadRequestException('Wrong Body');
    }

    if (
      commentId.length !== 24 ||
      userId.length !== 24 ||
      title.length > 24 ||
      content.length > 32768
    ) {
      throw new BadRequestException('Body too long');
    }

    const comment: any = await this.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('User not found!');
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException();
    }

    comment.title = title;
    comment.content = content;
    comment.updated = new Date();

    return await comment.save();
  }

  // Delete comments
  async deleteComment(userId: string, commentId: string): Promise<any> {
    if (!commentId || !userId) {
      throw new BadRequestException('Wrong Body');
    }

    if (commentId.length !== 24 || userId.length > 24) {
      throw new BadRequestException('Body too long');
    }

    const comment: any = await this.getCommentById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException();
    }

    const result = await this.commentModel.findByIdAndDelete(commentId);

    const post: any = await this.postService.getPostById(comment.parent);

    const comments = post.comments;

    for (const i in comments) {
      if (comments[i] === commentId) {
        comments.splice(i, 1);
        break;
      }
    }

    post.comments = comments;

    post.save();

    return { success: result };
  }
}
