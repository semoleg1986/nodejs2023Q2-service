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

@Injectable()
export class TracksService {
  private tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
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
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  isValidTrackId(id: string): boolean {
    return isUUID(id, 'all');
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!updateTrackDto.name || !updateTrackDto.duration) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateTrackDto.artistId && !isString(updateTrackDto.artistId)) {
      throw new BadRequestException('Invalid dto');
    }
    if (updateTrackDto.albumId && !isString(updateTrackDto.albumId)) {
      throw new BadRequestException('Invalid dto');
    }
    const track = this.tracks.find((track) => track.id === id);
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
    return track;
  }

  remove(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (track) {
      this.tracks.splice(trackIndex, 1);
    }
  }
}
