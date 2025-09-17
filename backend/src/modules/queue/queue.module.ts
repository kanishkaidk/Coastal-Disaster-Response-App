import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { AiProcessor } from './ai.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
    }),
    BullModule.registerQueue({ name: 'sync-queue' }),
  ],
  providers: [QueueService, AiProcessor],
  exports: [QueueService],
})
export class QueueModule {}


