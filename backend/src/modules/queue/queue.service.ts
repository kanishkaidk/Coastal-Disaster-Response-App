import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('sync-queue') private readonly syncQueue: Queue) {}

  async enqueueSync(payload: unknown) {
    await this.syncQueue.add('sync', payload, { attempts: 3, removeOnComplete: true, backoff: { type: 'exponential' } });
  }
}


