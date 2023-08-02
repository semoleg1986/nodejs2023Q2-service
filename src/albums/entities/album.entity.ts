import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;
  @ApiProperty({ required: true, example: 'Innuendo' })
  name: string;
  @ApiProperty({ required: false, example: 1991 })
  year: number;
  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  artistId: string | null;
}
