'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TripHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TripHistory.init({
    userID: DataTypes.INTEGER,
    driverID: DataTypes.INTEGER,
    fare: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TripHistory',
  });
  return TripHistory;
};