import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MarineWorkerController } from './marine-worker.controller';
import { MarineWorkerService } from './marine-worker.service';

@Module({
  imports: [PrismaModule],
  controllers: [MarineWorkerController],
  providers: [MarineWorkerService],
  exports: [MarineWorkerService],
})
export class MarineWorkerModule {}
