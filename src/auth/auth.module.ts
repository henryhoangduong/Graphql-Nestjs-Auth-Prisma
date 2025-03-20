import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    PrismaService,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
