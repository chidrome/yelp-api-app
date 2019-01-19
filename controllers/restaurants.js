var express = require('express');
var router = express.Router();

// set up yelp middleware to make requests
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.YELP_API_KEY)

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

router.get('/moreinfo', (req, res)=>{
    res.send(req.body)
})


module.exports = router;