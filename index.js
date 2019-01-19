// Load up env variables
require('dotenv').config();

// Requires
var flash = require('connect-flash');
var express = require('express');
var layouts = require('express-ejs-layouts');
var parser = require('body-parser');
var passport = require('./config/passportConfig');
var session = require('express-session');
var yelp = require('yelp-fusion');
var client = yelp.client(process.env.YELP_API_KEY)

// Declare express app
var app = express();

// Declare a reference to the models folder
var db = require('./models');

// set views to EJS
app.set('view engine', 'ejs');

// Use middleware
app.use(layouts);
app.use('/', express.static('static'));
app.use(parser.urlencoded({ extended: false }));
app.use(session({ 
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Custom middleware - write data objects to locals
app.use((req, res, next) => {
	res.locals.alerts = req.flash();
	res.locals.user = req.user;
	res.locals.firstCapitalization = function(firstName){
		return firstName.charAt(0).toUpperCase() + firstName.slice(1)
	}
	next();
})

// Declare your routes
app.get('/', (req, res)=>{
	res.render('home', { markers: 'restaurant'})
});

app.post('/search', (req, res)=>{
	client.search({
        term: req.body.restaurantName,
        location: req.body.cityState
    })
    .then((data)=>{
        var results = JSON.parse(data.body)
        var businesses = results.businesses //JSON.parse(data.body.businesses)
        res.render('home', { results: results, business: businesses });
    })
    .catch((error)=>{
        console.log('ERROR!', error);
    })
})


// Include any controllers we need
app.use('/auth', require('./controllers/auth'));
app.use('/profile', require('./controllers/profiles'))
app.use('/restaurants', require('./controllers/restaurants'));
app.use('/favorites', require('./controllers/favorites'));
app.use('/friends', require('./controllers/friends'));

// Declare your listener
app.listen(process.env.PORT || 8000, function(){
	console.log('Now listening to the smooth sounds of port 8000');
})