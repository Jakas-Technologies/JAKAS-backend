'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TripHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Trips",
          key: "id",
          as: "id",
        },
      },
      userID: {
        type: Sequelize.INTEGER
      },
      driverID: {
        type: Sequelize.INTEGER
      },
      transactionID: {
        type: Sequelize.STRING
      },
      fare: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TripHistories');
  }
};