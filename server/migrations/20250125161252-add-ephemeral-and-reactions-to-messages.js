"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Messages", "is_ephemeral", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Messages", "expires_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("Messages", "reaction", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Messages", "is_ephemeral");
    await queryInterface.removeColumn("Messages", "expires_at");
    await queryInterface.removeColumn("Messages", "reaction");
  },
};
