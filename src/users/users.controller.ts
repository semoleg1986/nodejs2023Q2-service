import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The user has been created.',
    type: CreateUserDto,
  })
  @Post()
  @ApiOkResponse({ type: [User] })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): User {
    return plainToClass(User, this.usersService.create(createUserDto));
  }
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Got all users.', type: [User] })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'Got user by id.', type: [User] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!this.usersService.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  @ApiOperation({ summary: "Update user's password" })
  @ApiOkResponse({ description: "User's password changed", type: [User] })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!this.usersService.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }
    return plainToClass(User, this.usersService.update(id, updateUserDto));
  }
  @ApiOperation({ summary: 'Delete user password' })
  @ApiOkResponse({ description: 'User has been delete' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!this.usersService.isValidUserId(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.usersService.remove(id);
  }
}
