'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'about_me', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'kinks_and_fetishes', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    // privacy_settings is added by 20250125160437-add-privacy-settings-to-users.js instead,
    // which gives it a sensible per-field default.
    await queryInterface.addColumn('Users', 'relationship_preferences', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'about_me');
    await queryInterface.removeColumn('Users', 'kinks_and_fetishes');
    await queryInterface.removeColumn('Users', 'relationship_preferences');
  },
};
