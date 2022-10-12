import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../models/post.model';
import { PostService } from './post.service';

@Injectable()
export class VoteService {
  constructor(
    private postService: PostService,
    @InjectModel('Post') private readonly postModel: Model<Post>,
  ) {}

  async vote(type: boolean, post_id: string, author_id: string) {
    if (!post_id || !author_id) {
      throw new BadRequestException();
    }

    const post = await this.postService.getPostById(post_id);

    if (!post) {
      throw new NotFoundException();
    }

    if (type) {
      return await this.upvote(post);
    }

    return await this.downVote(post);
  }

  async upvote(post) {
    const upvotes = post.likedBy;
    const downvotes = post.dislikedBy;

    let flag = 0;
    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] === post.authorId) {
        upvotes.splice(i, 1);
        flag = 1;
        break;
      }
    }

    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] === post.authorId) {
        downvotes.splice(i, 1);
        break;
      }
    }

    if (flag === 0) {
      upvotes.push(post.authorId);
    }

    post.likedBy = upvotes;
    post.dislikedBy = downvotes;

    post.save();

    return { liked_by: upvotes };
  }

  async downVote(post) {
    const downvotes = post.dislikedBy;
    const upvotes = post.likedBy;

    let flag = 0;

    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] === post.authorId) {
        downvotes.splice(i, 1);
        flag = 1;
        break;
      }
    }

    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] === post.authorId) {
        upvotes.splice(i, 1);
        break;
      }
    }

    if (flag === 0) {
      downvotes.push(post.authorId);
    }

    post.dislikedBy = downvotes;
    post.likedBy = upvotes;

    await post.save();

    return { disliked_by: downvotes };
  }
}
