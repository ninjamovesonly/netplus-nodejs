"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");

const sqliteDatabase = (path = null) => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: path || '../../database/db.sqlite'
  });
}

const hostDatabase = () => {
  return new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_CONNECTION,
      port: process.env.DB_PORT,
    }
  );
}

const sequelize = process.env.DB_CONNECTION === 'sqlite' ? sqliteDatabase() : hostDatabase();

module.exports = sequelize;
