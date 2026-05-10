import { Controller, Post, Param, Body, UseGuards, Get } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class InscriptionController {
    constructor(private readonly inscriptionService: InscriptionService) { }

    @Post(':id/register')
    register(
        @Param('id') eventId: string,
        @CurrentUser() user: any,
    ) {
        return this.inscriptionService.register(eventId, user.id);
    }

    @Get(':id/registrations')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    findAll(@Param('id') eventId: string): Promise<{ id: string; firstName: string; lastName: string; email: string; createdAt: Date; }[]> {
        return this.inscriptionService.findAll(eventId);
    }
}
