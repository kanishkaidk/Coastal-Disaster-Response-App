export declare class ForumQueryDto {
    lat?: number;
    lng?: number;
    radius?: number;
    type?: string;
    status?: string;
    minUrgency?: number;
    minTrust?: number;
    language?: string;
    search?: string;
    author?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
    cursor?: string;
}
