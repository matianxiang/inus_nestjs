import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { PostImg } from './entities/post-img.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Img } from 'src/upload/entities/img.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PostImg)
    private postImgRepository: Repository<PostImg>,
    @InjectRepository(Img)
    private imgRepository: Repository<Img>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { user_id, title, content, imgs } = createPostDto;
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });
    const post = this.postRepository.create({ user, title, content });
    // 保存 Post 实体以获取生成的 ID
    const savedPost = await this.postRepository.save(post);
    if (imgs && imgs.length > 0) {
      // 为每个 PostImg 创建实体并设置关联
      const imgEntities = imgs.map(async (img_id: string) => {
        const Img = await this.imgRepository.findOne({ where: { id: img_id } });
        const img = this.postImgRepository.create({
          ...Img,
          post: savedPost, // 设置关联
        });
        return this.postImgRepository.save(img);
      });

      // 等待所有 PostImg 实体保存完成
      await Promise.all(imgEntities);
    }
    return savedPost;
  }

  async deletePostsByIds(ids: string[]): Promise<void> {
    await this.postRepository.delete(ids);
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<Post> {
    const { id, title, content, imgs } = updatePostDto;
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`No post found with id ${id}`);
    }
    post.title = title;
    post.content = content;
    // 处理图片更新
    if (imgs.length) {
      // 获取当前数据库中的图片
      const currentImgs = await this.postImgRepository.find({
        where: { post: { id } },
      });

      // 找出要删除的图片
      const imgsToDelete = currentImgs.filter(
        (ci) => !imgs.some((i) => i.id === ci.id),
      );
      // 找出要添加的图片
      const imgsToAdd = imgs.filter(
        (i) => !currentImgs.some((ci) => ci.id === i.id),
      );

      // 删除图片
      await this.postImgRepository.remove(imgsToDelete);

      // 添加新图片
      const newImgEntities = imgsToAdd.map((imgDto) => {
        const img = this.postImgRepository.create({
          ...imgDto,
          post,
        });
        return this.postImgRepository.save(img);
      });

      await Promise.all(newImgEntities);
    }
    return this.postRepository.save(post);
  }

  async getPostById(id: string): Promise<Post> {
    return this.postRepository.findOne({
      where: { id },
      relations: ['comments', 'imgs', 'user'],
    });
  }

  async getPostsByUserId(user_id: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
      relations: ['comments', 'imgs'],
    });
  }

  async toggleFavour(user_id: number, id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['favourited_by'],
    });

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }

    const isFavoured = post.favour_by.some((u) => u.user_id === user_id);

    if (isFavoured) {
      post.favour_by = post.favour_by.filter((u) => u.user_id !== user_id);
      user.favour_count = Math.max(0, user.favour_count - 1);
      user.favour_post_ids = user.favour_post_ids.filter((id) => id !== id);
    } else {
      post.favour_by.push(user);
      user.favour_count += 1;
      user.favour_post_ids.push(id);
    }
    await this.postRepository.save(post);
    await this.userRepository.save(user);
  }

  async toggleStar(user_id: number, id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['favourited_by'],
    });

    if (!user || !post) {
      throw new NotFoundException('User or Post not found');
    }

    const isStared = post.star_by.some((u) => u.user_id === user_id);

    if (isStared) {
      post.star_by = post.star_by.filter((u) => u.user_id !== user_id);
      user.star_count = Math.max(0, user.star_count - 1);
      user.star_post_ids = user.star_post_ids.filter((id) => id !== id);
    } else {
      post.star_by.push(user);
      user.star_count += 1;
      user.star_post_ids.push(id);
    }
    await this.postRepository.save(post);
    await this.userRepository.save(user);
  }

  async incrementShareCount(id: string): Promise<void> {
    const post = await this.postRepository.findOneByOrFail({ id: id });
    post.share_count += 1;
    await this.postRepository.save(post);
  }
}
