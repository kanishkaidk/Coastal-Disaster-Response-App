"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const admin = await prisma.user.upsert({
        where: { phone: '+910000000001' },
        update: {},
        create: { phone: '+910000000001', name: 'Admin', role: client_1.Role.admin, language: 'en' },
    });
    const marine = await prisma.user.upsert({
        where: { phone: '+910000000002' },
        update: {},
        create: { phone: '+910000000002', name: 'Marine Worker', role: client_1.Role.marine_worker, language: 'en' },
    });
    const citizen = await prisma.user.upsert({
        where: { phone: '+910000000003' },
        update: {},
        create: { phone: '+910000000003', name: 'Citizen', role: client_1.Role.citizen, language: 'en' },
    });
    console.log({ admin, marine, citizen });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map