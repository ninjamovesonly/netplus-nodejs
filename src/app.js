"use strict";
require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const signale = require("signale");
/* const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger.json"); */
const routes = require("./routes");
const engine = require('consolidate');
const views = require("./views");

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.use(helmet());
app.disable("x-powered-by");

/* app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    customCss: ".topbar{display: none}",
    customSiteTitle: "ISCE Events API",
    swaggerOptions: { filter: true, docExpansion: "none" },
  })
); */

console.log(__dirname + "/../database/db.sqlite");

app.use("/assets", express.static("./src/storage"));

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(routes);

//Handle error
app.use((err, req, res, next) => {
  signale.fatal(err.stack);
  res.status(500).send({
    success: false,
    status: false,
    error: "Something broken! Please contact support.",
    help: "Please check the docs.",
  });
});

//Handle 404
app.use((req, res, next) => {
  /* res.status(404).send({
    success: false,
    status: false,
    error: "Page not found or has been deleted.",
    help: "Please check the docs.",
  }); */
  res.render(views.error);
});

// Store the db connection and start listening on a port.
const startExpress = () => {
  server.listen(process.env.PORT);
  console.log(`server running on localhost:${process.env.PORT}`)
};

// Start express gracefully
startExpress();
