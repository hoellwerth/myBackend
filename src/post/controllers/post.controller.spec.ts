import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from '../services/post.service';
import { VoteService } from '../services/vote.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserGuard } from '../../auth/guard/user.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { AdminGuard } from '../../auth/guard/admin.guard';

describe('PostController', () => {
  let controller: PostController;

  const mockPostService = {
    getPostById: jest.fn(),
    getAllPosts: jest.fn(),
    createPost: jest.fn(),
    editPost: jest.fn(),
    deletePost: jest.fn(),
  };
  const mockVoteService = {
    vote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [PostController],
      providers: [
        PostService,
        VoteService,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    })
      .overrideProvider(PostService)
      .useValue(mockPostService)
      .overrideProvider(VoteService)
      .useValue(mockVoteService)
      .overrideGuard(ThrottlerGuard)
      .useValue({})
      .overrideGuard(UserGuard)
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(VerifyGuard)
      .useValue({})
      .overrideGuard(AdminGuard)
      .useValue({})
      .compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getPosts', async () => {
    await controller.getPosts('123');

    expect(mockPostService.getPostById).toBeCalled();
  });

  it('should call get all posts', async () => {
    await controller.getAllPosts();

    expect(mockPostService.getAllPosts).toBeCalled();
  });

  it('should call newPost', async () => {
    await controller.newPost({ user: { id: '123' } }, 'title', 'content');

    expect(mockPostService.createPost).toBeCalled();
  });

  it('should call vote', async () => {
    await controller.vote({ user: { id: '123' } }, true, '123');

    expect(mockVoteService.vote).toBeCalled();
  });

  it('should call editPost', async () => {
    await controller.editPost('123', 'title', 'content', {
      user: { id: '123' },
    });

    expect(mockPostService.editPost).toBeCalled();
  });

  it('should call deletePost', async () => {
    await controller.deletePost('123', { user: { id: '123' } });

    expect(mockPostService.deletePost).toBeCalled();
  });
});
