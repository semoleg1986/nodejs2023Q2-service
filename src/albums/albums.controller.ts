import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    const newAlbum = this.albumsService.create(createAlbumDto);
    return newAlbum;
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Album {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = this.albumsService.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    return this.albumsService.update(id, updateAlbumDto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = this.albumsService.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    this.albumsService.remove(id);
  }
}
