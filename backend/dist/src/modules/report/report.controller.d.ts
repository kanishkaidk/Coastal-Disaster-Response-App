import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reports;
    constructor(reports: ReportService);
    create(req: any, dto: CreateReportDto): Promise<{
        app: string;
        result: number;
    }>;
    nearby(lat: string, lng: string): Promise<{
        app: string;
        data: never[];
    }>;
}
