'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      transactionID: {
        type: Sequelize.STRING
      },
      fare: {
        type: Sequelize.INTEGER
      },
      onProgress: {
        type: Sequelize.BOOLEAN
      },
      isPaid: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Trips');
  }
};