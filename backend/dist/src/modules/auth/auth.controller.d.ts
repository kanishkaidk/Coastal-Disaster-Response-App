import { AuthService } from './auth.service';
declare class LoginDto {
    phone: string;
    otp: string;
}
declare class RefreshDto {
    refreshToken: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(body: LoginDto): Promise<{
        app: string;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(body: RefreshDto): Promise<{
        app: string;
        accessToken: string;
        refreshToken: string;
    }>;
}
export {};
