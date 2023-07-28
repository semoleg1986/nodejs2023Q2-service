import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { isBoolean, isString, isUUID } from 'class-validator';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];
  create(createArtistDto: CreateArtistDto) {
    if (!isString(createArtistDto.name) || !isBoolean(createArtistDto.grammy)) {
      throw new BadRequestException('Invalid dto');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  isValidArtistId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (
      !updateArtistDto ||
      !isString(updateArtistDto.name) ||
      !isBoolean(updateArtistDto.grammy)
    ) {
      throw new BadRequestException('Invalid dto');
    }
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    if (updateArtistDto.name) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.hasOwnProperty('grammy')) {
      artist.grammy = updateArtistDto.grammy;
    }
    return artist;
  }

  remove(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artist) {
      this.artists.splice(artistIndex, 1);
    }
  }
}
