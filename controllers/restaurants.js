var express = require('express');
var router = express.Router();
var db = require('../models')

// set up yelp middleware to make requests
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.YELP_API_KEY)

// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

//set up to read dotenv file
require('dotenv').config();

router.get('/',(req, res)=>{
    res.render('restaurants/search');
})

// search for the restaurant
router.post('/search', (req, res)=>{
    client.search({
        term: req.body.restaurantName,
        location: req.body.cityState
    })
    .then((data)=>{
        var results = JSON.parse(data.body)
        var businesses = results.businesses //JSON.parse(data.body.businesses)
        res.render('restaurants/search-results', { results: results, business: businesses });
    })
    .catch((error)=>{
        console.log('ERROR!', error);
    })
})

// restaurant details
router.post('/moreinfo', loggedIn, (req, res)=>{
    db.restaurant.findOne({
        where: {
            id: req.body.restaurantId
        },
        include: [db.comment]
    })
    .then((foundRestaurant)=>{
        db.user.findOne({
            where: {
                id: req.user.id
            },
            include: [{model: db.user, as: 'friend'}]
        })
        .then((user)=>{
            var foundFriend = ''
            // include either .map or .filter logic for just returning an array of comments only from my friends
            // var commentsArray = foundRestaurant.comments;
            // var friendsArray = user.friend;
            // var commentArrayToShow = [];
            // commentArrayToShow = commentsArray.map(i => {
            //     return {
            //         'id': i.id,
            //         'first_name': i.first_name,
            //         'comment': friendsArray.id.includes(i)
            //     };
            //  });
            // res.send(commentArrayToShow)
            // res.send(foundRestaurant)
            // res.send(user.friend)
            var markerObj = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [foundRestaurant.long, foundRestaurant.lat]
                },
                "properties": {
                    "title": foundRestaurant.name,
                    "icon": "restaurant"
                }
            }
        res.render('restaurants/more-info', { restaurant: foundRestaurant, markers: markerObj, friends: user.friend, foundFriend: foundFriend, currentUser: req.body.userId })
        })
        .catch((error)=>{
            console.log('ERROR finding users!', error)
        })
    })
    .catch((error)=>{
        console.log('ERROR finding restaurant!', error)
        res.render('error')
    })
})


// route to post comments on the restaurant
router.post('/comment/add', loggedIn, (req, res)=>{
    db.comment.create({
        content: req.body.userReview,
        userId: req.user.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    })
    .then((comment)=>{
        db.restaurant.findOne({
            where: {
                id: req.body.restaurantId
            }
        })
        .then((restaurant)=>{
            restaurant.addComment(comment)
            res.redirect('/profile')
        })
        .catch((error)=>{
            console.log('ERROR GETTING RESTAURANT AND COMMENT', error)
            res.render('error')
        })
    })
    .catch((error)=>{
        console.log('ERROR CREATING COMMENT', error)
        res.render('error')
    })
})

// route to remove a comment on the restaurant
router.post('/comment/delete', loggedIn, (req, res)=>{
    db.comment.findOne({
        where: {
            id: req.body.id
        }
    })
    .then((comment)=>{
        db.restaurant.findOne({
            where: {
                id: req.body.restaurantId
            }
        })
        .then((restaurant)=>{
            restaurant.removeComment(comment)
            res.redirect('/profile')
        })
        .catch((error)=>{
            console.log('ERROR GETTING RESTAURANT AND COMMENT', error)
            res.render('error')
        })
    })
    .catch((error)=>{
        console.log('ERROR CREATING COMMENT', error)
        res.render('error')
    })
})

module.exports = router;