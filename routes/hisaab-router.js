
const express = require('express');
const router = express.Router();

const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middleware');
const { createHisaabController,hisaabPageController } = require('../controllers/hisaab-controller');

router.post('/create',isLoggedIn,createHisaabController)
router.get('/create',isLoggedIn,hisaabPageController); 



module.exports = router;
