import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService], // Pour permettre d'utiliser EventsService dans InscriptionsModule
})
export class EventsModule { }