import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommentService } from '../services/comment.service';
import { VoteService } from '../services/vote.service';
import { UserGuard } from '../../auth/guard/user.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';

describe('CommentsController', () => {
  let controller: CommentController;

  const mockCommentService = {
    getCommentById: jest.fn(),
    createComment: jest.fn(),
    editComment: jest.fn(),
    deleteComment: jest.fn(),
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
      controllers: [CommentController],
      providers: [CommentService, VoteService],
    })
      .overrideProvider(CommentService)
      .useValue(mockCommentService)
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
      .compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getComments', async () => {
    await controller.getComment('123');

    expect(mockCommentService.getCommentById).toBeCalled();
  });

  it('should call getComments', async () => {
    await controller.newComment(
      { user: { id: '123' } },
      'title',
      'body',
      '123',
    );

    expect(mockCommentService.createComment).toBeCalled();
  });

  it('should call editComment', async () => {
    await controller.editComment(
      { user: { id: '123' } },
      'title',
      'body',
      '123',
    );

    expect(mockCommentService.editComment).toBeCalled();
  });

  it('should call deleteComment', async () => {
    await controller.deleteComment({ user: { id: '123' } }, '123');

    expect(mockCommentService.deleteComment).toBeCalled();
  });

  it('should call vote', async () => {
    await controller.vote({ user: { id: '123' } }, '123', true);

    expect(mockVoteService.vote).toBeCalled();
  });
});
