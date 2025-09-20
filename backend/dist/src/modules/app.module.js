"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const prisma_module_1 = require("./prisma/prisma.module");
const report_module_1 = require("./report/report.module");
const queue_module_1 = require("./queue/queue.module");
const forum_module_1 = require("./forum/forum.module");
const sos_module_1 = require("./sos/sos.module");
const warning_module_1 = require("./warning/warning.module");
const marine_worker_module_1 = require("./marine-worker/marine-worker.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            prisma_module_1.PrismaModule,
            report_module_1.ReportModule,
            queue_module_1.QueueModule,
            forum_module_1.ForumModule,
            sos_module_1.SosModule,
            warning_module_1.WarningModule,
            marine_worker_module_1.MarineWorkerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map