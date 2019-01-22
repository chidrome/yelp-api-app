'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    models.comment.belongsToMany(models.restaurant, { through: 'restaurantUser' })
  };
  return comment;
};