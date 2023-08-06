import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track {
  @ApiProperty({ required: true, format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ required: true, example: 'The Show Must Go On' })
  @Column()
  name: string;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @ManyToOne(() => Artist)
  artistId: string | null;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @ManyToOne(() => Album)
  albumId: string | null;
  
  @ApiProperty({ required: true, description: 'In seconds', example: 262 })
  @Column()
  duration: number;
}
