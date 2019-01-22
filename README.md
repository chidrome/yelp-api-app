# Restaurant Rec

Live site - https://restaurantrec.herokuapp.com

![screen shot](https://i.imgur.com/nN7A0AH.png)

## Use Case
This was app was created from the need to get restaurant recommendations not just from strangers but from friends all around the nation. Often times when we travel we find ourselves asking our friends through social media "Where's a good place to eat around 'here/there'?" I've combined yelp API to get restaurant information and mapbox API to locate these restaurants. Along with the ability to not just review a specific restaurant once, but allow for users to interact with each other through a forum type of chat.

## How to use
1. Search for a restaurant either in the homepage or on the specific search page.
2. Log-in to get more info on the restaurant and to add it to your favorites list.
3. Once you have your favorites, you can search for friends.
4. Browse through your friends favorite restaurants by city and see what they have to say about it.

## What you'll need
`npm -install`
`npm -install express`
`npm -install yelp-fusion`
`npm -install @mapbox/mapbox-sdk`

## Routes
* `GET /` - main home page
* `POST /search` - search for restaurants from the main homepage
* `GET /auth/signup` - sign up
* `GET /auth/login` - login with your registered account info. You can also login with Facebook credentials.
* `POST /favorites/add` - add your favorite restaurants.
* `GET /favorites` - show your favorite restaurants.
* `DELETE /favorites/remove` - remove the association with your favorite restaurant.
* `GET /restaurants` - restaurants search page.
* `POST /restaurants/search` - makes a call to Yelp API to search for restaurants with the given params
* `GET /restaurants/moreinfo` - get more info on the restaurant.
* `POST /restaurants/comment/add` - add a comment for a specific restaurant.
* `GET /profile` - populates user profile.
* `POST /profile/friends/:name` - populates a friends profile.
* `GET /profile/edit` - show edit user profile page.
* `PUT /profile/edit` - edit user's profile.
* `GET /friends` - show user's friends.
* `POST /friends/add` - add friend to user.
* `DELETE /friends/remove` - remove association with friend.
* `POST /friends/search` - search for friends.

## Challenging hurdles
1. The biggest takeaway for me was getting a handle(somewhat) on associations with sequelize models, specifically N:M relations. While a user may have have many comments on a given restaurant, that restaurant can also have many comments from many users. Thinking about how to associate that using object oriented relational mapping is still quite a head spinner for me.

2. Adding layers of POI's in mapbox proved to be more challenging than originally scoped. Mapbox doesn't provide a layer with all the data of restaurants in a specific area. I had to create the data and then "map" it/add it to a layer in mapbox. So that I can activate pop-up boxes when a POI is clicked.

## Technologies Used
* Express
* Materialize
* jQuery
* Node.js
* Sequelize
* Yelp-fusion
* Mapbox
* oAuth

## Stretch goals
1. Use mapbox navgiation to get directional guidance from user's current location.
2. If @currentLocation for more than 30 mins. and @currentLocation is a restaurant, then ask if the user wants to add this place to his/her favorite restaurant.
3. Some sort of rating # system derived from 3 categories. Food/Service/Location
4. Friend suggestions