"use strict";

const formidable = require("formidable");
const path = require("path");
const logger = require("../util/log");
const { Upload } = require("../models");
const { slug, isDoc, isImage, getEXT } = require("../util");

const uploadImage = (req, res) => {
  /*
    #swagger.tags = ["Upload"]
    #swagger.description = 'Upload image'
     #swagger.security = [{
               "apikey": []
        }]
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['singleFile'] = {
              in: 'formData',
              type: 'file',
              required: 'true'
        }
  */
  const event_id = req.params.event_id;
  const form = new formidable.IncomingForm();
  form.parse(req);

  form.on("fileBegin", function (name, file) {
    let type = getEXT(file.name);

    if (isImage(type)) {
      let newFile = `${Date.now()}.${type}`;
      file.path = path.resolve("./src/storage/images/", newFile);

      let data = {
        file: newFile,
        file_type: "image",
        event_id,
      };

      let upload = new Upload(data);

      upload
        .save()
        .then((f) => {
          res.send({ success: true, file: newFile, id: f.id });
        })
        .catch((err) => {
          res.send({ success: false, message: "Please upload valid image" });
          logger(err);
        });
    }
  });
};

const uploadFile = async (req, res) => {
  /*
    #swagger.tags = ["Upload"]
    #swagger.description = 'Upload document'
     #swagger.security = [{
               "apikey": []
        }]
    #swagger.consumes = ['multipart/form-data']  
    #swagger.parameters['singleFile'] = {
              in: 'formData',
              type: 'file',
              required: 'true'
        }
  */
  const event_id = req.params.event_id;
  const form = new formidable.IncomingForm();
  form.parse(req);

  form.on("fileBegin", async function (name, file) {
    let type = getEXT(file.name);

    if (isDoc(type)) {
      let newFile = `${Date.now()}.${type}`;
      file.path = path.resolve("./src/storage/docs/", newFile);

      let data = {
        file: newFile,
        file_type: "document",
        event_id,
      };

      await Upload.create(data)
        .then((f) => {
          res.send({ success: true, file: newFile, id: f.id });
        })
        .catch((err) => {
          res.send({
            success: false,
            message:
              "Please upload valid document.  Support pdf, csv, xls, xlsx, doc, docx, ppt, pptx, txt.",
          });
          logger(err);
        });
    } else {
      res.send({
        success: false,
        message:
          "Please upload valid document. Support pdf, csv, xls, xlsx, doc, docx, ppt, pptx, txt.",
      });
    }
  });
};

const getFileById = async (req, res) => {
  /*
    #swagger.tags = ["Upload"]
    #swagger.description = 'Get a file by event id'
     #swagger.security = [{
               "apikey": []
        }]
  */
  const id = req.params.id;
  await Upload.findAll({ where: { event_id: id } })
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => console.log(err));
};

const getFileByRelative = async (req, res) => {
  /*
    #swagger.tags = ["Upload"]
    #swagger.description = 'Get upload by id'
     #swagger.security = [{
               "apikey": []
        }]
  */
  const relative = req.params.id;
  await Upload.findAll({ where: { relative } })
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  uploadImage,
  getFileById,
  getFileByRelative,
  uploadFile,
};
