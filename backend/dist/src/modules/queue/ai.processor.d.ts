import { WorkerHost } from '@nestjs/bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class AiProcessor extends WorkerHost {
    private readonly prisma;
    constructor(prisma: PrismaService);
    process(job: any): Promise<any>;
    private processForumPost;
    private processReport;
    private processSocialPost;
    private calculateTrustScore;
    private calculateUrgencyScore;
    private detectModerationFlags;
    private generateSummary;
    private generateTranslations;
    private generateRationale;
}
