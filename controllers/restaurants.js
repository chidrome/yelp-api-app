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

router.post('/moreinfo', loggedIn, (req, res)=>{
    db.restaurant.findOne({
        where: {
            id: req.body.restaurantId
        }
    })
    .then((foundRestaurant)=>{
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
            res.render('restaurants/more-info', { restaurant: foundRestaurant, markers: markerObj })
    })
    .catch((error)=>{
        console.log('ERROR finding restaurant!', error)
        res.render('error')
    })
})


module.exports = router;