import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(phone: string, otp: string) {
    if (!phone || !otp) throw new UnauthorizedException('Invalid credentials');
    // TODO: verify OTP; for now accept any
    const userId = 'demo-user-id';
    const role = 'citizen' as const;
    const accessToken = await this.jwt.signAsync({ sub: userId, role });
    const refreshToken = await this.jwt.signAsync({ sub: userId, type: 'refresh' }, { expiresIn: '7d' });
    return { app: 'Coast-Kavach', accessToken, refreshToken };
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


