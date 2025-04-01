"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "privacy_settings", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        profile_visibility: "public",
        about_me: "public",
        relationship_status: "private",
        kinks_and_fetishes: "friends_only",
        posts: "public",
        location: "private",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Users", "privacy_settings");
  },
};
