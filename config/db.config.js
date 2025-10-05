// config/db.config.js
const { PrismaClient } = require('@prisma/client');

// تهيئة مثيل Prisma Client
// (نستخدم Log للتتبع المتقدم في بيئة التطوير)
const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
});

/**
 * @description: مصدر البيانات الموحد لكافة خدمات النظام.
 * @type {PrismaClient}
 */
module.exports = prisma;