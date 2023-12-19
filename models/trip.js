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
    userID: { type: DataTypes.INTEGER, unique: true },
    driverID: DataTypes.INTEGER,
    fare: DataTypes.INTEGER,
    onProgress: DataTypes.BOOLEAN,
    isPaid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};