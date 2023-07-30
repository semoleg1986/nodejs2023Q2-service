import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedError {
  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', description: 'Error message' })
  message: string;

  constructor(message: string) {
    this.statusCode = 401;
    this.message = message;
  }
}
