import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @ApiProperty({ required: true, example: 'Freddie Mercury' })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ required: false, example: false })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
