"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT
  }
);

module.exports = sequelize;
