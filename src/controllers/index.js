"use strict";
const { createEvent, updateEvent, getEvents, getEvent } = require("./Event");

const { createPrice, updatePrice, getPrices, getPrice } = require("./price");

const {
  uploadImage,
  uploadFile,
  getFileById,
  getFileByRelative,
} = require("./upload");

module.exports = {
  createEvent,
  updateEvent,
  getEvents,
  getEvent,
  createPrice,
  updatePrice,
  getPrices,
  getPrice,
  uploadImage,
  getFileById,
  getFileByRelative,
  uploadFile,
};
