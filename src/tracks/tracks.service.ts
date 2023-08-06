import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { isString, isUUID } from 'class-validator';
import { DatabaseService } from 'src/database/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TracksService {
  // private tracks: Track[] = [];
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Invalid dto');
    }
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    // DatabaseService.tracks.push(newTrack);
    // return newTrack;
    return await this.trackRepository.save(newTrack)
  }

  async findAll() {
    // return DatabaseService.tracks;
    return  await this.trackRepository.find();
  }

  isValidTrackId(id: string): boolean {
    return isUUID(id, 'all');
  }

  async findOne(id: string) {
    // return DatabaseService.tracks.find((track) => track.id === id);
    return await this.trackRepository.findOne({ where: { id: id } })
    .then(track => {
      if (!track) {
        throw new NotFoundException('Track not found');
      }
      return track;
    })
    .catch(error => {
      console.error('Error while fetching track:', error.message);
      throw error;
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateTrackDto.artistId && !isString(updateTrackDto.artistId)) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateTrackDto.albumId && !isString(updateTrackDto.albumId)) {
      throw new BadRequestException('Invalid dto');
    }
    // const track = DatabaseService.tracks.find((track) => track.id === id);
    const track = await this.trackRepository.findOne({ where: {id:id}})
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    if (updateTrackDto.name) {
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.duration) {
      track.duration = updateTrackDto.duration;
    }
    if (updateTrackDto.artistId) {
      track.artistId = updateTrackDto.artistId;
    }
    if (updateTrackDto.albumId) {
      track.albumId = updateTrackDto.albumId;
    }
    return await this.trackRepository.save(track)
  }

  async remove(id: string) {
    // const track = DatabaseService.tracks.find((track) => track.id === id);
    const track = await this.trackRepository.findOne({ where: {id: id} });
    // const trackIndex = DatabaseService.tracks.findIndex(
    //   (track) => track.id === id,
    // );
    if (track) {
      DatabaseService.favorites.tracks =
        DatabaseService.favorites.tracks.filter((trackId) => trackId !== id);
      await this.trackRepository.remove(track);
    }
  }
}
