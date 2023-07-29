import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    if (track) {
      DatabaseService.favorites.tracks.push(trackId);
      return track;
    } else {
      throw new UnprocessableEntityException('Track not found');
    }
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
    if (artist) {
      DatabaseService.favorites.artist.push(artistId);
      return artist;
    } else {
      throw new UnprocessableEntityException('Artist not found');
    }
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

  removeTrack(id: string) {
    const track = DatabaseService.tracks.findIndex((track) => track.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    DatabaseService.tracks.splice(track, 1);
  }
  removeAlbum(id: string) {
    const album = DatabaseService.tracks.findIndex((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    DatabaseService.tracks.splice(album, 1);
  }
  removeArtist(id: string) {
    const artist = DatabaseService.tracks.findIndex(
      (artist) => artist.id === id,
    );
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    DatabaseService.tracks.splice(artist, 1);
  }
}
