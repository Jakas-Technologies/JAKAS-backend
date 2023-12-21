'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Geolocations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      socketID: {
        type: Sequelize.STRING,
        unique: true,
      },
      location: {
        type: Sequelize.GEOMETRY,
      },
      online: {
        type: Sequelize.BOOLEAN,
      },
      trackerID: {
        type: Sequelize.STRING,
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "id",
        },
      },
      driverID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Drivers",
          key: "id",
          as: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Geolocations');
  }
};