'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM('user', 'moderator', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      visibility: {
        type: Sequelize.ENUM('public', 'members_only', 'private'),
        allowNull: false,
        defaultValue: 'public'
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
    await queryInterface.dropTable('Users');
  }
};