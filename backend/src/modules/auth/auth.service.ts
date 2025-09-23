import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(phone: string, otp: string) {
    if (!phone || !otp) throw new UnauthorizedException('Invalid credentials');
    
    // For demo purposes, accept any OTP
    // In production, verify OTP with SMS service
    
    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          phone,
          name: 'User',
          role: 'citizen'
        }
      });
    }

    const accessToken = await this.jwt.signAsync({ 
      sub: user.id, 
      role: user.role,
      userId: user.id 
    });
    const refreshToken = await this.jwt.signAsync({ 
      sub: user.id, 
      type: 'refresh',
      role: user.role 
    }, { expiresIn: '7d' });
    
    return { 
      app: 'Coast-Kavach', 
      accessToken, 
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET || 'dev-secret' });
      if (payload.type !== 'refresh') throw new UnauthorizedException('Invalid token');
      const accessToken = await this.jwt.signAsync({ sub: payload.sub, role: payload.role });
      const nextRefresh = await this.jwt.signAsync({ sub: payload.sub, type: 'refresh', role: payload.role }, { expiresIn: '7d' });
      return { app: 'Coast-Kavach', accessToken, refreshToken: nextRefresh };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}


