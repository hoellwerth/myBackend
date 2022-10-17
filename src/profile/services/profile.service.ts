import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../models/profile.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<Profile>,
  ) {}

  async getProfile(userId: string): Promise<any> {
    return this.profileModel.findOne({ userId });
  }

  async createProfile(userId: string): Promise<any> {
    const newProfile = new this.profileModel({
      userId: userId,
      status: null,
      bio: null,
    });

    const result = await newProfile.save();

    return { success: result };
  }

  async editProfile(userId: string, status: string, bio: string): Promise<any> {
    if (!status || !bio) {
      throw new BadRequestException('Wrong body!');
    }

    if (status.length > 50) {
      throw new BadRequestException('Status too long!');
    }

    if (bio.length > 300) {
      throw new BadRequestException('Bio too long!');
    }

    const profile: any = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Profile not found!');
    }

    profile.status = status;
    profile.bio = bio;

    profile.save();

    return { success: true };
  }

  // toggle follow
  async toggleFollow(targetId: string, userId: string) {
    const targetProfile: any = await this.getProfile(targetId);

    if (!targetProfile) {
      throw new NotFoundException('Target not found!');
    }

    const profile: any = await this.getProfile(userId);

    if (!profile) {
      throw new NotFoundException('Profile not found!');
    }

    if (profile.following.includes(targetId)) {
      profile.following = profile.following.filter((id) => id !== targetId);

      targetProfile.followers = targetProfile.followers.filter(
        (id) => id !== userId,
      );
      targetProfile.save();

      profile.save();
      return { success: true };
    }

    profile.following.push(targetId);
    targetProfile.followers.push(userId);

    targetProfile.save();
    profile.save();

    return { success: true };
  }

  // ---- Profile Picture ---- //

  // Upload profile picture
  async uploadPicture(filename: string, userId: string): Promise<any> {
    // Get file from cache
    const file = fs.readFileSync(`./src/profile/cache/${filename}`);

    // Delete file from cache
    fs.unlink(`./src/profile/cache/${filename}`, (err) => {
      return err;
    });

    // get profile
    const profile = await this.getProfile(userId);

    // modify profile
    if (profile) {
      profile.buffer = file;
      profile.filename = filename;

      const result = await profile.save();

      return { modified: result.id };
    }
  }

  async getProfileImage(userId: string): Promise<any> {
    const directory = 'src/profile/cache';

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });

    const profile = await this.getProfile(userId);

    if (!profile) {
      throw new NotFoundException('Image not found!');
    }
    const img = profile.buffer.toString('base64');

    const data = img.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');

    fs.writeFileSync(`./src/profile/cache/${profile.filename}`, buf);

    return profile.filename;
  }
}
