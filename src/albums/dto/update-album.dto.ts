import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty({ required: true, example: 'Innuendo' })
  name: string;
  @ApiProperty({ required: false, example: 1991 })
  year: number;
  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  @IsString()
  artistId: string | null;
}
