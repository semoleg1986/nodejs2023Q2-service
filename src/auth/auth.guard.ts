import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { userId, login } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userService.findOne(userId);
      if (user.login !== login) {
        throw new Error('Wrong Token');
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as any;
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
