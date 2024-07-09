// index-router.js
const express = require('express');
const router = express.Router();
const { landingPageController,profileController,logoutController, registerPageController, registerController, loginController } = require('../controllers/index-controller');
const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middleware');

router.get('/', redirectIfLoggedIn, landingPageController);
router.get('/register', registerPageController);
router.post('/register', registerController);
router.post('/login', isLoggedIn, loginController);
router.get('/logout', logoutController);
router.get('/profile', isLoggedIn, profileController);


module.exports = router;
