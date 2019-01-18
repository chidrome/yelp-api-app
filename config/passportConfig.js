// Require passport module and any strategies you wish to use
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

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

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
    profileFields: ['id', 'email', 'displayName', 'picture.type(large)'],
    enableProof: true
}, function(accessToken, refreshToken, profile, callback){
    // See if FB gave us an email to identify the user with
    var facebookEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null

    // see if the email exists in the users table
    db.user.findOne({
        where: { email: facebookEmail.toLowerCase() }
    })
    .then(function(existingUser){
        if(existingUser && facebookEmail.toLowerCase()){
            // This is a returning user - just need to update facebookId and Token
            existingUser.updateAttributes({
                facebookId: profile.id,
                facebookToken: accessToken
            })
            .then(function(updateUser){
                callback(null, updateUser);
            })
            .catch(callback);
        }
        else {
            // This person is a new user, so we need to create them
            var usernameArry = profile.displayName.split(' ');
            var photo = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'https://png.icons8.com/ios/1600/person-female-filled.png';
            db.user.findOrCreate({
                where: { facebookId: profile.id },
                defaults: {
                    facebookToken: accessToken,
                    email: facebookEmail.toLowerCase(),
                    username: usernameArry[0] + usernameArry[1],
                    first_name: usernameArry[0].toLowerCase(),
                    last_name: usernameArry[usernameArry.length - 1].toLowerCase(),
                    admin: false,
                    dob: profile.birthday,
                    profileImg: photo
                }
            })
            .spread(function(newUser, wasCreated){
                if(wasCreated){
                    // This was expected
                    callback(null, newUser);
                }
                else {
                    // newUser was not new after all. This might happen if they changed their email on file with Facebook since they logged in last.
                    // NOTE: save() is an alternative way of doing updateAttributes()
                    newUser.facebookToken = accessToken;
                    newUser.email = facebookEmail.toLowerCase();
                    newUser.save()
                    .then(function(savedUser){
                        callback(null, savedUser);
                    })
                    .catch(callback)
                }
            })
            .catch(callback);
        }
    })
    .catch(callback);
}));


// Make sure I can include this module in other pages in my app
module.exports = passport;