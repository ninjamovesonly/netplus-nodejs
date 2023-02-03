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
  accessCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  callbackUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "/transaction/closed"
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
  },
  merchantid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'enoch1234'
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'NULL'
  },
  apiSecret: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'NULL'
  }
});

const Admin = sequelize.define("admin", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const MerchantId = sequelize.define("merchantid", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: guid(),
    primaryKey: true,
  },
  merchant: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});


const init = async () => {
  await Transaction.sync({ force: false, alter: false });
  await User.sync({ force: false });
  await Admin.sync({ force: false }).then(() => {
    Admin.create({
        id: guid(),
        email: 'admin@admin.com',
        password: 'testsample'
    });
  });
  await MerchantId.sync({ force: false }).then(() => {
    MerchantId.create({
        id: guid(),
        merchant: 'MID637fd2b99bc64'
    });
  });
};

init();

module.exports = { Transaction, User, Admin, MerchantId };
