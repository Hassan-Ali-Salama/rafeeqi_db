// controllers/auth.controller.js
const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validation/schemas'); // تأكد من مسار schemas.js

/**
 * @route POST /api/v1/auth/register
 * @description: معالجة طلب تسجيل المستخدم الجديد.
 */
async function register(req, res) {
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { email, password, full_name, role } = req.body;

    try {
        const newUser = await authService.registerUser(email, password, full_name, role.toUpperCase());
        
        res.status(201).json({ 
            message: 'User registered successfully. Please log in.',
            user_id: newUser.user_id,
            role: newUser.role
        });
    } catch (error) {
        if (error.code === 'P2002') { 
            return res.status(409).json({ error: 'Email already exists.' });
        }
        console.error('[Error] Registration failed:', error.message);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
}

/**
 * @route POST /api/v1/auth/login
 * @description: معالجة طلب تسجيل الدخول وإنشاء JWT.
 */
async function login(req, res) {
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const { email, password } = req.body;

    try {
        // 💡 [الاستخراج الحاسم]: جلب كائن الرد الكامل من الـ Service
        const responseData = await authService.loginUser(email, password); 
        
        // 💡 [النشر الحاسم]: استخدام Spread Operator لتضمين جميع الخصائص
        res.status(200).json({
            message: 'Login successful.',
            ...responseData, 
        });

    } catch (error) {
        res.status(401).json({ error: 'Authentication failed. Invalid credentials.' });
    }
}

module.exports = {
    register,
    login,
};