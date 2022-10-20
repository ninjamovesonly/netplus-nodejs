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
  location: {
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
    allowNull: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Price = sequelize.define("event_price", {
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
  attendees: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  withChips: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "without"
  }
});

const Gallery = sequelize.define("event_gallerie", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

const Attendee = sequelize.define("event_attendee", {
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
  event_price_id: {
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
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Token = sequelize.define("event_token", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
});

const Url = sequelize.define("event_url", {
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
  event_attendee_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  device_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const init = async () => {
  await Event.sync();
  await Price.sync({ force: true });
  await Gallery.sync();
  await Attendee.sync();
  await Token.sync();
  await Url.sync();
};

init();

module.exports = { Event, Price, Gallery, Attendee, Token, Url };
