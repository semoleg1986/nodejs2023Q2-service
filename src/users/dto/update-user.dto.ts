import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: true, description: 'Old password' })
  oldPassword: string;
  @ApiProperty({ required: true, description: 'New password' })
  newPassword: string;
}
