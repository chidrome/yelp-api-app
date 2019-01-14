var express = require('express');
var router = express.Router();
var request = require('request');

// set up yelp middleware to make requests
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.YELP_API_KEY)

//set up to read dotenv file
require('dotenv').config();

router.get('/',(req, res)=>{
    res.render('restaurants/search');
})

router.post('/search', (req, res)=>{
    client.search({
        term: 'four barrel coffe',
        location: 'san francisco, ca'
    })
    .then((results)=>{
        console.log(results)
        res.send(results);
    })
    .catch((error)=>{
        console.log('ERROR!', error);
    })
})



module.exports = router;