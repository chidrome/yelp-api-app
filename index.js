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

// import geocoding services from mapbox sdk
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// create a geocoding client
const geocodingClient = mbxGeocoding({ accessToken: process.env.GEOCODING_CLIENT_ID })

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
	// use the geocoding client to convert the city/location into coordinates
	geocodingClient
	.forwardGeocode({
		query: req.body.cityState,
		types: ['place'],
		countries: ['us']
	})
	.send()
	.then((geoCodeObject)=>{
		var cityCenter = geoCodeObject.body.features[0]
		client.search({
			term: req.body.restaurantName,
			location: req.body.cityState
		})
		.then((data)=>{
			var results = JSON.parse(data.body)
			var businesses = results.businesses //JSON.parse(data.body.businesses) // an array of businessess
			var markers = businesses.map((r)=>{
				var markerObj = {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [r.coordinates.longitude, r.coordinates.latitude]
					},
					"properties": {
						"title": r.name,
						"description": "<img class='popupPic center' src="+r.image_url+"><br><strong>" + r.name + "</strong><br>" + r.display_phone + "<br>" + r.location.display_address + "<br><a href='/restaurants/moreinfo' restaurantId='" + r.name + "'>More Info</a>",
						"icon": "restaurant"
					}
				}
				return JSON.stringify(markerObj);
			})
			res.render('home-results', { results: results, business: businesses, markers: markers, cityCenter: cityCenter });
		})
		.catch((error)=>{
			console.log('ERROR!', error);
			res.render('error');
		})
	})
	.catch((error)=>{
		console.log('ERROR getting geocode', error)
		res.render('error');
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