"use strict";
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEvent,
} = require("./event");

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
  deleteEvent,
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
