var express = require('express');
var passport = require('../config/passportConfig');
var router = express.Router();
var db = require('../models');

router.get('/login', (req, res) => {
	res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	successFlash: 'Login successful!',
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
		db.user.findOrCreate({
			where: { 
				$or: [{ 
					email: req.body.email 
				}, {
					username: req.body.username
				 }]
			 },
			defaults: req.body
		})
		.spread((userObject, wasCreated)=>{
			console.log('Got to Promise');
			if(wasCreated){
				console.log('Was Created');
				req.flash('success', 'Yay! Good Job! You signed up!');
				passport.authenticate('local', {
					successRedirect: '/profile',
					successFlash: 'Login successful!',
					failureRedirect: '/auth/login',
					failureFlash: 'Invalid Credentials'
				})(req, res, next);
			}
			else {
				console.log('Was Found')
				req.flash('error', 'Username/Email already exists');
				res.render('auth/signup', { previousData: req.body, alerts: req.flash() });
			}
		})
		.catch((error)=>{
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


module.exports = router;