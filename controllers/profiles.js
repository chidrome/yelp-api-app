var express = require('express');
var router = express.Router();
var db = require('../models');

// include my middleware folder
var loggedIn = require('../middleware/loggedIn');
var isAdmin = require('../middleware/isAdmin');

router.get('/', loggedIn, (req, res)=>{
    db.user.findOne({
        where: {
            id: req.user.id
        },
        include: [db.restaurant]
    })
    .then((foundUser)=>{
        console.log(foundUser.restaurants);
        res.render('user/profile', {restaurants: foundUser.restaurants})
    })
    .catch((error)=>{
        console.log('ERROR finding user!', error)
    })
});


router.get('/admins', isAdmin, (req, res)=>{
    res.render('admin');
})




module.exports = router;