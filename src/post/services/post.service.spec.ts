import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';

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
describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
