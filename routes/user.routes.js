// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/v1/users/:userId
// يتطلب فقط توكن صالح (يتم تطبيق منطق الوصول داخل الخدمة)
router.get('/:userId', protect, userController.getUser);

module.exports = router;