"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("EventFeedback", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Events", key: "id" } },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comments: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("EventFeedback");
  },
};
