import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: true, description: 'Old password' })
  @IsNotEmpty()
  oldPassword: string;
  @ApiProperty({ required: true, description: 'New password' })
  @IsNotEmpty()
  newPassword: string;
}
