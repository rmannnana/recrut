import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('date') date?: string,
    ) {
        return this.eventsService.findAll(search, date);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN) /// Seuls les administrateurs peuvent créer des événements
    create(@Body() dto: CreateEventDto) {
        return this.eventsService.create(dto);
    }
}