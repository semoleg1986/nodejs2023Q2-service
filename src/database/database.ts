import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

export interface IDatabaseService {
  users: User[];
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
}

export const DatabaseService: IDatabaseService = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
};
