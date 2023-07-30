import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ required: true, example: 'test', description: 'User login' })
  login: string;
  @ApiProperty({
    required: true,
    example: 'example',
    description: 'User password',
  })
  password: string;
}
