import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RefreshAuthDto } from './dto/refresh-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(createAuthDto: CreateUserDto): Promise<User> {
    if (!createAuthDto.login || !createAuthDto.password) {
      throw new Error('Login and password are required');
    }
    return await this.usersService.create(createAuthDto);
  }

  async login(loginAuthDto: CreateUserDto) {
    const { login, password } = loginAuthDto;

    const user = await this.usersService.findOneByLogin(login);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessTokenOptions = {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    };

    const refreshTokenOptions = {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    };

    const accessToken = this.jwtService.sign(payload, accessTokenOptions);
    const refreshToken = this.jwtService.sign(payload, refreshTokenOptions);
    return { accessToken, refreshToken };
  }

  async refresh(refreshAuthDto: RefreshAuthDto) {
    console.log(refreshAuthDto);

    const { userId, login } = this.jwtService.verify(
      refreshAuthDto.refreshToken,
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      },
    );

    const user = await this.usersService.findOne(userId);
    if (user.login !== login) {
      throw new UnauthorizedException();
    }
    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessTokenOptions = {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    };

    const refreshTokenOptions = {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    };
    const accessToken = this.jwtService.sign(payload, accessTokenOptions);
    const newRefreshToken = this.jwtService.sign(payload, refreshTokenOptions);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
