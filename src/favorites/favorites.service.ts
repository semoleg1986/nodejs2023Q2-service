import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { isUUID } from 'class-validator';
import { DatabaseService } from 'src/database/database';

@Injectable()
export class FavoritesService {
  addTrackToFavorites(trackId: string): string {
    if (!isUUID(trackId, 'all')) {
      throw new BadRequestException('Invalid trackId');
    }
    const track = DatabaseService.tracks.find((track) => track.id === trackId);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    DatabaseService.favorites.tracks.push(track);
    return 'Track added to favorites';
  }
  addAlbumToFavorites(albumId: string): string {
    if (!isUUID(albumId, 'all')) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = DatabaseService.albums.find((album) => album.id === albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    DatabaseService.favorites.albums.push(album);
    return 'Album added to favorites';
  }
  addArtistToFavorites(artistId: string): string {
    if (!isUUID(artistId, 'all')) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = DatabaseService.artists.find(
      (artist) => artist.id === artistId,
    );
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    DatabaseService.favorites.artist.push(artist);
    return 'Artist added to favorites';
  }
  findAll() {
    return {
      albums: DatabaseService.favorites.albums,
      artists: DatabaseService.favorites.artist,
      tracks: DatabaseService.favorites.tracks,
    };
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
