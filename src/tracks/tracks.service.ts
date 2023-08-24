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
// import { DatabaseService } from 'src/database/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { Album } from 'src/albums/entities/album.entity';
// import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  // private tracks: Track[] = [];
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>, // private readonly favoritesService: FavoritesService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Invalid dto');
    }

    let artist: Artist | null = null;
    let album: Album | null = null;

    if (createTrackDto.artistId) {
      artist = await this.artistRepository.findOne({
        where: { id: createTrackDto.artistId },
      });
    }

    if (createTrackDto.albumId) {
      album = await this.albumRepository.findOne({
        where: { id: createTrackDto.albumId },
      });
    }

    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artist: artist,
      artistId: artist ? artist.id : null,
      album: album,
      albumId: album ? album.id : null,
      duration: createTrackDto.duration,
    };

    return await this.trackRepository.save(newTrack);
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  isValidTrackId(id: string): boolean {
    return isUUID(id, 'all');
  }

  async findOne(id: string) {
    // return DatabaseService.tracks.find((track) => track.id === id);
    return await this.trackRepository
      .findOne({ where: { id: id } })
      .then((track) => {
        if (!track) {
          throw new NotFoundException('Track not found');
        }
        return track;
      })
      .catch((error) => {
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
    const track = await this.trackRepository.findOne({ where: { id: id } });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    if (updateTrackDto.name !== undefined) {
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.duration !== undefined) {
      track.duration = updateTrackDto.duration;
    }
    if (updateTrackDto.artistId !== undefined) {
      track.artistId =
        updateTrackDto.artistId !== null ? updateTrackDto.artistId : null;
    }
    if (updateTrackDto.albumId !== undefined) {
      track.albumId =
        updateTrackDto.albumId !== null ? updateTrackDto.albumId : null;
    }
    return await this.trackRepository.save(track);
  }

  async remove(id: string) {
    // const track = DatabaseService.tracks.find((track) => track.id === id);
    const track = await this.trackRepository.findOne({ where: { id: id } });
    // const trackIndex = DatabaseService.tracks.findIndex(
    //   (track) => track.id === id,
    // );
    if (!track) {
      // await this.favoritesService.removeTrack(id);
      throw new NotFoundException('Track not found');
    }
    await this.trackRepository.remove(track);
  }
}
