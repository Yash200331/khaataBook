
const express = require('express');
const router = express.Router();

const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middleware');
const { createHisaabController,hisaabPageController,readHisaabController,readVerifiedHisaabController, deleteController,editController,editPostController } = require('../controllers/hisaab-controller');

router.post('/create',isLoggedIn,createHisaabController)
router.get('/create',isLoggedIn,hisaabPageController); 
router.get('/view/:id',isLoggedIn,readHisaabController); 
router.post('/verify/:id',isLoggedIn,readVerifiedHisaabController); 
router.get('/delete/:id',isLoggedIn,deleteController); 
router.get('/edit/:id',editController); 
router.post('/edit/:id',editPostController);  







module.exports = router;
