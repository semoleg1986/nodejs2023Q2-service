import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    const newArtist = this.artistsService.create(createArtistDto);
    return newArtist;
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    return this.artistsService.update(id, updateArtistDto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    this.artistsService.remove(id);
  }
}
