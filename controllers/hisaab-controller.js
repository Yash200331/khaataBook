const hisaabModel = require('../models/hisaab-model');
const userModel = require('../models/user-model');
module.exports.createHisaabController = async (req,res) => {
    let {title, description, passcode, shareable, encrypted, editpermissions} = req.body;

    shareable = shareable === "on" ? true : false;
    editpermissions = editpermissions === "on" ? true : false;
    encrypted = encrypted === "on" ? true : false;



    let hisaabcreated = await  hisaabModel.create({ 
        title,
        description,
        passcode,
        shareable,
        encrypted,
        editpermissions,
        user: req.user._id
    })

    let user = await userModel.findOne({email:req.user.email});
    user.hisaab.push(hisaabcreated._id);
    res.redirect('/profile');
    user.save();
}

module.exports.hisaabPageController = (req, res) => {
    res.render('create')
}