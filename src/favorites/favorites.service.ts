import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { DatabaseService } from 'src/database/database';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite, FavoritesResponse } from './entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Repository } from 'typeorm';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { ArtistFav } from './entities/favArtist.entity';
import { TrackFav } from './entities/favTrack.entity';
import { AlbumFav } from './entities/favAlbum.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(ArtistFav)
    private readonly artistFavRepository: Repository<ArtistFav>,
    @InjectRepository(Artist)
    private readonly ArtistRepository: Repository<Artist>,

    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(TrackFav)
    private readonly trackFavRepository: Repository<TrackFav>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(AlbumFav)
    private readonly albumFavRepository: Repository<AlbumFav>,
    @InjectRepository(Album)
    private readonly AlbumRepository: Repository<Album>,
  ) {}
  @Inject(ArtistsService)
  private artistsService: ArtistsService;
  @Inject(AlbumsService)
  private albumsService: AlbumsService;
  @Inject(TracksService)
  private tracksService: TracksService;
  async addTrackToFavorites(trackId: string): Promise<void> {
    if (!isUUID(trackId, 'all')) {
      throw new BadRequestException('Invalid trackId');
    }
    const track = await this.trackRepository.findOne({ where: {id: trackId} });
    if (!track) {
      throw new UnprocessableEntityException("Track with the provided id doesn't exist");
    }

    const trackFav = new TrackFav();
    trackFav.track = track;

    await this.trackFavRepository.save(trackFav);
  }

  async addAlbumToFavorites(albumId: string): Promise<void> {
    if (!isUUID(albumId, 'all')) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = await this.AlbumRepository.findOne({ where: {id: albumId} });
    if (!album) {
      throw new UnprocessableEntityException("Album with the provided id doesn't exist");
    }

    const albumFav = new AlbumFav();
    albumFav.album = album;
    
    await this.albumFavRepository.save(albumFav);
  }

  async addArtistToFavorites(artistId: string): Promise<void> {
    if (!isUUID(artistId, 'all')) {
      throw new BadRequestException('Invalid artistId');
    }
    
    const artist = await this.ArtistRepository.findOne({ where: {id: artistId} });
    if (!artist) {
      throw new UnprocessableEntityException("Artist with the provided id doesn't exist");
    }
    const artistFav = new ArtistFav();
    artistFav.artist = artist;

    await this.artistFavRepository.save(artistFav);
  }

  async findAll() {
    const artistFavs = await this.artistFavRepository.find({ relations: {artist: true} });
    const albumFavs = await this.albumFavRepository.find({ relations: {album: true} });
    const trackFavs = await this.trackFavRepository.find({ relations: {track: true} });

    const artists = artistFavs.map(artistFav => artistFav.artist);
    const albums = albumFavs.map(albumFav => albumFav.album);
    const tracks = trackFavs.map(trackFav => trackFav.track);

    return { artists, albums, tracks };
  }
  

  async removeTrack(trackId: string): Promise<void> {
    const trackFav = await this.trackFavRepository.findOne({ where: { trackId } });

    if (!trackFav) {
      throw new NotFoundException('Track not found in favorites');
    }

    await this.trackFavRepository.delete(trackFav.id);
  }

  async removeAlbum(albumId: string): Promise<void>  {
    const albumFav = await this.albumFavRepository.findOne({where: { albumId } });
    if (!albumFav) {
      throw new NotFoundException('Album not found in favorites');
    }
    await this.albumFavRepository.delete(albumFav.id)
  }
  async removeArtist(artistId: string): Promise<void> {
    const artistFav = await this.artistFavRepository.findOne({ where: { artistId } });

    if (!artistFav) {
      throw new NotFoundException('Artist not found in favorites');
    }

    await this.artistFavRepository.delete(artistFav.id);
  }
}
