import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportModule } from './report/report.module';
import { QueueModule } from './queue/queue.module';
import { ForumModule } from './forum/forum.module';
import { SosModule } from './sos/sos.module';
import { WarningModule } from './warning/warning.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    HealthModule,
    AuthModule,
    UserModule,
    PrismaModule,
    ReportModule,
    QueueModule,
    ForumModule,
    SosModule,
    WarningModule,
  ],
})
export class AppModule {}


