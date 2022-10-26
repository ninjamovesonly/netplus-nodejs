"use strict";

const { Op } = require("sequelize");
const { Gallery } = require("../models");
const logger = require("../util/log");

const createGallery = async (req, res) => {
  /*
    #swagger.tags = ["Gallery"]
    #swagger.description = 'Create Gallery'
    #swagger.security = [{
               "apikey": []
        }]
    #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $event_id: "string",
                      $name: "string",
                      $image: "string",
                }
        }
  */

  await Gallery.create(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateGallery = async (req, res) => {
  /*
    #swagger.tags = ["Gallery"]
    #swagger.description = 'Update Gallery'
     #swagger.security = [{
               "apikey": []
        }]
        #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $event_id: "string",
                      $name: "string",
                      $image: "string",
                }
        }
  */

  await Gallery.update(req.body, {
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

const deleteGallery = async (req, res) => {
  /*
    #swagger.tags = ["Gallery"]
    #swagger.description = 'Delete gallery by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Gallery.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send({
        success: true,
        message: "Gallery deleted",
      });
    })
    .catch((err) => logger(err));
};

const getGalleries = async (req, res) => {
  /*
    #swagger.tags = ["Gallery"]
    #swagger.description = 'Get Galleries by event_id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Gallery.findAll({ event_id: req.params.id })
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getGallery = (req, res) => {
  /*
    #swagger.tags = ["Gallery"]
    #swagger.description = 'Get single gallery by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  Gallery.findOne({ where: { id: req.params.id } })
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
  createGallery,
  updateGallery,
  deleteGallery,
  getGalleries,
  getGallery,
};
