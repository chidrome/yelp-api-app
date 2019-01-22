'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    models.comment.belongsToMany(models.restaurant, { through: 'restaurantUser' })
  };
  return comment;
};