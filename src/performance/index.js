const loadtest = require("loadtest");

const BASE_URL =
  process.env.NODE_ENV === "development" ?
    "http://localhost:3000" : "https://api.isce.app"; // insert correct production api base url

const options = {
  url: `${BASE_URL}/api/events?page=1&limit=50`,
  maxRequests: 1000,
};
loadtest.loadTest(options, function (error, result) {
  if (error) {
    return console.error("Got an error: %s", error);
  }
  console.log(result);
  console.log("Tests run successfully");
});
