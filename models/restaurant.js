'use strict';
module.exports = (sequelize, DataTypes) => {
  const restaurant = sequelize.define('restaurant', {
    name: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    address3: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    yelp_rating: DataTypes.STRING,
    friend_rating: DataTypes.STRING,
    image_url: DataTypes.STRING,
    lat: DataTypes.NUMERIC,
    long: DataTypes.NUMERIC
  }, {});
  restaurant.associate = function(models) {
    // associations can be defined here
    models.restaurant.belongsToMany(models.user, { through: 'restaurantUser' })
  };
  return restaurant;
};