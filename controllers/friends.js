var express = require('express')
var router = express.Router();
var db = require('../models')

// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

router.get('/', loggedIn, (req, res)=>{
    db.user.findAll()
    .then((results)=>{
        res.render('user/friends', { results: results })
    })
    .catch((error)=>{
        console.log('ERROR finding users!', error)
    })
})




module.exports = router;