"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let SosService = class SosService {
    prisma;
    queue;
    constructor(prisma, queue) {
        this.prisma = prisma;
        this.queue = queue;
    }
    async create(userId, dto) {
        const locationWkt = `POINT(${dto.location.lng} ${dto.location.lat})`;
        // Create SOS record
        const sos = await this.prisma.sOS.create({
            data: {
                userId,
                message: dto.message,
                location: locationWkt,
                mediaUrl: dto.mediaUrl,
                delivered: false,
                channel: 'pending',
            },
            include: {
                user: {
                    select: { id: true, name: true, phone: true, role: true }
                }
            }
        });
        // Try delivery methods in order: Internet -> Mesh -> SMS -> Call
        const deliveryResult = await this.tryDeliveryMethods(sos);
        // Update SOS with delivery status
        const updatedSos = await this.prisma.sOS.update({
            where: { id: sos.id },
            data: {
                delivered: deliveryResult.delivered,
                channel: deliveryResult.channel,
            }
        });
        return {
            ...updatedSos,
            deliveryStatus: deliveryResult,
        };
    }
    async findAll(userId, limit = 20, offset = 0) {
        const where = userId ? { userId } : {};
        const sosList = await this.prisma.sOS.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                user: {
                    select: { id: true, name: true, role: true }
                }
            }
        });
        return sosList;
    }
    async findOne(id) {
        const sos = await this.prisma.sOS.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, phone: true, role: true }
                }
            }
        });
        if (!sos) {
            throw new common_1.NotFoundException('SOS not found');
        }
        return sos;
    }
    async getNearby(lat, lng, radiusMeters = 5000) {
        // Get nearby SOS alerts using PostGIS
        const nearbySos = await this.prisma.$queryRaw `
      SELECT 
        s.*,
        ST_Distance(s.location, ST_GeomFromText('POINT(${lng} ${lat})', 4326)) as distance
      FROM "SOS" s
      WHERE ST_DWithin(s.location, ST_GeomFromText('POINT(${lng} ${lat})', 4326), ${radiusMeters})
      ORDER BY distance ASC
    `;
        return nearbySos;
    }
    async tryDeliveryMethods(sos) {
        const attempts = [];
        const methods = [
            { name: 'internet', priority: 1 },
            { name: 'mesh', priority: 2 },
            { name: 'sms', priority: 3 },
            { name: 'call', priority: 4 },
        ];
        for (const method of methods) {
            try {
                const success = await this.tryDeliveryMethod(method.name, sos);
                attempts.push({ method: method.name, success, error: success ? undefined : 'Failed' });
                if (success) {
                    return {
                        delivered: true,
                        channel: method.name,
                        attempts,
                    };
                }
            }
            catch (error) {
                attempts.push({
                    method: method.name,
                    success: false,
                    error: error.message
                });
            }
        }
        return {
            delivered: false,
            channel: 'failed',
            attempts,
        };
    }
    async tryDeliveryMethod(method, sos) {
        switch (method) {
            case 'internet':
                return this.deliverViaInternet(sos);
            case 'mesh':
                return this.deliverViaMesh(sos);
            case 'sms':
                return this.deliverViaSMS(sos);
            case 'call':
                return this.deliverViaCall(sos);
            default:
                return false;
        }
    }
    async deliverViaInternet(sos) {
        try {
            // Simulate internet delivery (push notification, webhook, etc.)
            // In production, integrate with push notification service
            console.log(`SOS delivered via internet: ${sos.id}`);
            // Enqueue for emergency response team notification
            await this.queue.enqueueSync({
                type: 'sos_emergency',
                sosId: sos.id,
                userId: sos.userId,
                message: sos.message,
                location: sos.location,
                priority: 'critical',
            });
            return true;
        }
        catch (error) {
            console.error('Internet delivery failed:', error);
            return false;
        }
    }
    async deliverViaMesh(sos) {
        try {
            // Simulate mesh network delivery
            // In production, integrate with mesh networking service
            console.log(`SOS delivered via mesh: ${sos.id}`);
            // Enqueue for mesh relay
            await this.queue.enqueueSync({
                type: 'sos_mesh',
                sosId: sos.id,
                userId: sos.userId,
                message: sos.message,
                location: sos.location,
                priority: 'critical',
            });
            return true;
        }
        catch (error) {
            console.error('Mesh delivery failed:', error);
            return false;
        }
    }
    async deliverViaSMS(sos) {
        try {
            // Simulate SMS delivery
            // In production, integrate with SMS service (Twilio, etc.)
            const message = `SOS ALERT: ${sos.message || 'Emergency assistance needed'} - Location: ${sos.location} - From: ${sos.user.name} (${sos.user.phone})`;
            console.log(`SOS delivered via SMS: ${sos.id}`);
            console.log(`SMS Message: ${message}`);
            // In production, send actual SMS to emergency contacts
            // await this.smsService.send(emergencyContact, message);
            return true;
        }
        catch (error) {
            console.error('SMS delivery failed:', error);
            return false;
        }
    }
    async deliverViaCall(sos) {
        try {
            // Simulate call delivery
            // In production, integrate with calling service
            console.log(`SOS delivered via call: ${sos.id}`);
            // In production, initiate call to emergency services
            // await this.callService.initiate(emergencyNumber, sos);
            return true;
        }
        catch (error) {
            console.error('Call delivery failed:', error);
            return false;
        }
    }
    async getStats() {
        const total = await this.prisma.sOS.count();
        const delivered = await this.prisma.sOS.count({ where: { delivered: true } });
        const pending = await this.prisma.sOS.count({ where: { delivered: false } });
        const byChannel = await this.prisma.sOS.groupBy({
            by: ['channel'],
            _count: { channel: true }
        });
        return {
            total,
            delivered,
            pending,
            deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
            byChannel: byChannel.reduce((acc, item) => {
                acc[item.channel] = item._count.channel;
                return acc;
            }, {}),
        };
    }
};
exports.SosService = SosService;
exports.SosService = SosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], SosService);
//# sourceMappingURL=sos.service.js.map