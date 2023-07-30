import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;
  @ApiProperty({ required: true, example: 'TestUser' })
  login: string;
  @ApiProperty({ required: true, description: 'user password' })
  @Exclude()
  password: string;
  @ApiProperty({ required: true, example: 1 })
  version: number;
  @ApiProperty({ required: true, example: 1655000000 })
  createdAt: number;
  @ApiProperty({ required: true, example: 1655000000 })
  updatedAt: number;
}
