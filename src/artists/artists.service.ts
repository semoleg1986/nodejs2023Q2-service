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
import { DatabaseService } from 'src/database/database';

@Injectable()
export class ArtistsService {
  // private artists: Artist[] = [];
  create(createArtistDto: CreateArtistDto) {
    if (!isString(createArtistDto.name) || !isBoolean(createArtistDto.grammy)) {
      throw new BadRequestException('Invalid dto');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    DatabaseService.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return DatabaseService.artists;
  }

  isValidArtistId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string): Artist | undefined {
    return DatabaseService.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (
      !updateArtistDto ||
      !isString(updateArtistDto.name) ||
      !isBoolean(updateArtistDto.grammy)
    ) {
      throw new BadRequestException('Invalid dto');
    }
    const artist = DatabaseService.artists.find((artist) => artist.id === id);
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
    const artist = DatabaseService.artists.find((artist) => artist.id === id);
    const artistIndex = DatabaseService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artist) {
      DatabaseService.artists.splice(artistIndex, 1);
    }
  }
}
