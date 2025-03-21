import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpInput } from './dto/signup-input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin-input';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        username: signUpInput.username,
        hashedPassword: hashedPassword,
        email: signUpInput.email,
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
  async signIn(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInInput.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const dbMatchPassword = argon.verify(
      user.hashedPassword,
      signInInput.password,
    );
    if (!dbMatchPassword) {
      throw new ForbiddenException('Access denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      { expiresIn: '7d' },
    );
    return {
      accessToken,
      refreshToken,
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    };
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshtoken: hashedRefreshToken },
    });
  }
  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshtoken: { not: null },
      },
      data: { hashedRefreshtoken: null },
    });
    return { loggedOut: true };
  }
  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    const doRefreshTokenMatch = await argon.verify(user.hashedRefreshtoken, rt);
    if (!doRefreshTokenMatch) {
      throw new ForbiddenException('Access denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
}
