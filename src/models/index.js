"use strict";
require("dotenv").config();

const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");
const { guid } = require("../util");

const Event = sequelize.define("event", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Price = sequelize.define("price", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Attendee = sequelize.define("attendee", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Upload = sequelize.define("upload", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Event.hasMany(Price, {
  foreignKey: {
    id: "event_id",
  },
});

Event.hasMany(Upload, {
  foreignKey: {
    id: "event_id",
  },
});

Event.hasMany(Attendee, {
  foreignKey: {
    id: "event_id",
  },
});

// Attendee.hasOne(Price, {
//   foreignKey: {
//     id: "price_category",
//   },
// });

const init = async () => {
  await Event.sync();
  await Price.sync();
  await Attendee.sync();
  await Upload.sync();
};

init();

module.exports = { Event, Price, Attendee, Upload };
