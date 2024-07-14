const userModel = require('../models/user-model');
const hisaabModel = require('../models/hisaab-model');
const flash = require('connect-flash')



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {isLoggedIn} = require('../middlewares/auth-middleware')


module.exports.landingPageController = (req, res) => {
    res.render('index',{loggedin:false,error:req.flash('error')});
};

module.exports.registerPageController = (req, res) => {
    res.render('register',{loggedin:false,error:req.flash('error')});
};

module.exports.registerController = async (req, res) => {
    try {
        let { email, username, password } = req.body;

        if (!email || !username || !password) {
            req.flash("error", "All fields are required");
            return res.redirect('/register');
        }

        if(username.length < 4){
            req.flash('error', "Username must be at least 4 characters")
            return res.redirect('/register');

        }

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "Email already exists!");
            return res.redirect('/register');
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports.loginController = async (req, res) => {
    try {
        let { email, password } = req.body;
    
   
        
        if (!email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect('/');
        }
    
        let user = await userModel.findOne({ email: email }).select("+password");
        if (!user) {
            req.flash("error","User not found. Please check your email.");
            return res.redirect("/");
        }
    
        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = jwt.sign({ email, id: user._id }, process.env.JWT_KEY);
                
    
                res.cookie("token", token );
                
                res.redirect("/profile");
            } else {
                req.flash("error", "Password is incorrect")
                return res.redirect("/");
            }
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send(err.message);
    }
};


module.exports.logoutController = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred during logout.');
            }
            res.clearCookie('token'); // Clear the token cookie
            res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during logout.');
    }
};

    

module.exports.profileController = async (req, res) => {

    let byDate = Number(req.query.byDate);
    let {startDate, endDate} = req.query;
    
    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1970-01-01");
    endDate = endDate? endDate : new Date();


    let user = await userModel.findOne({email:req.user.email}).populate({
        path:"hisaab",
        match: {createdAt : {$gte : startDate, $lte : endDate}},
        options: {sort: {createdAt: byDate}}
    });  


    res.render('profile',{user})


};