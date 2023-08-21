import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
