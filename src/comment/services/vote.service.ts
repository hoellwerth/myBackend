import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentService } from './comment.service';
import { Post } from '../../post/models/post.model';

@Injectable()
export class VoteService {
  constructor(
    private commentService: CommentService,
    @InjectModel('Comment') private readonly commentModel: Model<Post>,
  ) {}

  async vote(type: boolean, commentId: string, authorId: string) {
    if (!commentId || !authorId) {
      throw new BadRequestException();
    }

    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    if (type) {
      return await this.upvote(comment);
    }

    return await this.downVote(comment);
  }

  async upvote(comment) {
    const upvotes = comment.likedBy;
    const downvotes = comment.dislikedBy;

    let flag = 0;
    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] === comment.authorId) {
        upvotes.splice(i, 1);
        flag = 1;
        break;
      }
    }

    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] === comment.authorId) {
        downvotes.splice(i, 1);
        break;
      }
    }

    if (flag === 0) {
      upvotes.push(comment.authorId);
    }

    comment.likedBy = upvotes;
    comment.dislikedBy = downvotes;

    comment.save();

    return { likedBy: upvotes };
  }

  async downVote(comment) {
    const downvotes = comment.dislikedBy;
    const upvotes = comment.likedBy;

    let flag = 0;

    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] === comment.authorId) {
        downvotes.splice(i, 1);
        flag = 1;
        break;
      }
    }

    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] === comment.authorId) {
        upvotes.splice(i, 1);
        break;
      }
    }

    if (flag === 0) {
      downvotes.push(comment.authorId);
    }

    comment.dislikedBy = downvotes;
    comment.likedBy = upvotes;

    await comment.save();

    return { dislikedBy: downvotes };
  }
}
