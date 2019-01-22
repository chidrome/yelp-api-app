var express = require('express');
var router = express.Router();
var db = require('../models');

// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');


// find the users info then find his friends
router.get('/', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [db.restaurant]
    })
    .then((foundUser)=>{
        db.user.findOne({
            where: {
                id: req.user.id
            },
            include: [{model: db.user, as: 'friend'}]
        })
        .then((user)=>{
            var foundFriend = ''
            res.render('user/profile', {restaurants: foundUser.restaurants, friends: user.friend, foundFriend: foundFriend, currentUser: foundUser.id })
        })
        .catch((error)=>{
            console.log('ERROR finding users!', error)
        })
    })
    .catch((error)=>{
        console.log('ERROR finding user!', error)
    })
});


// friend profiles
router.post('/friends/:name', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.body.friendUserId
        },
        include: [db.restaurant, {model: db.user, as: 'friend'}]
    })
    .then((userProfile)=>{
        res.render('user/friends-profile', { userProfile: userProfile, friendsRestaurants: userProfile.restaurants })
    })
    .catch((error)=>{
        console.log('ERROR finding friends profile', error)
    })
})

// view to edit my profile
router.get('/edit', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        }
    })
    .then((user)=>{
        res.render('user/edit-profile', { user: user })
    })
    .catch((error)=>{
        console.log('ERROR fetching profile', error)
        res.render('error')
    })
})

// post to edit my profile
router.post('/edit', loggedIn, (req, res)=>{
    db.user.update({
        bio: req.body.updateBio
    }, {
        where: {
            id: req.user.id
        }
    })
    .then((user)=>{
        res.redirect('/profile')
    })
    .catch((error)=>{
        console.log('ERROR TRYING TO UPDATE PROFILE', error)
        res.render('error')
    })
})


router.get('/admins', isAdmin, (req, res)=>{
    res.render('admin');
})
module.exports = router;