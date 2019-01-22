var express = require('express')
var router = express.Router();
var db = require('../models');

// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

// show my friends
router.get('/', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [{model: db.user, as: 'friend'}]
    })
    .then((user)=>{
        var foundFriend = ''
        res.render('user/friends', { friends: user.friend, foundFriend: foundFriend })
    })
    .catch((error)=>{
        console.log('ERROR finding users!', error)
    })
})


// add friends
router.post('/add', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.body.friendId
        }
    })
    .then((friend)=>{
        db.user.findById(req.user.id)
        .then((user)=>{
            user.addFriend(friend)
            db.user.findById(friend.id)
            .then((user)=>{
                user.addFriend(req.user)
                res.redirect('/profile')
            })
            .catch((error)=>{
                console.log('ERROR associating friend back', error)
            })
            
        })
        .catch((error)=>{
            console.log('ERROR adding friend', error)
        })
    })
    .catch((error)=>{
        console.log('ERROR adding/finding friend', error)
    })
})

// remove friends
router.post('/remove', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.body.friendId
        }
    })
    .then((friend)=>{
        db.user.findById(req.user.id)
        .then((user)=>{
            user.removeFriend(friend)
            db.user.findById(friend.id)
            .then((user)=>{
                user.removeFriend(req.user)
                res.redirect('/profile')
            })
            .catch((error)=>{
                console.log('ERROR associating friend back', error)
            })
            
        })
        .catch((error)=>{
            console.log('ERROR adding friend', error)
        })
    })
    .catch((error)=>{
        console.log('ERROR adding/finding friend', error)
    })
})


// search for friends
router.post('/search', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            email: req.body.friendEmail
        }
    })
    .then((foundFriend)=>{
        db.user.findOne({
            where: {
                id: req.user.id
            },
            include: [{model: db.user, as: 'friend'}]
        })
        .then((user)=>{
            res.render('user/friends', { friends: user.friend, foundFriend: foundFriend })
        })
        .catch((error)=>{
            console.log('ERROR finding users!', error)
        })
    })
})




module.exports = router;