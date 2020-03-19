var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var cors = require("cors");
const GSR = require("google-search-results-nodejs");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 4000; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log("requesting...");
  next();
});

const cache = {};

router.post("/search", async (req, res) => {
  const { q } = req.body;
  if (!q) {
    return res.json({});
  }
  if (cache[q]) {
    return res.json(cache[q]);
  }

  const client = new GSR.GoogleSearchResults(process.env.GSR_KEY);

  client.json(req.body, function(data) {
    cache[q] = data;
    res.json({ organicResults: data.organic_results });
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
