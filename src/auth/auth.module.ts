import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    AccessTokenStrategy,
    JwtService,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
