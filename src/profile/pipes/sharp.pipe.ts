import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) {
      throw new BadRequestException('No image uploaded!');
    }
    const originalName = path.parse(image.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';

    await sharp(image.buffer)
      .resize(1024, 1024)
      .webp({ effort: 3 })
      .toFile(`./src/profile/cache/${filename}`);

    return filename;
  }
}
