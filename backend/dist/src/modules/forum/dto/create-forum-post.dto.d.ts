export declare class CreateForumPostDto {
    type: string;
    content: string;
    mediaUrl?: string;
    location?: {
        lat: number;
        lng: number;
    };
    urgencyScore?: number;
    language?: string;
}
