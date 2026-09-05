"use strict";
module.exports = (sequelize, DataTypes) => {
  const EventFeedback = sequelize.define("EventFeedback", {
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comments: { type: DataTypes.TEXT, allowNull: true },
  });
  EventFeedback.associate = (models) => {
    EventFeedback.belongsTo(models.Event, { foreignKey: "event_id" });
    EventFeedback.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return EventFeedback;
};
