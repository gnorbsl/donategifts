//NPM DEPENDENCIES
const express = require('express');
const router = express.Router();


//IMPORT USER MODEL
const User = require('../models/User');
const {checkIfLoggedIn, redirectProfile, sendResponse} = require('./base');

const userController = require('../controllers/userController')

// @desc    Render (home)
// @route   GET '/users'
// @access  Public
// @tested 	Yes
router.get('/', (req, res) => {
	try {
		res.status(200).render('home');
	} catch (error) {
		sendResponse(res, {status: 400, error: error})
	}
});

// @desc    Render signup.html
// @route   GET '/users/signup'
// @access  Public
// @tested 	Yes
router.get('/signup', redirectProfile, (req, res) => {
	try {
		res.status(200).render('signup', {
			user: res.locals.user
		});
	} catch (error) {
		sendResponse(res, {status: 400, error: error})

	}
});

// @desc
// @route   GET '/users/login'
// @access  Private
// @tested 	yes
router.get('/login', redirectProfile, (req, res) => {
	try {
		res.status(200).render('login', {
			user: res.locals.user
		});
	} catch (error) {
		sendResponse(res, {status: 400, error: error})
	}
});

// @desc    Render profile.html, grabs userId and render ejs data in static template
// @route   GET '/users/profile'
// @access  Private, only users
// @tested 	Yes
// TODO: add conditions to check userRole and limit 'createWishCard' access to 'partners' only
router.get('/profile', checkIfLoggedIn, async (req, res) => {
	try {
		res.render('profile', {
			user: res.locals.user
		});
	} catch (error) {
		sendResponse(res, {status: 400, error: error})
	}
});

// @desc    Update user about me info
// @route   PUT '/users/profile'
// @access  Private, only users
// @tested 	No?
router.put('/profile', checkIfLoggedIn, async (req, res) => {

	const updateResponse = await userController.updateProfile(req.session.userId, req.body);

	sendResponse(res, updateResponse);

});


// @desc    Create a newUser, hash password, issue session
// @route   POST '/users/signup'
// @access  Public
// @tested 	Yes
// TODO: display this message in signup.html client side as a notification alert
router.post('/signup', redirectProfile, async (req, res) => {

	const userResponse = await userController.signup(req);

	sendResponse(res, userResponse)
});



// @desc    Render login.html
// @route   POST '/users/login'
// @access  Public
// @tested 	Not yet
router.post('/login', redirectProfile, async (req, res) => {

	const userResponse = await userController.login(req.body);

	if (userResponse.error) {
		res.status(403);
		return res.redirect('/users/login');
	} else {
		req.session.userId = userResponse.id;
		return res.redirect('/users/profile');
	}

});

// @desc    Render login.html
// @route   GET '/users/logout'
// @access  Public
// @tested 	Not yet
router.get('/logout', checkIfLoggedIn, (req, res) => {
	req.session.destroy(err => {
		res.clearCookie(process.env.SESS_NAME);
		res.redirect('/users/login');
	});
});

module.exports = router;