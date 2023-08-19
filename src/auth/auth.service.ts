import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

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
}
