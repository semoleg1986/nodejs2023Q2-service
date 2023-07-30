import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ required: true, description: 'User login' })
  login: string;
  @ApiProperty({ required: true, description: 'User password' })
  password: string;
}
