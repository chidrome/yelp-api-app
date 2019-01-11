var db = require('../models');

db.movie.create({
	title: 'Die Hard',
	year: 1998,
	genre: 'Action',
	runtime: 110,
	tagline: 'Yippie Kai-ye....'
})
.then(function(createdMovie){
	console.log('Successfully created movie', createdMovie.title);
})
.catch(function(error){
	console.log('Error', error);
})