//NPM DEPENDENCIES
const express = require('express');
const router = express.Router();

const Agency = require('../models/Agency');
const {checkIfLoggedIn, redirectProfile, sendResponse} = require('./base');

// @desc    agency info is sent to db
// @route   POST '/agency'
// @access  private, partners only
// @tested 	No
router.post('/', async (req, res) => {
    const {
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio
    } = req.body;

    const newAgency = new Agency({
        agencyName,
        agencyWebsite,
        agencyPhone,
        agencyBio
    });
    try {
        await newAgency.save();
        console.log("agency data saved");
        return res.send('/users/profile');
    } catch (err) {
        console.log(err);
    }
});


// @desc    Render agency.ejs
// @route   GET '/agency'
// @access  Private, only userRole == partners
// @tested 	No
//TODO check if agency already added detail
router.get('/', checkIfLoggedIn, async (req, res) => {
    try {
        res.render('agency', {
            user: res.locals.user
        });
    } catch (err) {
        res.status(400).send(JSON.stringify({
            success: false,
            error: err
        }));
    }
});

module.exports = router;