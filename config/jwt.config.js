// config/jwt.config.js
require('dotenv').config();

// الثوابت الأساسية للأمان والتوثيق
// يجب تغيير هذا المفتاح في الإنتاج وجعله سرياً للغاية!
const JWT_SECRET = process.env.JWT_SECRET || 'MESSI_IS_THE_BEST'; // مفتاح سري لتوقيع التوكن
const JWT_EXPIRES_IN = '7d'; // صلاحية التوكن: 7 أيام
const SALT_ROUNDS = 12; // مستوى تعقيد تشفير bcrypt (12 هو مستوى أمان مرتفع)

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SALT_ROUNDS,
};