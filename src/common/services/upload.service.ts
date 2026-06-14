import { Injectable } from '@nestjs/common';
const ImageKit = require('imagekit');

@Injectable()
export class UploadService {
  private imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT!,
  });

  async uploadImage(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const result = await this.imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpeg`,
      folder: `/${folder}`,
    });
    return result.url;
  }
}