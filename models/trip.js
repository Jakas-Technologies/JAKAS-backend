'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "id" });
      this.belongsTo(models.Driver, { foreignKey: "id" });
    }
  }
  Trip.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: "Users", 
          key: 'id', 
      },
      unique: true,
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
    onProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    transactionID: {
        type: DataTypes.STRING,
        allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};