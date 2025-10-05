// services/user.service.js
const prisma = require('../config/db.config');

/**
 * @description: جلب بيانات المستخدم مع تطبيق قواعد صارمة للوصول.
 * @param {string} requesterId - ID المستخدم الذي يطلب البيانات (من JWT)
 * @param {string} targetId - ID المستخدم المطلوب عرضه
 * @param {UserRole} requesterRole - دور المستخدم الذي يطلب البيانات (من JWT)
 * @returns {Promise<Object>} بيانات المستخدم المستهدَف (Target User Data)
 */
async function getUserDetails(requesterId, targetId, requesterRole) {
    // 1. قاعدة الوصول الأولى: يمكن للمستخدم عرض بياناته الخاصة دائماً
    if (requesterId === targetId) {
        // نختار فقط البيانات الأساسية والآمنة للعرض
        return prisma.user.findUnique({
            where: { user_id: targetId },
            select: {
                user_id: true,
                email: true,
                full_name: true,
                phone_number: true,
                role: true,
                createdAt: true,
                elder_details: requesterRole === 'ELDER' ? {
                    select: { elder_id: true, caregiver_id: true } // عرض بيانات Elder Details إذا كان هو نفسه مسن
                } : false
            },
        });
    }

    // 2. قاعدة الوصول الثانية: المسؤول (ADMIN) يمكنه عرض أي بيانات
    if (requesterRole === 'ADMIN') {
        // نختار البيانات التي يحتاجها المسؤول بما في ذلك الروابط
        return prisma.user.findUnique({
            where: { user_id: targetId },
            select: {
                user_id: true,
                email: true,
                full_name: true,
                phone_number: true,
                role: true,
                elder_details: {
                    select: { elder_id: true, caregiver_id: true }
                },
                cared_for: { // عرض المسنين الذين يرعاهم إذا كان هو المرافق
                    select: { elder_id: true, user: { select: { full_name: true } } }
                }
            }
        });
    }

    // 3. قاعدة الوصول الثالثة: المرافق (CAREGIVER)
    if (requesterRole === 'CAREGIVER') {
        // التحقق مما إذا كان المستخدم المطلوب (targetId) هو أحد المسنين الذين يرعاهم هذا المرافق (requesterId)
        
        // أ. إذا كان targetId هو ELDER، هل يرعاه requesterId؟
        const isCaredFor = await prisma.elder_Details.findFirst({
            where: {
                user_id: targetId,
                caregiver_id: requesterId,
            }
        });

        if (isCaredFor) {
            // المرافق يمكنه رؤية تفاصيل المسن الذي يرعاه
            return prisma.user.findUnique({
                where: { user_id: targetId },
                select: {
                    user_id: true,
                    full_name: true,
                    phone_number: true,
                    email: true,
                    role: true,
                    elder_details: {
                        select: { elder_id: true, medical_history: true }
                    }
                }
            });
        }
    }
    
    // 4. قاعدة الرفض الافتراضية: منع الوصول
    throw new Error('Access Denied. You are not authorized to view this user.');
}

module.exports = {
    getUserDetails,
};