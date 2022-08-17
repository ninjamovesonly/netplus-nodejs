"use strict";
require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    version: "1.0.0",
    title: "Events API",
    description: "ISCE Events API",
  },
  host: process.env.BASE_URL,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    apikey: {
      type: "apiKey",
      name: "apikey",
      in: "header",
    },
  },
  definitions: {},
};
const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  process.exit(0);
});
