import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Album } from 'src/albums/entities/album.entity';

@Entity('album-fav')
export class AlbumFav {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  albumId: string | null;

  @OneToOne(() => Album, (album) => album.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  album: Album;
}
