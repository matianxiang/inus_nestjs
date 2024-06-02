import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { PostImg } from './entities/post-img.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Img } from 'src/upload/entities/img.entity';
import source from 'scripts/result';
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

  async mockPosts(): Promise<void> {
    for (let i = 15; i < source.length; i++) {
      const data = source[i];

      const img_ids = [];
      for (let j = 0; j < data.imgs.length; j++) {
        const { size, width, height, url } = data.imgs[j];

        // 创建img实体
        const img = await this.imgRepository.create({
          size,
          width,
          height,
          url,
        });
        await this.imgRepository.save(img);
        img_ids.push(img.id);
      }

      const { user_id, title, content, favour_count } = data;
      if (!title) console.log('data', data);
      // 创建post实体
      await this.createPost({
        user_id,
        title: title || '123',
        content: content || 'xxx',
        img_ids,
      });

      // 获取所有Post
      const posts = await this.postRepository.find();

      // 更新每个用户的 isActive 字段
      posts.forEach(async (post) => {
        post.favour_count = favour_count;
        await this.postRepository.save(post);
      });
    }
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const { user_id, title, content, img_ids } = createPostDto;
    const user = await this.userRepository.findOne({
      where: { user_id: user_id },
    });
    const post = this.postRepository.create({ user, title, content });
    // 保存 Post 实体以获取生成的 ID
    const savedPost = await this.postRepository.save(post);
    if (img_ids && img_ids.length > 0) {
      // 为每个 PostImg 创建实体并设置关联
      const imgEntities = img_ids.map(async (img_id: string) => {
        const Img = await this.imgRepository.findOne({ where: { id: img_id } });
        const img = this.postImgRepository.create({
          ...Img,
          post: savedPost, // 设置关联
          img: Img,
        });
        return this.postImgRepository.save(img);
      });

      // 等待所有 PostImg 实体保存完成
      await Promise.all(imgEntities);
    }
    // 更新user post_count
    user.post_count += 1;
    this.userRepository.update(user.user_id, {
      post_count: (user.post_count += 1),
    });

    return savedPost;
  }

  async deletePostsByIds(ids: string[]): Promise<void> {
    await this.postRepository.delete(ids);
    // 需要补充更新user post_count
    // ....
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
        (ci) => !imgs.some((i) => i.id === ci.img_id),
      );
      // 找出要添加的图片
      const imgsToAdd = imgs.filter(
        (i) => !currentImgs.some((ci) => ci.img_id === i.id),
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

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number }> {
    // return {
    //   posts: await this.postRepository.find({
    //     skip: (page - 1) * limit,
    //     take: limit,
    //   }),
    //   total: await this.postRepository.count(),
    // };
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    queryBuilder
      .leftJoin('post.user', 'user')
      // 这里要用leftJoin 不能用leftJoinAndSelect 否则会返回整个user
      // ”post" 是 Post 实体的别名。
      // "post.user" 指的是 Post 实体中 user 的关系属性。
      // "user" 是 User 实体的别名。
      .addSelect(['user.username', 'user.avatar_url']) // 仅选择需要的用户字段
      // 指定了额外从 User 表中选择 username 和 avatar_url 字段。
      .leftJoinAndSelect('post.imgs', 'imgs')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      posts: result,
      total: total,
    };
  }
}
