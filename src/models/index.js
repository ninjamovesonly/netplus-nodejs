"use strict";
require("dotenv").config();

const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");
const { guid } = require("../util");

const Transaction = sequelize.define("transaction", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  merchantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transId: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  authorizationUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const User = sequelize.define("user", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const init = async () => {
  await Transaction.sync({ force: false, alter: true });
  await User.sync({ force: false });
};

init();

module.exports = { Transaction, User };
