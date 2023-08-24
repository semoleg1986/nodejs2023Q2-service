import { Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Artist)
  @JoinTable()
  artist: Artist;

  @ManyToOne(() => Album)
  @JoinTable()
  album: Album;

  @ManyToOne(() => Track)
  @JoinTable()
  track: Track;
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
