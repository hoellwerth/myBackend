import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { Model } from 'mongoose';
import { PostService } from '../../post/services/post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from '../../post/models/post.model';
import {
  mockPost,
  PostServiceMock,
} from '../../post/services/vote.service.spec';

export class CommentModel {
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

export class CommentServiceMock {
  static getCommentById = jest.fn().mockResolvedValue({
    ...mockPost(),
    save: () => {
      return 'id';
    },
  });
  static createComment = jest.fn().mockResolvedValue(mockPost());
  static editComment = jest.fn().mockResolvedValue(mockPost());
  static deleteComment = jest.fn().mockResolvedValue(true);
}

describe('CommentsService', () => {
  let service: CommentService;
  let commentModel: Model<Post>;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken('Comment'),
          useValue: CommentModel,
        },
        {
          provide: PostService,
          useValue: PostServiceMock,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentModel = module.get<Model<Post>>(getModelToken('Comment'));
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a comment by id', async () => {
    const comment = jest
      .spyOn(commentModel, 'findById')
      .mockReturnValueOnce({} as any);

    const foundComment = await service.getCommentById(
      '636421313d2604ab7858f9a8',
    );

    expect(comment).toHaveBeenCalled();
    expect(foundComment).toStrictEqual({});
  });

  it('should create a comment', async () => {
    expect(
      service.createComment('636421313d2604ab7858f9a8', 'test', '123', '1234'),
    ).toBeDefined();
  });

  it('should edit a comment', async () => {
    expect(
      service.editComment(
        '636421313d2604ab7858f9a8',
        '636421313d2604ab7858f9a8',
        '123',
        '1234',
      ),
    ).toBeDefined();
  });

  it('should delete a comment', async () => {
    const post = jest.spyOn(postService, 'getPostById');

    expect(
      service.deleteComment(
        '636421313d2604ab7858f9a8',
        '636421313d2604ab7858f9a8',
      ),
    ).toBeDefined();

    expect(post).toHaveBeenCalled();
  });
});
