const express = require('express');
const router = express.Router();
const { register, login, updateProfile, updatePassword, getAllUsers, updateUser, getAgents, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUser);
router.get('/agents', protect, getAgents); // Allow any logged in user to see agents

module.exports = router;
