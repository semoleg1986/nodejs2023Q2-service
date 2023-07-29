import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isString, isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { DatabaseService } from 'src/database/database';

@Injectable()
export class AlbumsService {
  // private readonly albums: Album[] = [];
  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    DatabaseService.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return DatabaseService.albums;
  }

  isValidAlbumId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): Album {
    return DatabaseService.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateAlbumDto.artistId && !isString(updateAlbumDto.artistId)) {
      throw new BadRequestException('Invalid dto');
    }
    const album = DatabaseService.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    if (updateAlbumDto.name) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId) {
      album.artistId = updateAlbumDto.artistId;
    }
    return album;
  }

  remove(id: string) {
    const album = DatabaseService.albums.find((album) => album.id === id);
    const albumIndex = DatabaseService.albums.findIndex(
      (album) => album.id === id,
    );
    if (album) {
      DatabaseService.albums.splice(albumIndex, 1);
      DatabaseService.favorites.albums =
        DatabaseService.favorites.albums.filter((albumId) => albumId !== id);
      DatabaseService.tracks.forEach((album) => {
        if (album.albumId === id) {
          album.albumId = null;
        }
      });
    }
  }
}
