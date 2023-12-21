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
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: "Users", 
          key: 'id', 
      },
    },
    driverID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Drivers", 
            key: 'id', 
        },
    },
    fare: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transactionID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'TripHistory',
  });
  return TripHistory;
};