"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  config.api.db,
  config.api.user,
  config.api.pass,
  {
    host: config.api.host,
    dialect: "mysql",
    port: config.api.port,
  }
);

/* const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../../database/db.sqlite'
}); */

module.exports = sequelize;
