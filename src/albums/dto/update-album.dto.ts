import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  name: string;
  year: number;
  @IsOptional()
  @IsString()
  artistId: string | null;
}
