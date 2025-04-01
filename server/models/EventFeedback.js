"use strict";
module.exports = (sequelize, DataTypes) => {
  const EventFeedback = sequelize.define("EventFeedback", {
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comments: { type: DataTypes.TEXT },
  });
  return EventFeedback;
};
