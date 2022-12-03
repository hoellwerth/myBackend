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

  async getPostById(postId: string): Promise<any> {
    return this.postModel.findById(postId);
  }

  async createPost(
    id: string,
    title: string,
    content: string,
  ): Promise<Return> {
    if (!id || !title || !content) {
      throw new BadRequestException('Wrong Body!');
    }

    if (id.length !== 24 || title.length > 32) {
      throw new BadRequestException('Title too long!');
    }

    if (content.length > 32768) {
      throw new BadRequestException('Content too long!');
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
      throw new ConflictException('Title already Exists!');
    }

    posts = await this.postModel.find({ content: newPost.content });
    if (posts[0]) {
      throw new ConflictException('Content already Exists!');
    }

    const result = await newPost.save();

    return { success: result.id };
  }

  async deletePost(postId: string, authorId: string): Promise<any> {
    if (!postId || !authorId) {
      throw new BadRequestException('Wrong Body');
    }

    if (postId.length !== 24 || authorId.length > 24) {
      throw new BadRequestException('Body too long');
    }

    const post = await this.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }

    if (post.authorId !== authorId) {
      throw new UnauthorizedException();
    }

    const result = await this.postModel.findByIdAndDelete(postId);
    return { success: result };
  }

  async editPost(
    postId: string,
    authorId: string,
    title: string,
    content: string,
    comments: string[] | null,
  ): Promise<any> {
    if (!postId || !authorId || !title || !content) {
      throw new BadRequestException('Wrong Body');
    }

    if (
      postId.length !== 24 ||
      authorId.length !== 24 ||
      title.length > 24 ||
      content.length > 32768
    ) {
      throw new BadRequestException('Body too long');
    }

    const post = await this.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    if (post.authorId !== authorId) {
      throw new UnauthorizedException();
    }

    post.title = title;
    post.content = content;
    post.updated = new Date();

    if (comments) {
      post.comments = comments;
    }

    return await post.save();
  }
}
