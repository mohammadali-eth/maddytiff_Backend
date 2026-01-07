const express = require('express');
const router = express.Router();
const { addTiffin, getTiffins, getDashboardStats, updateTiffin, deleteTiffin } = require('../controllers/tiffinController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);

router.route('/')
    .post(protect, addTiffin)
    .get(protect, getTiffins);

router.route('/:id')
    .put(protect, updateTiffin)
    .delete(protect, deleteTiffin);

module.exports = router;
