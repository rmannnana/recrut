import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
}