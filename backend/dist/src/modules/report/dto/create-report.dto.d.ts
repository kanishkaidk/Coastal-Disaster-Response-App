export declare class CreateReportDto {
    type: string;
    description: string;
    mediaUrl?: string;
    location: {
        lat: number;
        lng: number;
    };
}
