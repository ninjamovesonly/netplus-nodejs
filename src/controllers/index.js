"use strict";
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getPastEvents,
  searchEvents,
  getEvent,
} = require("./event");

const { createPrice, updatePrice, getPrices, getPrice } = require("./price");

const {
  createAttendee,
  updateAttendee,
  getAttendees,
  getAttendee,
} = require("./attendee");

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
  getPastEvents,
  searchEvents,
  getEvent,
  createPrice,
  updatePrice,
  getPrices,
  getPrice,
  uploadImage,
  getFileById,
  getFileByRelative,
  uploadFile,
  createAttendee,
  updateAttendee,
  getAttendees,
  getAttendee,
};
