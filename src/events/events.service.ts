import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

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

    // Pour la mise à jour d'information d'un évènement:
    async update(id: string, dto: UpdateEventDto) {
        await this.findOne(id);

        const data: any = {};
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.date !== undefined) data.date = new Date(dto.date);
        if (dto.location !== undefined) data.location = dto.location;
        if (dto.capacity !== undefined) data.capacity = dto.capacity;

        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.event.delete({ where: { id } });
    }

}