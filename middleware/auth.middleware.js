// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt.config');

/**
 * @description: Middleware للتحقق من صلاحية JSON Web Token (JWT).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function protect(req, res, next) {
    // 1. استخراج التوكن من Header
    // التوكن يجب أن يكون بالشكل: Authorization: Bearer <token>
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // فصل كلمة 'Bearer' للحصول على التوكن الفعلي
            token = req.headers.authorization.split(' ')[1];
            
            // 2. التحقق من التوكن (Verify)
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. دمج بيانات المستخدم المستخلصة من التوكن في كائن الطلب (req)
            // هذا يسمح للـ Controllers بمعرفة من هو المستخدم الذي يرسل الطلب
            req.user = {
                user_id: decoded.user_id,
                role: decoded.role
            };

            next(); // المتابعة إلى الـ Controller أو Middleware التالي

        } catch (error) {
            // خطأ في التحقق (مثل: انتهاء صلاحية التوكن، توقيع غير صحيح)
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        // إذا لم يتم العثور على التوكن في الـ Header
        return res.status(401).json({ error: 'Not authorized, no token provided.' });
    }
}

/**
 * @description: Middleware للتحقق من أن المستخدم لديه أحد الأدوار المحددة.
 * @param {...UserRole} roles - قائمة الأدوار المسموح بها (مثل: 'ELDER', 'CAREGIVER')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
            // رفض الوصول إذا كان الدور غير مصرح به
            return res.status(403).json({ 
                error: `Forbidden. User role (${req.user ? req.user.role : 'None'}) is not authorized for this action.`,
            });
        }
        next();
    };
};

module.exports = {
    protect,
    restrictTo,
};