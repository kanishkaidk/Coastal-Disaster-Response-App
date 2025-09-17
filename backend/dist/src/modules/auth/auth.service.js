"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    jwt;
    constructor(jwt) {
        this.jwt = jwt;
    }
    async login(phone, otp) {
        if (!phone || !otp)
            throw new common_1.UnauthorizedException('Invalid credentials');
        // TODO: verify OTP; for now accept any
        const userId = 'demo-user-id';
        const role = 'citizen';
        const accessToken = await this.jwt.signAsync({ sub: userId, role });
        const refreshToken = await this.jwt.signAsync({ sub: userId, type: 'refresh' }, { expiresIn: '7d' });
        return { app: 'Coast-Kavach', accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET || 'dev-secret' });
            if (payload.type !== 'refresh')
                throw new common_1.UnauthorizedException('Invalid token');
            const accessToken = await this.jwt.signAsync({ sub: payload.sub, role: payload.role });
            const nextRefresh = await this.jwt.signAsync({ sub: payload.sub, type: 'refresh', role: payload.role }, { expiresIn: '7d' });
            return { app: 'Coast-Kavach', accessToken, refreshToken: nextRefresh };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map