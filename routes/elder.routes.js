// routes/elder.routes.js
const express = require('express');
const router = express.Router();
const elderController = require('../controllers/elder.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// POST /api/v1/elders/pair - ربط المرافق بالمسن
router.post('/pair', protect, restrictTo('CAREGIVER'), elderController.pairCaregiver);

module.exports = router;