'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Geolocation extends Model {
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
  Geolocation.init({
    socketID: {
      type: DataTypes.STRING,
      unique: true,
    },
    location: {
      type: DataTypes.GEOMETRY,
    },
    online: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    trackerID: {
      type: DataTypes.STRING,
    },
    userID: {
      type: DataTypes.INTEGER,
    },
    driverID: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Geolocation',
  });
  return Geolocation;
};