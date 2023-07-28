import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
