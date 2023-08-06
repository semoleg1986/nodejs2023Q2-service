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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('Album')
@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiCreatedResponse({ description: 'Album is created', type: Album })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return plainToClass(Album, this.albumsService.create(createAlbumDto))
  }

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiOkResponse({ description: 'Successful operation', type: [Album] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Gets single album by id',
  })
  @ApiOkResponse({ description: 'Successful operation', type: Album })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Album was not found' })
  findOne(@Param('id') id: string): Album {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    const album = this.albumsService.findOne(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return plainToClass(Album, album);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiOkResponse({ description: 'The album has been updated.', type: Album })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Album was not found' })
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    return plainToClass(Album, this.albumsService.update(id, updateAlbumDto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Album was not found' })
  async remove(@Param('id') id: string) {
    if (!this.albumsService.isValidAlbumId(id)) {
      throw new BadRequestException('Invalid albumId');
    }
    
    try {
      this.albumsService.remove(id);
    } catch(error){
      if (error instanceof NotFoundException){
        throw new NotFoundException('Album not found');
      }
      console.error('Error while removing album:', error.message)
      throw error;
    }
  }
}
