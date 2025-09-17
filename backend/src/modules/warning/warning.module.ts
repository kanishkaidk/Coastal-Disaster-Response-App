import { Module } from '@nestjs/common';
import { WarningService } from './warning.service';
import { WarningController } from './warning.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [WarningService],
  controllers: [WarningController],
  exports: [WarningService],
})
export class WarningModule {}
