import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class InscriptionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
    ) { }

    async register(eventId: string, userId: string) {
        const event = await this.eventsService.findOne(eventId);
        const user = await this.usersService.findById(userId);

        const inscriptionsCount = await this.prisma.inscription.count({
            where: { eventId },
        });
        if (inscriptionsCount >= event.capacity) {
            throw new HttpException(
                { error: 'EVENT_FULL', message: "Cet événement est complet." },
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const existing = await this.prisma.inscription.findFirst({
            where: { eventId, email: user.email },
        });
        if (existing) {
            throw new HttpException(
                {
                    error: 'DUPLICATE_EMAIL',
                    message: "Cette adresse email est deja enregistree pour cet evenement.",
                },
                HttpStatus.CONFLICT,
            );
        }

        return this.prisma.inscription.create({
            data: {
                userId,
                eventId,
                firstName: user.email.split('@')[0],
                lastName: '',
                email: user.email,
            },
        });
    }
}