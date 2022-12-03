import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { CommentService } from './comment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../post/models/post.model';
import { CommentModel, CommentServiceMock } from './comment.service.spec';

describe('VoteService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: VoteService,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    commentService: CommentService,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    commentModel: Model<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: CommentService,
          useValue: CommentServiceMock,
        },
        {
          provide: getModelToken('Comment'),
          useValue: CommentModel,
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
    commentService = module.get<CommentService>(CommentService);
    commentModel = module.get<Model<Post>>(getModelToken('Comment'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should vote', async () => {
    const upvoteSpy = jest.spyOn(service, 'upvote');
    const downvoteSpy = jest.spyOn(service, 'downVote');

    await service.vote(
      true,
      '636421313d2604ab7858f9a8',
      '636421313d2604ab7858f9a8',
    );
    await service.vote(
      false,
      '636421313d2604ab7858f9a8',
      '636421313d2604ab7858f9a8',
    );
    expect(upvoteSpy).toHaveBeenCalled();
    expect(downvoteSpy).toHaveBeenCalled();
  });
});
