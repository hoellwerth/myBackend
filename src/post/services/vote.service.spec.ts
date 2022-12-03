import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { Post } from '../models/post.model';
import { Model } from 'mongoose';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { PostModel, PostServiceMock } from './post.service.spec';

describe('VoteService', () => {
  let service: VoteService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let postService: PostService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let postModel: Model<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: PostService,
          useValue: PostServiceMock,
        },
        {
          provide: getModelToken('Post'),
          useValue: PostModel,
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
    postService = module.get<PostService>(PostService);
    postModel = module.get<Model<Post>>(getModelToken('Post'));
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
