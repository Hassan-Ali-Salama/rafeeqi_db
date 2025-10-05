// services/reading.service.js
const prisma = require('../config/db.config');

/**
 * @description: التحقق من أن الـ user_id هو بالفعل Elder ولديه سجل في Elder_Details.
 * @param {string} userId - الـ user_id القادم من JWT
 * @returns {Promise<string>} الـ elder_id المرتبط
 */
async function getElderIdFromUserId(userId) {
    // 1. البحث عن تفاصيل المسن المرتبطة بالـ user_id
    const elderDetails = await prisma.elder_Details.findUnique({
        where: { user_id: userId },
        select: { elder_id: true }
    });

    if (!elderDetails) {
        throw new Error('User is not registered as an ELDER or Elder details are missing.');
    }
    return elderDetails.elder_id;
}

/**
 * @description: إضافة قراءة حيوية جديدة.
 * @param {string} userId - مُصدِر القراءة (من JWT)
 * @param {string} reading_type
 * @param {number} value
 * @param {string} unit
 * @returns {Promise<Object>} القراءة الجديدة
 */
async function addReading(userId, reading_type, value, unit) {
    // 1. التحقق من صلاحية المستخدم والحصول على Elder ID
    const elder_id = await getElderIdFromUserId(userId);

    // 2. إنشاء سجل القراءة في قاعدة البيانات
    const newReading = await prisma.reading.create({
        data: {
            elder_id,
            reading_type,
            value,
            unit,
            // يمكن إضافة منطق معالجة الوقت الحقيقي هنا لاحقاً
        }
    });

    // 3. (منطق مستقبلي): إرسال تنبيه Socket.IO أو FCM إذا تجاوزت القراءة حداً معيناً
    // if (global.io && reading_type === 'HeartRate' && value > 120) {
    //    global.io.to(elder_id).emit('vital_alert', { message: 'High Heart Rate detected!' });
    // }
    
    return newReading;
}


/**
 * @description: جلب أحدث القراءات الحيوية لمسن معين.
 * @param {string} requesterId - ID المستخدم الذي يطلب البيانات (المرافق أو المسن نفسه)
 * @param {string} elderId - ID المسن الذي نريد قراءاته
 * @returns {Promise<Object[]>} قائمة بالقراءات
 */
async function getReadingsByElderId(requesterId, elderId) {
    // 1. التحقق من أن المسن موجود
    const elderDetails = await prisma.elder_Details.findUnique({
        where: { elder_id: elderId },
        select: { user_id: true, caregiver_id: true }
    });

    if (!elderDetails) {
        throw new Error('Elder not found.');
    }

    // 2. تطبيق قواعد الوصول الصارمة:
    const isElderHimself = elderDetails.user_id === requesterId;
    const isCaregiver = elderDetails.caregiver_id === requesterId;

    if (!isElderHimself && !isCaregiver) {
        // إذا لم يكن هو المسن نفسه أو المرافق المرتبط به، يتم رفض الوصول.
        // يمكننا إضافة دور ADMIN هنا إذا لزم الأمر
        throw new Error('Access Denied. Not authorized to view these readings.');
    }

    // 3. جلب القراءات (أحدث 20 قراءة، مرتبة تنازليًا حسب الوقت)
    const readings = await prisma.reading.findMany({
        where: { elder_id: elderId },
        orderBy: {
            timestamp: 'desc',
        },
        take: 20, // جلب آخر 20 قراءة فقط لتجنب تحميل كميات كبيرة من البيانات
    });

    return readings;
}

module.exports = {
    addReading,
    getReadingsByElderId,
};