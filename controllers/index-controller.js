const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {isLoggedIn} = require('../middlewares/auth-middleware')

module.exports.landingPageController = (req, res) => {
    res.render('index',{loggedin:false});
};

module.exports.registerPageController = (req, res) => {
    res.render('register');
};

module.exports.registerController = async (req, res) => {
    try {
        let { email, username, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send({ error: 'Email already exists' });
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
        res.send("registration success");
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports.loginController = async (req, res) => {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "You do not have an account, please create one." });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(400).send({ error: "Incorrect password" });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect('/profile')
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports.logoutController = (req, res) => {
    res.clearCookie("token");
    res.send("Logout Successful");
    res.redirect('/')
};
module.exports.profileController = (req, res) => {
    console.log(req.user);
    res.render('profile')
};