//node fetch
fetch = require("node-fetch");

//dotenv, used for storing apikeys in env variables
require("dotenv").config();

// express
const express = require("express");
const app = express();

// database
const db = require("nedb");
const database = new db("Locations.db");

database.loadDatabase();

// turning the server on
app.listen(3400, () => {
  console.log("Listening at 3400");
});

// setting up static files
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

// setting up the post method
app.post("/api", (request, response) => {
  console.log("New location recieved!");

  database.insert(request.body);

  if (request.body != undefined) {
    request.body.status = "Success";
    response.json(request.body);
  } else {
    response.json({ status: "Something went wrong" });
  }

  response.end();
});

// setting up the get method
app.get("/api", async (request, response) => {
  console.log("Request for database query recieved!");
  database.find({}, (err, data) => {
    if (err) {
      response.json(err);
    }
    response.json(data);
  });
});

// setting up getAQ method
app.get("/getAQ/:lat/:lng", async (request, response) => {
  console.log("New AQ request recieved!");

  const lat = request.params.lat;
  const lng = request.params.lng;

  const AQresponse = await fetch(
    `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`
  );
  const AQdata = await AQresponse.json();

  response.json(AQdata);
});

app.get("/getWeather/:lat/:lng", async (request, response) => {
  if (request != undefined || !request) {
    console.log("Weather request recieved!");

    request.body.status = "Success";

    let lat = request.params.lat;
    let lng = request.params.lng;

    // lat = Math.random() * 90;
    // lng = Math.random() * 180;
    const apiurl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=` +
      process.env.apikey;

    const weatherapiresponse = await fetch(apiurl);
    const weatherinfo = await weatherapiresponse.json();

    response.json(weatherinfo);
  } else {
    response.json("Something went wrong.");
  }
});
