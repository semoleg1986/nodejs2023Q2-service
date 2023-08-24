import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';

@Entity('artist-fav')
export class ArtistFav {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  artistId: string | null;

  @OneToOne(() => Artist, (artist) => artist.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  artist: Artist;
}
