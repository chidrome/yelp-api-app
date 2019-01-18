'use strict';
module.exports = (sequelize, DataTypes) => {
  const userFriend = sequelize.define('userFriend', {
    userId: DataTypes.INTEGER,
    friendId: DataTypes.INTEGER
  }, {});
  userFriend.associate = function(models) {
    // associations can be defined here

  };
  return userFriend;
};