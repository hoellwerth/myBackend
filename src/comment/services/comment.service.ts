import { Injectable } from '@nestjs/common';
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

  getCommentById(comment_id: string): object {
    return this.commentModel.findById(comment_id);
  }

  async createComment(
    id: string,
    title: string,
    content: string,
    parent,
  ): Promise<object> {
    const newComment = new this.commentModel({
      title: title,
      content: content,
      authorId: id,
      likedBy: [],
      dislikedBy: [],
      created: new Date(),
      updated: null,
      parent: parent,
    });

    const comment = await newComment.save();

    // Edit comment array in parent post
    const post = await this.postService.getPostById(parent);

    const comments = post.comments;

    comments.push(comment._id.toString());

    post.comments = comments;

    post.save();
    return comment;
  }
}
