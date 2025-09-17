import { WorkerHost } from '@nestjs/bullmq';
export declare class SyncProcessor extends WorkerHost {
    process(job: any): Promise<any>;
}
