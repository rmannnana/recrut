import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user : null;
    }

    async validateGoogleUser(googleId: string, email: string) {
        return this.usersService.findOrCreateGoogleUser(googleId, email);
    }

    async login(user: any) {
        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async register(email: string, password: string) {
        const user = await this.usersService.create(email, password);
        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async refresh(token: string) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!stored || stored.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        await this.prisma.refreshToken.delete({ where: { token } });

        const tokens = await this.generateTokens(stored.user);
        await this.saveRefreshToken(stored.user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(token: string) {
        await this.prisma.refreshToken.deleteMany({ where: { token } });
        return { message: 'Logged out successfully' };
    }

    private async generateTokens(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
        });

        const refreshToken = uuidv4();

        return { accessToken, refreshToken };
    }

    private async saveRefreshToken(userId: string, token: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: { token, userId, expiresAt },
        });
    }
}