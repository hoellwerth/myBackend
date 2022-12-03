import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

export const mockPost = (
  title = 'Test',
  content = 'Test',
  authorId = '636421313d2604ab7858f9a8',
  comments: string[] = ['id'],
  likedBy: string[] = [],
  dislikedBy: string[] = [],
  created = new Date(),
  updated = null,
  parent = 'id',
  _id = 'id',
): Post => ({
  title,
  content,
  comments,
  likedBy,
  dislikedBy,
  created,
  updated,
  authorId,
  parent,
  _id,
});

export class PostServiceMock {
  static getPostById = jest.fn().mockResolvedValue({
    ...mockPost(),
    save: () => {
      return 'id';
    },
  });
  static editPost = jest.fn().mockResolvedValue(mockPost());
  static createPost = jest.fn().mockResolvedValue(mockPost());
  static deletePost = jest.fn().mockResolvedValue(true);
  static getAllPosts = jest.fn().mockResolvedValue([mockPost(), mockPost()]);
}

export class PostModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue({
    ...this.data,
    _id: 'id',
    save: () => {
      return 'id';
    },
  });
  static find = jest.fn().mockResolvedValue([]);
  static findById = jest.fn().mockResolvedValue({
    ...mockPost(),
    _id: 'id',
    save: () => {
      return 'id';
    },
  });
  static findOne = jest.fn().mockResolvedValue(mockPost());
  static findOneAndUpdate = jest.fn().mockResolvedValue(mockPost());
  static deleteOne = jest.fn().mockResolvedValue(true);
  static findByIdAndDelete = jest.fn().mockResolvedValue('id');
}

describe('PostService', () => {
  let service: PostService;
  let postModel: Model<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken('Post'),
          useValue: PostModel,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postModel = module.get<Model<Post>>(getModelToken('Post'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all posts', async () => {
    const postArray = [mockPost(), mockPost()];

    const posts = jest.spyOn(postModel, 'find').mockResolvedValue(postArray);

    expect(await service.getAllPosts()).toEqual(postArray);

    expect(posts).toHaveBeenCalled();
  });

  it('should return a post by id', async () => {
    const post = mockPost();

    const postById = jest.spyOn(postModel, 'findById').mockResolvedValue(post);

    expect(await service.getPostById('id')).toEqual(post);

    expect(postById).toHaveBeenCalled();
  });

  it('should create a post', async () => {
    const posts = jest.spyOn(postModel, 'find').mockResolvedValue([]);

    const post = await service.createPost(
      '636421313d2604ab7858f9a8',
      'test',
      'content',
    );

    expect(post.success).toBeUndefined();

    expect(posts).toHaveBeenCalled();
  });

  it('should delete a post', async () => {
    const post = mockPost();

    const postById = jest.spyOn(postModel, 'findById').mockResolvedValue(post);

    const deletePost = jest
      .spyOn(postModel, 'findByIdAndDelete')
      .mockResolvedValue(post);

    expect(
      await service.deletePost(
        '636421313d2604ab7858f9a8',
        '636421313d2604ab7858f9a8',
      ),
    ).toEqual({ success: post });

    expect(postById).toHaveBeenCalled();
    expect(deletePost).toHaveBeenCalled();
  });

  it('should edit a post', async () => {
    const post = mockPost();

    const postById = jest.spyOn(service, 'getPostById').mockResolvedValue({
      ...post,
      save: jest.fn().mockResolvedValue({
        _id: 'id',
        save: () => {
          return 'id';
        },
      }),
    });

    const result = await service.editPost(
      '636421313d2604ab7858f9a8',
      '636421313d2604ab7858f9a8',
      'title',
      'content',
      null,
    );

    expect(JSON.stringify(result)).toBe(
      JSON.stringify({
        _id: 'id',
        save: () => {
          return 'id';
        },
      }),
    );

    expect(postById).toHaveBeenCalled();
  });
});
