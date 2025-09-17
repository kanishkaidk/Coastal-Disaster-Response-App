import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwt;
    constructor(jwt: JwtService);
    login(phone: string, otp: string): Promise<{
        app: string;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        app: string;
        accessToken: string;
        refreshToken: string;
    }>;
}
