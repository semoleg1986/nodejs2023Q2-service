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
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './public.decorator';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Signup',
    description: 'Signup new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful signup.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
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
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh and return access and refresh tokens',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful refresh.' })
  @ApiUnauthorizedResponse({ description: 'No refreshToken in body' })
  @ApiForbiddenResponse({ description: 'Refresh token is invalid or expired' })
  async refresh(@Body() refreshAuthDto: RefreshAuthDto) {
    return await this.authService.refresh(refreshAuthDto);
  }
}
