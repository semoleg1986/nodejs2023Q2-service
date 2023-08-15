import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('Track')
@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiCreatedResponse({ description: 'Successful operation', type: Track })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  create(@Body() createTrackDto: CreateTrackDto) {
    return plainToClass(Track, this.tracksService.create(createTrackDto));
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiOkResponse({ description: 'Successful operation', type: [Track] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Get single track by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the track',
    type: 'string',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'Successful operation', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Track was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  findOne(@Param('id') id: string) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return plainToClass(Track, track);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiOkResponse({ description: 'The track has been updated.', type: Track })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Track was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    return plainToClass(Track, this.tracksService.update(id, updateTrackDto));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Track was not found' })
  @ApiBadRequestResponse({
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  async remove(@Param('id') id: string) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    try {
      await this.tracksService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Track not found');
      }
      console.error('Error while removing track:', error.message);
      throw error;
    }
  }
}
