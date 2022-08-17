"use strict";
const { createEvent, updateEvent, getEvents, getEvent } = require("./Event");

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
  uploadImage,
  getFileById,
  getFileByRelative,
  uploadFile,
};
