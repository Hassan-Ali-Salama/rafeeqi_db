// services/elder.service.js
const prisma = require('../config/db.config');

/**
 * @description: ربط المرافق (Caregiver) بمسن (Elder) باستخدام كود الربط.
 * @param {string} caregiverId - ID المرافق (من JWT)
 * @param {string} pairingCode - كود الربط المميز للمسن
 * @returns {Promise<Object>} تفاصيل المسن الذي تم ربطه
 */
async function pairCaregiverToElder(caregiverId, pairingCode) {
    // 1. التحقق من أن المستخدم الطالب هو Caregiver (لزيادة الأمان)
    const caregiver = await prisma.user.findUnique({
        where: { user_id: caregiverId, role: 'CAREGIVER' }
    });

    if (!caregiver) {
        throw new Error('Access Denied. Only CAREGIVERs can initiate pairing.');
    }

    // 2. البحث عن المسن باستخدام كود الربط
    const elderDetails = await prisma.elder_Details.findUnique({
        where: { pairing_code: pairingCode.toUpperCase() } // يجب التأكد من حالة الأحرف (يمكنك توحيدها إلى UpperCase)
    });

    if (!elderDetails) {
        throw new Error('Invalid pairing code. Elder not found.');
    }

    // 3. التحقق من أن المسن ليس لديه مرافق آخر (يمكن تعديل هذا الشرط حسب متطلبات العمل)
    if (elderDetails.caregiver_id) {
        throw new Error('This elder is already assigned to a caregiver.');
    }

    // 4. تنفيذ الربط (تحديث سجل Elder_Details)
    const updatedElder = await prisma.elder_Details.update({
        where: { elder_id: elderDetails.elder_id },
        data: {
            caregiver_id: caregiverId, // ربط المرافق الحالي
        },
        include: {
            user: {
                select: { full_name: true }
            }
        }
    });

    // 5. إرسال إشارة ربط (لإعلام المسن أو المرافقين الآخرين إذا لزم الأمر)
    // if (global.io) { global.io.emit('new_caregiver_pair', { elderId: updatedElder.elder_id, caregiverName: caregiver.full_name }); }

    return updatedElder;
}

module.exports = {
    pairCaregiverToElder,
};