import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
