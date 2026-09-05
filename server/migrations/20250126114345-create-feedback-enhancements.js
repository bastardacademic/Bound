"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // anonymous is already created by 20250125162311-create-feedback.js
    await queryInterface.addColumn("Feedback", "status", {
      type: Sequelize.ENUM("New", "In Progress", "Resolved"),
      defaultValue: "New",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Feedback", "status");
  },
};
