import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Imgs')
export class Img {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar' })
  url: string;
}
