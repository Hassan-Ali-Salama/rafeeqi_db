// routes/index.js
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const readingRoutes = require('./reading.routes');
const userRoutes = require('./user.routes');
const elderRoutes = require('./elder.routes');
// const userRoutes = require('./user.routes'); // سيتم إضافته لاحقاً
// const readingRoutes = require('./reading.routes'); // سيتم إضافته لاحقاً

// ربط مسارات التوثيق (Authentication)
router.use('/auth', authRoutes);
router.use('/readings', readingRoutes);
router.use('/users', userRoutes);

// ربط مسارات المسنين (Elders)
router.use('/elders', elderRoutes); // المسار سيكون: /api/v1/elders

// TODO: ربط مسارات الوحدات الأخرى هنا

module.exports = router;