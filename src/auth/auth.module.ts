import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthResolver, AuthService, PrismaService, PrismaService],
})
export class AuthModule {}
