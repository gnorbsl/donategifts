
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

async function signup(req) {

    const {
        fName,
        lName,
        email,
        password,
        userRole
    } = req.body;

    const user = await User.findOne({
        email: email
    });
    if (user) {
        return {status: 400, error: 'This email is already taken. Try another'}
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fName,
            lName,
            email,
            password: hashedPassword,
            userRole
        });
        req.session.userId = mongoose.Types.ObjectId(newUser._id);
        try {
            await newUser.save();
            //trying to add a second step here
            //if the userRole is partner then redirect to agency.ejs then profile.ejs
            if (newUser.userRole === 'partner') {
                return {status: 200, redirect: '/agency'}
            } else {
                return {status: 200, redirect: '/users/profile'}

            }
        } catch (err) {
            return {status: 500, error: err}
        }
    }
}

async function login(requestBody) {

    let response = {};
    const user = await User.findOne({
        email: requestBody.email
    });
    if (user) {
        if (await bcrypt.compare(requestBody.password, user.password)) {
            response.id = user.id
        } else {
            response.error = "password mismatch";
        }
    } else {
        response.error = "user not found";
    }

    return response;
}

async function updateProfile(userId, requestBody) {

    const user = await User.findOne({_id: userId});

    // candidate with id not found in database, return not found status 404
    if (!user) {
        return {status: 404, error:"User could not be found"};
    }

    // update user and add aboutMe
    User.updateOne(
        {_id: user._id},
        {aboutMe : requestBody.aboutMe },
        {multi:true},
        function(err, numberAffected){
            if (err)  return {status: 500, error: err}
        });

    return {status: 200, data: user}


}


module.exports = {signup, login, updateProfile}