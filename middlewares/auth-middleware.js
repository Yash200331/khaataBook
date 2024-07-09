const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
module.exports.isLoggedIn = async function (req, res, next) {
    if (req.cookies.token) {
        try {
            let decoded = await jwt.verify(req.cookies.token, process.env.JWT_KEY);
            let user = await userModel.findOne({email: decoded.email});
            req.user = user;
            next();

            }catch(err){
                res.send(err.message)
            }
        }
     else {
        res.redirect('/')
    }
}

module.exports.redirectIfLoggedIn = async function (req, res, next) {
    if (req.cookies.token) {
        try{
            jwt.verify(req.cookies.token, process.env.JWT_KEY);
            res.redirect('/profile')
        }catch(err){
            return next();
        }
    }else return next();
}
