// controllers/user.controller.js
const userService = require('../services/user.service');

/**
 * @route GET /api/v1/users/:userId
 * @description: جلب تفاصيل مستخدم معين بناءً على قواعد الوصول.
 * يتطلب: JWT صالح
 */
async function getUser(req, res) {
    // بيانات الطالب (Requester) تأتي من JWT Middleware (req.user)
    const requesterId = req.user.user_id;
    const requesterRole = req.user.role;
    // ID المستخدم المطلوب
    const targetId = req.params.userId;

    try {
        const userDetails = await userService.getUserDetails(requesterId, targetId, requesterRole);

        if (!userDetails) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'User details retrieved successfully.',
            data: userDetails
        });

    } catch (error) {
        // رفض الوصول يتم التقاطه من الخدمة
        if (error.message.includes('Access Denied')) {
            return res.status(403).json({ error: error.message });
        }
        console.error('[Error] Failed to get user details:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = {
    getUser,
};