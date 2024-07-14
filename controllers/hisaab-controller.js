const { isLoggedIn } = require('../middlewares/auth-middleware');
const hisaabModel = require('../models/hisaab-model');
const userModel = require('../models/user-model');
module.exports.createHisaabController = async (req, res) => {
    let { title, description, passcode, shareable, encrypted, editpermissions } = req.body;

    try {
        if (!title || !description) {
            req.flash("error", "All fields are required");
            return res.redirect('/hisaab/create');
        }

        if (title.length < 4) {
            req.flash('error', "Title must be at least 4 characters");
            return res.redirect('/hisaab/create');
        }

        shareable = shareable === "on";
        editpermissions = editpermissions === "on";
        encrypted = encrypted === "on";

        const hisaabcreated = await hisaabModel.create({
            title,
            description,
            passcode,
            shareable,
            encrypted,
            editpermissions,
            user: req.user._id
        });

        const user = await userModel.findOne({ email: req.user.email });
        user.hisaab.push(hisaabcreated._id);
        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error('Error creating Hisaab:', error);
        req.flash('error', 'Failed to create Hisaab. Please try again.');
        res.redirect('/hisaab/create');
    }
};


module.exports.hisaabPageController = (req, res) => {
    res.render('create',{error:req.flash('error')})
}

module.exports.readHisaabController = async (req, res) => {
    try {
        const id = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: id });

        if (!hisaab) {
            return res.redirect('/profile');
        }

        if (hisaab.encrypted) {
            return res.render('passcode', { id, isLoggedIn: true });
        }

        res.render('hisaab', { isLoggedIn: true, hisaab });
    } catch (error) {
        console.error('Error reading Hisaab:', error);
        res.redirect('/profile'); // Handle error appropriately
    }
};


module.exports.readVerifiedHisaabController = async (req, res) => {
    try {
        const id = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: id });

        if (!hisaab) {
            return res.redirect('/profile');
        }

        if (hisaab.passcode !== req.body.passcode) {
            return res.redirect('/profile');
        }

        return res.render('hisaab', { isLoggedIn: true, hisaab });
    } catch (error) {
        console.error('Error reading verified Hisaab:', error);
        res.redirect('/profile'); // Handle error appropriately
    }
};


module.exports.deleteController = async (req, res) => {
    try {
        const id = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: id, user: req.user.id });

        if (!hisaab) {
            req.flash('error', "You are not authorized to delete this hisaab");
            return res.redirect('/profile');
        }

        await hisaabModel.deleteOne({ _id: id });

        return res.redirect('/profile');
    } catch (error) {
        console.error('Error deleting Hisaab:', error);
        res.redirect('/profile'); // Handle error appropriately
    }
};

module.exports.editController = async (req, res) => {
    try {
        const id = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: id });

        if (!hisaab) {
            req.flash('error', "You are not authorized to edit this hisaab");
            return res.redirect('/profile');
        }

        return res.render('edit', { isLoggedIn: true, hisaab });
    } catch (error) {
        console.error('Error editing Hisaab:', error);
        res.redirect('/profile'); // Handle error appropriately
    }
};

module.exports.editPostController = async (req, res) => {
    try {
        const id = req.params.id;
        const hisaab = await hisaabModel.findOne({ _id: id });

        if (!hisaab) {
            req.flash('error', "You are not authorized to edit this hisaab");
            return res.redirect('/profile');
        }

        hisaab.title = req.body.title;
        hisaab.description = req.body.description;
        hisaab.editpermissions = req.body.editpermissions === 'on';
        hisaab.shareable = req.body.shareable === 'on';
        hisaab.encrypted = req.body.encrypted === 'on';
        hisaab.passcode = req.body.passcode;

        await hisaab.save();

        return res.redirect('/profile');
    } catch (error) {
        console.error('Error editing Hisaab:', error);
        res.redirect('/profile'); // Handle error appropriately
    }
};
