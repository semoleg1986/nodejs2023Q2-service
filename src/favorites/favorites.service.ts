import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { isUUID } from 'class-validator';
import { DatabaseService } from 'src/database/database';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class FavoritesService {
  @Inject(ArtistsService)
  private artistsService: ArtistsService;
  @Inject(AlbumsService)
  private albumsService: AlbumsService;
  @Inject(TracksService)
  private tracksService: TracksService;
  addTrackToFavorites(trackId: string) {
    if (!isUUID(trackId, 'all')) {
      throw new BadRequestException('Invalid trackId');
    }
    const track = DatabaseService.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    DatabaseService.favorites.tracks.push(trackId);
    return track;
  }
  addAlbumToFavorites(albumId: string) {
    if (!isUUID(albumId, 'all')) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = DatabaseService.albums.find((album) => album.id === albumId);
    if (album) {
      DatabaseService.favorites.albums.push(albumId);
      return album;
    } else {
      throw new UnprocessableEntityException('Album not found');
    }
  }
  addArtistToFavorites(artistId: string) {
    if (!isUUID(artistId, 'all')) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = DatabaseService.artists.find(
      (artist) => artist.id === artistId,
    );
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    DatabaseService.favorites.artist.push(artistId);
    return artist;
  }
  findAll() {
    const artists = DatabaseService.favorites.artist.map((artist) =>
      this.artistsService.findOne(artist),
    );

    const albums = DatabaseService.favorites.albums.map((album) =>
      this.albumsService.findOne(album),
    );

    const tracks = DatabaseService.favorites.tracks.map((track) =>
      this.tracksService.findOne(track),
    );

    return { artists, albums, tracks };
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }
}
