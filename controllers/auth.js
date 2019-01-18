var express = require('express');
var passport = require('../config/passportConfig');
var router = express.Router();
var db = require('../models');

router.get('/login', (req, res) => {
	res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	// successFlash: 'Login successful!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid Credentials'
}));

router.get('/signup', (req, res) => {
	res.render('auth/signup', { previousData: null });
});

router.post('/signup', (req, res, next) => {
	if(req.body.password != req.body.password_verify){
		req.flash('error', 'Get your shit together! You typed mismatched passwords!');
		res.render('auth/signup', {previousData: req.body, alerts: req.flash() });
	}
	else {
		console.log(req.body)
		db.user.find({
			where: { 
					username: req.body.username.toLowerCase()
			 }
		})
		.then((foundUserWithUsername)=>{
			if(foundUserWithUsername){
				console.log('Username was Found')
				req.flash('error', 'Username Already Exists');
				res.render('auth/signup', { previousData: req.body, alerts: req.flash() });
			}
			else {
				db.user.find({
					where: {
						email: req.body.email.toLowerCase()
					}
				})
				.then((foundUserWithEmail)=>{
					if(foundUserWithEmail){
						console.log('Email was Found')
						req.flash('error', 'Email Already Exists');
						res.render('auth/signup', { previousData: req.body, alerts: req.flash() })
					}
					else {
						db.user.create({
							first_name: req.body.first_name.toLowerCase(),
							last_name: req.body.last_name.toLowerCase(),
							username: req.body.username.toLowerCase(),
							password: req.body.password,
							email: req.body.email.toLowerCase(),
							profileImg: req.body.profileImg,
							dob: req.body.dob,
							bio: req.body.bio,
							favorite_cuisine: req.body.favorite_cuisine.toLowerCase()
						})
						.then((wasCreated)=>{
							console.log('This User Was Created', wasCreated);
							req.flash('success', 'Yay! Good Job! You signed up!');
							passport.authenticate('local', {
							successRedirect: '/profile',
							successFlash: 'Login successful!',
							failureRedirect: '/auth/login',
							failureFlash: 'Invalid Credentials'
							})(req, res, next);
						})
						.catch((error)=>{
							console.log('Something went wrong with trying to create the user.', error)
						})
					}
				})
			}
		})
		.catch((error)=>{
			console.log('Something went wrong with searching for an existing user', error)
			if(error && error.errors){
				error.errors.forEach((e)=>{
					if(e.type == 'Validation error'){
						req.flash('error', 'A server error occured: ' + e.message);
					}
					else {
						console.log('Error (not validation)', e);
					}
				})
			}
			res.render('auth/signup', {previousData: req.body, alerts: req.flash() });
		})
	}
})


router.get('/logout', (req, res)=>{
	req.logout(); // logs me out of the session
	req.flash('success', 'Successful Logout! Come back again!');
	res.redirect('/');
});

// FACEBOOK SPECIFIC ROUTES
router.get('/facebook', passport.authenticate('facebook', {
	scope: ['public_profile', 'email']
}))

router.get('/callback/facebook', passport.authenticate('facebook', {
	successRedirect: '/profile',
	// successFlash: 'Login successful!',
	failureRedirect: '/auth/login',
	failureFlash: 'Ooops, Facebook has failed you.'
}))


module.exports = router;