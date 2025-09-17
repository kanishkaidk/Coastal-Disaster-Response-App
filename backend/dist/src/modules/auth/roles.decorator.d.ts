export type AppRole = 'citizen' | 'marine_worker' | 'analyst' | 'moderator' | 'admin';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
