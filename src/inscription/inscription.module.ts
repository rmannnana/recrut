import { Module } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { InscriptionController } from './inscription.controller';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [EventsModule, UsersModule],
  providers: [InscriptionService],
  controllers: [InscriptionController],
})
export class InscriptionModule { }