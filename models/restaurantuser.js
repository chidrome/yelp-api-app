'use strict';
module.exports = (sequelize, DataTypes) => {
  const restaurantUser = sequelize.define('restaurantUser', {
    restaurantId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER
  }, {});
  restaurantUser.associate = function(models) {
    // associations can be defined here
    
  };
  return restaurantUser;
};