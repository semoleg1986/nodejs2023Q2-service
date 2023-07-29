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

@Injectable()
export class AlbumsService {
  private readonly albums: Album[] = [];
  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  isValidAlbumId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): Album {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateAlbumDto.artistId && !isString(updateAlbumDto.artistId)) {
      throw new BadRequestException('Invalid dto');
    }
    const album = this.albums.find((album) => album.id === id);
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
    const album = this.albums.find((album) => album.id === id);
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (album) {
      this.albums.splice(albumIndex, 1);
    }
  }
}
