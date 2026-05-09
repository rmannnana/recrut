import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@Throttle({ auth: { limit: 10, ttl: 60000 } })
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@CurrentUser() user: any) {
        return this.authService.login(user);
    }

    @Post('refresh')
    refresh(@Body() dto: RefreshDto) {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    logout(@Body() dto: RefreshDto) {
        return this.authService.logout(dto.refreshToken);
    }

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    googleAuth() { }

    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@CurrentUser() user: any, @Res() res: any) {
        const tokens = await this.authService.login(user);
        const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
        return res.redirect(`${frontendUrl}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    }
}