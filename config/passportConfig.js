// Require passport module and any strategies you wish to use
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

// A reference to our models
var db = require('../models')

// Provide serialize/deserialize functions so we can store user in session
passport.serializeUser((user, callBack)=>{
    callBack(null, user.id)
});

passport.deserializeUser((id, callBack)=>{
    db.user.findByPk(id)
    .then((user)=>{
        callBack(null, user);
    })
    .catch((error)=>{
        callBack(error, null)
    })
});


// Do the actual logging in (authentication)
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
},(email, password, callback)=>{
    db.user.findOne({
        where: { email: email }
    })
    .then((foundUser)=>{
        // If I didn't find a valid user or that user's password, once hashed, doesn't match the hash in the db
        if(!foundUser || !foundUser.validPassword(password)){
            // then bad
            callback(null, null);
        }
        else {
            // else good
            callback(null, foundUser);
        }
        
    })
    .catch((error)=>{
        callback(error, null)
    })
}))

// Make sure I can include this module in other pages in my app
module.exports = passport;