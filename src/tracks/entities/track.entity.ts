import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track {
  @ApiProperty({ required: true, format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ required: true, example: 'The Show Must Go On' })
  @Column()
  name: string;

  @ManyToOne(() => Artist)
  @JoinColumn({ name: "artistId" })
  artist: Artist;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @Column({ nullable: true })
  artistId: string | null;

  @ManyToOne(() => Album)
  @JoinColumn({ name: "albumId" })
  album: Album;

  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @Column({ nullable: true })
  albumId: string | null;
  
  @ApiProperty({ required: true, description: 'In seconds', example: 262 })
  @Column()
  duration: number;
}
