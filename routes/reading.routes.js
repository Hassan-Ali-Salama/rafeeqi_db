// routes/reading.routes.js
const express = require('express');
const router = express.Router();
const readingController = require('../controllers/reading.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// جميع مسارات القراءات تتطلب أولاً:
// 1. 'protect': التحقق من وجود وصلاحية JWT
// 2. 'restrictTo('ELDER')': التحقق من أن المستخدم لديه دور ELDER فقط (المسن هو من يرسل قراءاته)

// POST /api/v1/readings
router.post('/', protect, restrictTo('ELDER'), readingController.createReading);


// GET /api/v1/readings/:elderId - جلب القراءات (مسموح للمسن والمرافق المرتبط)
// لا نستخدم restrictTo هنا لأن منطق الوصول المعقد يتم تنفيذه داخل الـ Service
router.get('/:elderId', protect, readingController.getElderReadings); 


// TODO: GET /api/v1/readings/elder (يتم تنفيذه لاحقاً)

module.exports = router;