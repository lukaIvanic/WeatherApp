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

// MySQL2 connection
const mysql = require("mysql2/promise");

//initial connect to the sql database
const db_name = "b3i91dsrgem0c0nh";
const table_name = "weather_logs";
let con;
// async function connect() {
//   try {
//     const con = await mysql.createConnection({
//       host: "localhost",
//       port: "3306",
//       user: "root",
//       password: "toor",
//       database: db_name,
//     });
//     return con;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function connect() {
  try {
    const con = await mysql.createConnection({
      host: "e7qyahb3d90mletd.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
      port: "3306",
      user: "sldh21h20mbrh96r",
      password: "vv02p1t11j57o6et",
      database: db_name,
    });
    return con;
  } catch (error) {
    console.error(error);
  }
}

// Posting new weather log
async function pushLog(package) {
  if (con == undefined) con = await connect();
  const {
    lat,
    lng,
    timestamp,
    temp,
    country,
    sunrise,
    sunset,
    weatherstatus,
    weatherdesc,
  } = package;
  await con.query(
    `INSERT INTO ${table_name} (Latitude, Longitude, Timestamp, Temperature, Country, Sunrise, Sunset, \`Weather status\`, \`Weather Description\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lat,
      lng,
      timestamp,
      temp,
      country,
      sunrise,
      sunset,
      weatherstatus,
      weatherdesc,
    ]
  );

  return readDB();
}

// Delete from database
async function popLogs() {
  if (con == undefined) con = await connect();
  await con.query(`DELETE FROM ${table_name}`);
  return readDB();
}

// Read DB
async function readDB() {
  if (con == undefined) con = await connect();
  const [db_query, metadata] = await con.query(`SELECT * FROM ${table_name}`);
  return db_query;
}

// turning the server on
const port = process.env.PORT || 3900;
app.listen(port, () => {
  console.log(`Starting server at ${port}.`);
});

// setting up static files
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

// setting up the post method
app.post("/pushlog", async (request, response) => {
  console.log("New location recieved!");

  database.insert(request.body);
  console.log(request.body);
  await pushLog(request.body);

  if (request.body != undefined) {
    request.body.status = "Success";
    response.json(request.body);
  } else {
    response.json({ status: "Something went wrong" });
  }

  response.end();
});

// setting up the get method
app.get("/queryDB", async (request, response) => {
  response.json(await readDB());
});

//Getting weather from OpenWeatherMap
app.get("/getWeather/:lat/:lng", async (request, response) => {
  console.log("Weather request recieved!");

  request.body.status = "Success";

  let lat = request.params.lat;
  let lng = request.params.lng;

  // testing for random locations
  // lat = Math.random() * 90;
  // lng = Math.random() * 180;
  const apiurl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=` +
    process.env.apikey;

  const weatherapiresponse = await fetch(apiurl);
  const weatherinfo = await weatherapiresponse.json();

  response.json(weatherinfo);
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
