// controllers/elder.controller.js
const elderService = require('../services/elder.service');
const Joi = require('joi'); // نحتاج Joi للتحقق من كود الربط

const pairSchema = Joi.object({
    // [التعديل الحاسم]: الآن نتوقع سلسلة رقمية طولها 6
    pairing_code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({ 
        'string.length': 'Pairing code must be exactly 6 digits.',
        'string.pattern.base': 'Pairing code must contain only numbers.',
        'any.required': 'Pairing code is required.'
    })
});



/**
 * @route POST /api/v1/elders/pair
 * @description: ربط المرافق بالمسن باستخدام كود الربط.
 */
async function pairCaregiver(req, res) {
    // التحقق من صحة كود الربط
    const { error } = pairSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { pairing_code } = req.body;
    const caregiverId = req.user.user_id; // ID المرافق من التوكن

    try {
        const result = await elderService.pairCaregiverToElder(caregiverId, pairing_code);

        res.status(200).json({
            message: `Successfully paired with Elder: ${result.user.full_name}.`,
            elder_id: result.elder_id,
            caregiver_id: result.caregiver_id
        });

    } catch (error) {
        // الرد برسائل خطأ وظيفية
        if (error.message.includes('Access Denied') || error.message.includes('Invalid pairing code') || error.message.includes('already assigned')) {
            return res.status(403).json({ error: error.message });
        }
        console.error('[Error] Pairing failed:', error);
        res.status(500).json({ error: 'Internal server error during pairing.' });
    }
}

module.exports = {
    pairCaregiver,
};