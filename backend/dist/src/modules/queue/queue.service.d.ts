import { Queue } from 'bullmq';
export declare class QueueService {
    private readonly syncQueue;
    constructor(syncQueue: Queue);
    enqueueSync(payload: unknown): Promise<void>;
}
