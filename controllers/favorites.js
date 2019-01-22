var express = require('express');
var router = express.Router();
var db = require('../models')

// import geocoding services from mapbox sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// create a geocoding client
const geocodingClient = mbxGeocoding({ accessToken: process.env.GEOCODING_CLIENT_ID })


// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

// get the favorites, map it and allow for zoom 
router.get('/', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [db.restaurant]
    })
    .then((foundUser)=>{
        var markers = foundUser.restaurants.map((r)=>{
			var markerObj = {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [r.long, r.lat]
				},
				"properties": {
                    "title": r.name,
                    "description": "<img class='popupPic center' src="+r.image_url+"><br><strong>" + r.name + "</strong><br>" + r.phone + "<br>" + r.address1 + "<br>" + r.address2 + "<br>" + r.address3 + "<br>" + r.city + ", " + r.state,
					"icon": "restaurant"
				}
            }
            return JSON.stringify(markerObj);
        })
        res.render('restaurants/favorites', { results: foundUser, markers: markers, center: [-100, 39.5], zoom: 3.39, pitch: 0, bearing: 0 })
    })
    .catch((error)=>{
        console.log('ERROR Finding Favorites!!', error)
    })
})

// add the favorite restaurants to the db
router.post('/add', loggedIn, (req, res)=>{
    db.restaurant.findOrCreate({
        where: {
            name: req.body.restaurantName
        },
        defaults: {
            address1: req.body.address1,
            address2: req.body.address2,
            address3: req.body.address3,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            yelp_rating: req.body.yelpRating,
            lat: req.body.lat,
            long: req.body.long,
            image_url: req.body.imageURL,
            yelp_business_id: req.body.yelp_business_id
        }
    })
    .spread((restaurant, wasCreated)=>{
        db.user.findById(req.user.id)
        .then((foundUser)=>{
            restaurant.addUser(foundUser)
            res.redirect('/favorites')
        })
        .catch((error)=>{
            console.log('ERROR adding into restaurantUsers table', error)
        })
    })
    .catch((error)=>{
        console.log('ERROR adding/finding favorite', error)
    })
})




module.exports = router;