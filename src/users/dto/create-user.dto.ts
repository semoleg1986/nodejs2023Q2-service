import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ required: true, example: 'test', description: 'User login' })
  @IsNotEmpty()
  @IsString()
  login: string;
  @ApiProperty({
    required: true,
    example: 'example',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
