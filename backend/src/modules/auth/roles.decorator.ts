import { SetMetadata } from '@nestjs/common';

export type AppRole = 'citizen' | 'marine_worker' | 'analyst' | 'moderator' | 'admin';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);


