"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");
const config = require("../config");

let sequelize;
if(config?.environment === 'prod'){
  sequelize = new Sequelize(
    config.api.db,
    config.api.user,
    config.api.pass,
    {
      host: config.api.host,
      dialect: "mysql",
      port: config.api.port,
    }
  );
}else{
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../database/db.sqlite'
  });
}

module.exports = sequelize;
