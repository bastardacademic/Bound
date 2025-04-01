"use strict";
module.exports = (sequelize, DataTypes) => {
  const PlatformAnalytics = sequelize.define("PlatformAnalytics", {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    total_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    active_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_events: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_reports: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
  return PlatformAnalytics;
};
