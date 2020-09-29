
// Middleware for users
const checkIfLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};
const redirectProfile = (req, res, next) => {
    if (req.session.userId) {
        res.redirect(`/users/profile`);
    } else {
        next();
    }
};

const sendResponse = (res, payload) => {

    console.log(payload)

    if (payload.redirect) return res.send(payload.redirect);

    res.status(payload.status).send(JSON.stringify({
        success: !payload.error,
        error: payload.error,
        data: payload.data,
    }));

}

module.exports = {checkIfLoggedIn, redirectProfile, sendResponse}