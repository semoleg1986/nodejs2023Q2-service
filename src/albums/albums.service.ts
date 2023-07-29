import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { isUUID } from 'class-validator';

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

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: number) {
    return `This action removes a #${id} album`;
  }
}
