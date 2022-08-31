"use strict";

const { Op } = require("sequelize");
const { Price } = require("../models");
const logger = require("../util/log");

const createPrice = async (req, res) => {
  /*
    #swagger.tags = ["Price"]
    #swagger.description = 'Create Price'
    #swagger.security = [{
               "apikey": []
        }]
    #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $event_id: "string",
                      $title: "string",
                      $description: "string",
                      $amount: "string"
                }
        }
  */

  await Price.create(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updatePrice = async (req, res) => {
  /*
    #swagger.tags = ["Price"]
    #swagger.description = 'Update Price'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Price.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      res.send({
        success: true,
        data,
      });
    })
    .catch((err) => logger(err));
};

const getPrices = async (req, res) => {
  /*
    #swagger.tags = ["Price"]
    #swagger.description = 'Get Prices by event_id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Price.findAll({ event_id: req.params.id })
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getPrice = (req, res) => {
  /*
    #swagger.tags = ["Price"]
    #swagger.description = 'Get single price by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  Price.findOne({ where: { id: req.params.id } })
    .then((data) => {
      if (data) {
        res.send({ success: true, data });
      } else {
        res.send({ success: false, message: "No data" });
      }
    })
    .catch((err) => logger(err));
};

module.exports = {
  createPrice,
  updatePrice,
  getPrices,
  getPrice,
};
