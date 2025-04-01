"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Feedback", "anonymous", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Feedback", "status", {
      type: Sequelize.ENUM("New", "In Progress", "Resolved"),
      defaultValue: "New",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Feedback", "anonymous");
    await queryInterface.removeColumn("Feedback", "status");
  },
};
