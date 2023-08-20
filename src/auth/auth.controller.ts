import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Login',
    description: 'Logins a user and returns a JWT-token',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict. Login already exists' })
  @Public()
  async signup(@Body() createAuthDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.authService.signup(createAuthDto);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Logins a user and returns tokens',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({ description: 'Authentication failed' })
  @Public()
  async login(@Body() loginAuthDto: CreateUserDto) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        loginAuthDto,
      );
      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException('Authentication failed', HttpStatus.FORBIDDEN);
    }
  }
}
