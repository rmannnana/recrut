import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(email: string, password: string) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: { email, password: hashed },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findOrCreateGoogleUser(googleId: string, email: string) {
        let user = await this.prisma.user.findUnique({ where: { googleId } });
        if (!user) {
            user = await this.prisma.user.create({
                data: { email, googleId },
            });
        }
        return user;
    }

    async updateRole(id: string, role: Role) {
        return this.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
}