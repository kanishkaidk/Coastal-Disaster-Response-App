import { Processor, WorkerHost } from '@nestjs/bullmq';

@Processor('sync-queue')
export class SyncProcessor extends WorkerHost {
  async process(job: any): Promise<any> {
    // TODO: handle queued sync items (reports/resources) on reconnect
    return { ok: true, jobId: job.id };
  }
}


