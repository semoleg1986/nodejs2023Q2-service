import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist {
  @ApiProperty({ required: true, format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({ required: true, example: 'Freddie Mercury' })
  @Column()
  name: string;
  @ApiProperty({ required: false, example: false })
  @Column()
  grammy: boolean;
}
