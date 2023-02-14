"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");

const sqliteDatabase = (path = null) => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: path || (__dirname + "/../database/db.sqlite")
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

const postgresConnect = () => {
  return new Sequelize("databaseName", "userName", "password", {
    host: "localhost",
    dialect: "postgres"
  });
}

//const sequelize = process.env.DB_CONNECTION === 'sqlite' ? sqliteDatabase() : hostDatabase();
const sequelize = hostDatabase();

module.exports = sequelize;
