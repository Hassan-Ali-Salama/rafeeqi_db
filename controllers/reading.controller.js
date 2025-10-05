// controllers/reading.controller.js
const readingService = require('../services/reading.service');
const { addReadingSchema } = require('../validation/schemas');

/**
 * @route POST /api/v1/readings
 * @description: إضافة قراءة حيوية جديدة للمستخدم المسن الذي أصدر الطلب.
 * يتطلب: JWT صالح
 * يتطلب: أن يكون المستخدم من نوع 'ELDER' (يتم التحقق منه في الـ Service)
 */
async function createReading(req, res) {
    // 1. التحقق من صحة البيانات باستخدام Joi
    const { error } = addReadingSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // الـ userId يتم إضافته إلى req.user بواسطة JWT Middleware
    const userId = req.user.user_id; 
    const { reading_type, value, unit } = req.body;

    try {
        const newReading = await readingService.addReading(userId, reading_type, value, unit);
        
        res.status(201).json({
            message: 'Vital sign reading successfully recorded.',
            data: newReading
        });

    } catch (error) {
        // خطأ شائع: المستخدم ليس Elder أو خطأ في قاعدة البيانات
        if (error.message.includes('ELDER')) {
            return res.status(403).json({ error: error.message });
        }
        console.error('[Error] Failed to create reading:', error);
        res.status(500).json({ error: 'Internal server error while recording reading.' });
    }
}


/**
 * @route GET /api/v1/readings/:elderId
 * @description: جلب أحدث القراءات لمسن معين.
 * يتطلب: JWT صالح
 * يتطلب: أن يكون الطالب هو المسن نفسه أو المرافق المرتبط به.
 */
async function getElderReadings(req, res) {
    const requesterId = req.user.user_id; // من JWT
    const elderId = req.params.elderId; 

    try {
        const readings = await readingService.getReadingsByElderId(requesterId, elderId);

        res.status(200).json({
            message: `Successfully retrieved ${readings.length} vital sign readings.`,
            data: readings
        });

    } catch (error) {
        if (error.message.includes('Access Denied')) {
            return res.status(403).json({ error: error.message });
        }
        if (error.message.includes('Elder not found')) {
            return res.status(404).json({ error: error.message });
        }
        console.error('[Error] Failed to retrieve readings:', error);
        res.status(500).json({ error: 'Internal server error while retrieving readings.' });
    }
}

module.exports = {
    createReading,
    getElderReadings,
};