// services/auth.service.js
const prisma = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SALT_ROUNDS } = require('../config/jwt.config');

/**
 * @description: توليد كود رقمي عشوائي وفريد من 6 أرقام.
 * @returns {string} كود الربط
 */
function generateSixDigitCode() {
    // توليد رقم عشوائي بين 100000 و 999999
    return String(Math.floor(100000 + Math.random() * 900000));
}


/**
 * @description: تسجيل مستخدم جديد (Register).
 */
async function registerUser(email, password, full_name, role) {
    const lowerCaseEmail = email.toLowerCase(); 
    
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

let pairingCode = null;
    
    // 💡 إذا كان الدور ELDER، قم بتوليد كود الربط
    if (role === 'ELDER') {
        let isUnique = false;
        // حلقة لضمان أن الكود الذي تم توليده غير مستخدم بالفعل (حاسم لضمان @unique)
        while (!isUnique) {
            const potentialCode = generateSixDigitCode();
            const existingElder = await prisma.elder_Details.findUnique({
                where: { pairing_code: potentialCode }
            });
            if (!existingElder) {
                pairingCode = potentialCode;
                isUnique = true;
            }
        }
    }

    const newUser = await prisma.user.create({
        data: {
            email: lowerCaseEmail,
            password_hash,
            full_name,
            role,
            // إنشاء سجل Elder_Details تلقائيًا للمسنين
            ...(role === 'ELDER' && {
                elder_details: {
                    create: {pairing_code: pairingCode}, // 💡 إرسال الكود المُولَّد هنا
                }
            })
        },
        select: {
            user_id: true,
            email: true,
            full_name: true,
            role: true,
            createdAt: true,
        }
    });

    return newUser;
}

/**
 * @description: تسجيل دخول المستخدم (Login).
 */
async function loginUser(email, password) {
    const lowerCaseEmail = email.toLowerCase(); 

    // 1. البحث عن المستخدم (مع تضمين Elder_Details لجلب كود الربط)
    const user = await prisma.user.findUnique({
        where: { email: lowerCaseEmail }, 
        include: { 
            elder_details: {
                select: {
                    pairing_code: true
                }
            }
        }
    });

    if (!user) {
        throw new Error('Invalid email or password.'); 
    }

    // 2. مقارنة كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }

    // 3. إنشاء JWT
    const token = jwt.sign(
        { user_id: user.user_id, role: user.role }, 
        JWT_SECRET,
        { expiresIn: '7d' } 
    );
    
    // 4. إعداد كائن الرد (Response Data)
    const responseData = { 
        token, 
        user_id: user.user_id, 
        role: user.role, 
    };

    // 5. إضافة كود الربط إذا كان المستخدم مسنًا (ELDER)
    if (user.role === 'ELDER' && user.elder_details && user.elder_details.pairing_code) {
        responseData.pairing_code = user.elder_details.pairing_code;
    }
    
    // 💡 هذا الكائن كاملاً (بما في ذلك pairing_code) هو ما سيتم إرجاعه
    return responseData;
}

module.exports = {
    registerUser,
    loginUser,
};