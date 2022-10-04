const loadtest = require("loadtest");
const options = {
  url: "http://localhost:3000/api/events?page=1&limit=50",
  maxRequests: 1000,
};
loadtest.loadTest(options, function (error, result) {
  if (error) {
    return console.error("Got an error: %s", error);
  }
  console.log(result);
  console.log("Tests run successfully");
});
