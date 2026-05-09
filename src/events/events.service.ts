import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) { }

    // Méthode pour ajouter des évènements:
    async create(dto: CreateEventDto) {
        return this.prisma.event.create({
            data: {
                title: dto.title,
                description: dto.description,
                date: new Date(dto.date),
                location: dto.location,
                capacity: dto.capacity,
            },
        });
    }

    //Méthode pour lister les évènements avec des filtres de recherche et de date:
    async findAll(search?: string, date?: string) { // La recherche prendra en compte les mots-clés dans le titre, la description et le lieu, ainsi que la date
        return this.prisma.event.findMany({
            where: {
                AND: [
                    search
                        ? {
                            OR: [
                                { title: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } },
                                { location: { contains: search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                    date
                        ? {
                            date: {
                                gte: new Date(date),
                                lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
                            },
                        }
                        : {},
                ],
            },
            orderBy: { date: 'asc' },
        });
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) throw new NotFoundException('Événement introuvable');
        return event;
    }

}