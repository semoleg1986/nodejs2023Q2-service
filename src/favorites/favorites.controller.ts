import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
// import { CreateFavoriteDto } from './dto/create-favorite.dto';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(@Param('id') id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }
  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(@Param('id') id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }
  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id') id: string) {
    return this.favoritesService.removeTrack(id);
  }
  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id') id: string) {
    return this.favoritesService.removeAlbum(id);
  }
  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id') id: string) {
    return this.favoritesService.removeArtist(id);
  }
}
