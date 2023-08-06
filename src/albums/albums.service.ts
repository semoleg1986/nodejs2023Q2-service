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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}
  // private readonly albums: Album[] = [];
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    // DatabaseService.albums.push(newAlbum);
    // return newAlbum;
    return await this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  isValidAlbumId(id: string): boolean {
    return isUUID(id, 'all');
  }

  async findOne(id: string): Promise<Album> {
    // return DatabaseService.albums.find((album) => album.id === id);
    return this.albumRepository.findOne({ where: { id: id } })
    .then(album => {
      if (!album) {
        throw new NotFoundException('Album not found');
      }
      return album;
    })
    .catch(error => {
      console.error('Error while fetching album:', error.message);
      throw error;
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateAlbumDto.artistId && !isString(updateAlbumDto.artistId)) {
      throw new BadRequestException('Invalid dto');
    }
    // const album = DatabaseService.albums.find((album) => album.id === id);
    const album = await this.albumRepository.findOne({ where: {id:id}})
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
    return this.albumRepository.save(album);
  }

  async remove(id: string) {
    // const album = DatabaseService.albums.find((album) => album.id === id);
    const album = await this.albumRepository.findOne({ where: {id: id}}); 
    // const albumIndex = DatabaseService.albums.findIndex(
    //   (album) => album.id === id,
    // );
    if (!album){
      throw new NotFoundException('Album not found');
    }
    await this.albumRepository.remove(album);
    DatabaseService.favorites.albums =
      DatabaseService.favorites.albums.filter((albumId) => albumId !== id);
    DatabaseService.tracks.forEach((album) => {
      if (album.albumId === id) {
        album.albumId = null;
      }
    });
    
  }
}
