import { ApiProperty } from '@nestjs/swagger';
import { Artist } from 'src/artists/entities/artist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @ApiProperty({ required: true, format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({ required: true, example: 'Innuendo' })
  @Column()
  name: string;
  @ApiProperty({ required: false, example: 1991 })
  @Column()
  year: number;
  @ApiProperty({ required: false, format: 'uuid', nullable: true })
  @ManyToOne(() => Artist)
  artistId: string | null;
}
