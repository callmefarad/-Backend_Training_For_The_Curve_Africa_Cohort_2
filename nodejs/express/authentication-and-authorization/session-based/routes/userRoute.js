const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');


router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/signout', authController.signOut);

module.exports = router;