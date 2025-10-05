// validation/schemas.js
const Joi = require('joi');

const VALID_ROLES = ['ELDER', 'CAREGIVER', 'ADMIN'];
const VALID_READING_TYPES = ['HeartRate', 'BloodPressure', 'Glucose', 'Temperature', 'Oxygen'];

// ... (مخططات Register و Login تبقى كما هي)
const registerSchema = Joi.object({
    // ... (كود Register Schema السابق)
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().min(3).required(),
    role: Joi.string().valid(...VALID_ROLES).uppercase().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


/**
 * @description: مخطط التحقق من صحة بيانات إضافة قراءة حيوية جديدة.
 */
const addReadingSchema = Joi.object({
    reading_type: Joi.string().valid(...VALID_READING_TYPES).required().messages({
        'any.only': `Reading type must be one of: ${VALID_READING_TYPES.join(', ')}.`
    }),
    value: Joi.number().greater(0).required().messages({
        'number.base': 'Value must be a number.',
        'number.greater': 'Value must be greater than zero.'
    }),
    unit: Joi.string().max(10).required() // مثل: 'bpm', 'mmHg'
});

module.exports = {
    registerSchema,
    loginSchema,
    addReadingSchema, // تصدير المخطط الجديد
};