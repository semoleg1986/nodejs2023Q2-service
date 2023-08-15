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

@ApiTags('Artist')
@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiCreatedResponse({ description: 'Successful operation', type: Artist })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createArtistDto: CreateArtistDto): Artist {
    return plainToClass(Artist, this.artistsService.create(createArtistDto));
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @ApiOkResponse({ description: 'Successful operation', type: [Artist] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiOkResponse({ description: 'Successful operation', type: Artist })
  @ApiNotFoundResponse({ description: 'Artist was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return plainToClass(Artist, artist);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by UUID',
  })
  @ApiOkResponse({ description: 'The artist has been updated.', type: Artist })
  @ApiNotFoundResponse({ description: 'Artist was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Artist {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    return plainToClass(
      Artist,
      this.artistsService.update(id, updateArtistDto),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Artist was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async remove(@Param('id') id: string) {
    if (!this.artistsService.isValidArtistId(id)) {
      throw new BadRequestException('Invalid artistId');
    }

    try {
      await this.artistsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Artist not found');
      }
      console.error('Error while removing artist:', error.message);
      throw error;
    }
  }
}
