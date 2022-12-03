import { SharpPipe } from './sharp.pipe';
import * as fs from 'fs';

describe('SharpPipe', () => {
  it('should be defined', () => {
    expect(new SharpPipe()).toBeDefined();
  });

  it('should transform an image', () => {
    const sharpPipe = new SharpPipe();
    const image = fs.readFileSync('./src/profile/services/test/test.jpeg');
    expect(
      sharpPipe.transform({
        filename: 'test.jpeg',
        buffer: image,
        path: './src/profile/services/test/test.jpeg',
        size: 100,
        originalname: 'test.jpeg',
        fieldname: 'test.jpeg',
        encoding: 'base64',
        mimetype: 'image/jpeg',
        stream: fs.createReadStream('./src/profile/services/test/test.jpeg'),
        destination: './src/profile/services/test/test.jpeg',
        id: 'test.jpeg',
        metadata: {
          filename: 'test.jpeg',
          size: 100,
          encoding: 'base64',
          mimetype: 'image/jpeg',
          fieldname: 'test.jpeg',
        },
        contentType: 'image/jpeg',
        chunkSize: 100,
        bucketName: 'test.jpeg',
        md5: 'test.jpeg',
        uploadDate: new Date(),
      }),
    ).toBeDefined();
  });
});
