import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { TrackFav } from './entities/favTrack.entity';
import { AlbumFav } from './entities/favAlbum.entity';
import { ArtistFav } from './entities/favArtist.entity';

@Module({
  imports: [ArtistsModule, AlbumsModule, TracksModule, TypeOrmModule.forFeature([Favorite, Track, Album, Artist, TrackFav, AlbumFav, ArtistFav])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
