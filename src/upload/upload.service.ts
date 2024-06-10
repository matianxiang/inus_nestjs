import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Img } from './entities/img.entity';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Img)
    private imgRepository: Repository<Img>,
    private configService: ConfigService,
  ) {}

  async uploadImg(file: Express.Multer.File): Promise<Img> {
    const { path } = file;

    // 使用 sharp 来获取图像的宽度、高度和大小
    const image = sharp(path);
    const metadata = await image.metadata();
    const relativeUrl = join('images', file.originalname);
    const newImg = this.imgRepository.create({
      height: metadata.height,
      width: metadata.width,
      size: file.size,
      url: `${this.configService.get<string>('HOST')}:${this.configService.get<string>('PORT')}/${relativeUrl}`, // 将完整路径转换为相对路径
    });

    await this.imgRepository.save(newImg);
    return newImg;
  }

  async queryImg(img_id: string): Promise<Img> {
    const res = await this.imgRepository.findOne({ where: { id: img_id } });
    return res;
  }
}
