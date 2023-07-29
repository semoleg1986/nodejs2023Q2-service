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

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    const newTrack = this.tracksService.create(createTrackDto);
    return newTrack;
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    const track = this.tracksService.findOne(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    return this.tracksService.update(id, updateTrackDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.tracksService.isValidTrackId(id)) {
      throw new BadRequestException('Invalid trackId');
    }
    const album = this.tracksService.findOne(id);
    if (!album) {
      throw new NotFoundException('Track not found');
    }
    this.tracksService.remove(id);
  }
}
