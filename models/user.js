'use strict';
var bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Need a valid e-mail address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 16],
          msg: 'Your password should be between 8 and 16 charaters in length.'
        }
      }
    },
    username: DataTypes.STRING,
    dob: DataTypes.DATE,
    bio: DataTypes.TEXT,
    favorite_cuisine: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    facebookToken: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    profileImg: DataTypes.TEXT
  }, {
    hooks: {
      beforeCreate: function(pendingUser){
        if(pendingUser && pendingUser.password){
          var hash = bcrypt.hashSync(pendingUser.password, 12);
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
    models.user.belongsToMany(models.restaurant, { through: 'restaurantUser' })
    models.user.belongsToMany(models.user, { as: 'friend', through: 'userFriend' })
    models.user.belongsToMany(models.comment, { through: 'restaurantUser' })
  };
  user.prototype.validPassword = function(typedPassword){
    return bcrypt.compareSync(typedPassword, this.password);
  }
  return user;
};