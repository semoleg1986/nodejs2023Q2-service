import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
    return 'This action get by id';
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
