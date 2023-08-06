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
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}
  // private artists: Artist[] = [];
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (!isString(createArtistDto.name) || !isBoolean(createArtistDto.grammy)) {
      throw new BadRequestException('Invalid dto');
    }
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    // DatabaseService.artists.push(newArtist);
    // return newArtist;
    return await this.artistRepository.save(newArtist)
  }

  async findAll(): Promise<Artist[]> {
    // return DatabaseService.artists;
    return await this.artistRepository.find();
  }

  isValidArtistId(id: string): boolean {
    return isUUID(id, 'all');
  }

  async findOne(id: string): Promise<Artist | undefined> {
    // return DatabaseService.artists.find((artist) => artist.id === id);
    return this.artistRepository.findOne({ where: { id: id } })
    .then(artist => {
      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
      return artist;
    })
    .catch(error => {
      console.error('Error while fetching artist:', error.message);
      throw error;
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (!updateArtistDto) {
      throw new BadRequestException('Invalid dto');
    }

    const artist = await this.artistRepository.findOne({ where: { id: id } });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return this.artistRepository.save(artist);
  }

  async remove(id: string) {
    // const artist = DatabaseService.artists.find((artist) => artist.id === id);
    const artist = await this.artistRepository.findOne({ where: { id: id } });
    // const artistIndex = DatabaseService.artists.findIndex(
    //   (artist) => artist.id === id,
    // );
    if (!artist) {
      // DatabaseService.artists.splice(artistIndex, 1);
      throw new NotFoundException('Artist not found');
    }
    await this.artistRepository.remove(artist);
    DatabaseService.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    DatabaseService.favorites.artist =
      DatabaseService.favorites.artist.filter((artistId) => artistId !== id);
    DatabaseService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }
}
