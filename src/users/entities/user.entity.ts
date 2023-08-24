import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

class BigIntTransformer implements ValueTransformer {
  to(value: number): string {
    return value.toString();
  }

  from(value: string): number {
    return parseInt(value, 10);
  }
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ required: true, example: 'TestUser' })
  @Column()
  login: string;

  @ApiProperty({ required: true, description: 'user password' })
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ required: true, example: 1 })
  @Column()
  version: number;

  @ApiProperty({ required: true, example: 1655000000 })
  @Column('bigint', {
    transformer: new BigIntTransformer(),
  })
  createdAt: number;

  @ApiProperty({ required: true, example: 1655000000 })
  @Column('bigint', {
    transformer: new BigIntTransformer(),
  })
  updatedAt: number;
}
