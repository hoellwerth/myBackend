import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../models/post.model';

interface Return {
  success: object | string | object[];
}

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async getAllPosts(): Promise<object[]> {
    return this.postModel.find();
  }

  async getPostById(post_id: string): Promise<any> {
    return this.postModel.findById(post_id);
  }

  async createPost(
    id: string,
    title: string,
    content: string,
  ): Promise<Return> {
    if (!id || !title || !content) {
      throw new BadRequestException('Wrong Body');
    }

    if (id.length !== 24 || title.length > 24) {
      throw new BadRequestException('title_too_long');
    }

    if (content.length > 32768) {
      throw new BadRequestException('content_too_long');
    }

    const newPost = new this.postModel({
      title: title,
      content: content,
      authorId: id,
      likedBy: [],
      dislikedBy: [],
      created: new Date(),
      updated: null,
      type: false,
    });

    let posts;

    posts = await this.postModel.find({ title: newPost.title });
    if (posts[0]) {
      throw new ConflictException('title_already_exists');
    }

    posts = await this.postModel.find({ content: newPost.content });
    if (posts[0]) {
      throw new ConflictException('content_already_exists');
    }

    const result = await newPost.save();

    return { success: result.id };
  }

  async deletePost(post_id: string, authorId: string): Promise<any> {
    if (!post_id || !authorId) {
      throw new BadRequestException('Wrong Body');
    }

    if (post_id.length !== 24 || authorId.length > 24) {
      throw new BadRequestException('Body too long');
    }

    const post = await this.getPostById(post_id);
    if (!post) {
      throw new NotFoundException();
    }

    if (post.authorId !== authorId) {
      throw new UnauthorizedException();
    }

    const result = await this.postModel.findByIdAndDelete(post_id);
    return { success: result };
  }

  async editPost(
    post_id: string,
    authorId: string,
    title: string,
    content: string,
  ): Promise<any> {
    if (!post_id || !authorId || !title || !content) {
      throw new BadRequestException('Wrong Body');
    }

    if (
      post_id.length !== 24 ||
      authorId.length !== 24 ||
      title.length > 24 ||
      content.length > 32768
    ) {
      throw new BadRequestException('Body too long');
    }

    const post = await this.getPostById(post_id);

    if (!post) {
      throw new NotFoundException('user_not_found');
    }

    if (post.authorId !== authorId) {
      throw new UnauthorizedException();
    }

    const checkNewPost = await this.createPost(authorId, title, content);

    if (typeof checkNewPost.success === 'string') {
      return { error: 'post_already_exists' };
    }

    post.title = title;
    post.content = content;
    post.updated = new Date();

    return await post.save();
  }
}
