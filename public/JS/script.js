let sendButton = document.getElementById("SendButton");
let sendingStatus = document.getElementById("SendingStatus");
let randomLoc = false;
sendButton.disabled = true;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    console.log(position);

    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    //Radnom values
    if (randomLoc) {
      lat = Math.random() > 0.5 ? Math.random() * 90 : Math.random() * -90;
      lng = Math.random() > 0.5 ? Math.random() * 180 : Math.random() * -180;
    }

    const weatherinfo = await getWeatherInfo(lat, lng);
    await updateUserData(weatherinfo);

    sendButton.disabled = false;

    document.getElementById("Latitude").innerHTML =
      "Latitude: " + lat + "&deg;";
    document.getElementById("Longitude").innerHTML =
      "Longitude: " + lng + "&deg;";

    const date = getDate();

    sendButton.onmouseenter = function () {
      if (
        document.getElementById("myLink").innerHTML.toLowerCase() ===
        "location sent!"
      ) {
        document.getElementById("myLink").innerHTML = "send again?";
      }
    };
    sendButton.onmouseleave = function () {
      if (
        document.getElementById("myLink").innerHTML.toLowerCase() ===
        "send again?"
      ) {
        document.getElementById("myLink").innerHTML = "Location sent!";
      }
    };
    sendButton.onmouseout = function () {};
    sendButton.addEventListener("click", async (event) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        //Random values
        if (randomLoc) {
          lat = Math.random() > 0.5 ? Math.random() * 90 : Math.random() * -90;
          lng =
            Math.random() > 0.5 ? Math.random() * 180 : Math.random() * -180;
        }

        document.getElementById("Latitude").innerHTML =
          "Latitude: " + lat + "&deg;";
        document.getElementById("Longitude").innerHTML =
          "\nLongitude: " + lng + "&deg;";
        document.getElementById("myLink").innerHTML = "Sending...";
		
		const weatherinfo = await getWeatherInfo(lat, lng);
      await updateUserData(weatherinfo);
      });


      let weatherstatus;
      switch (weatherinfo.weather[0].main.toLowerCase()) {
        case "mist":
          weatherstatus = "foggy";
          break;
        case "clouds":
          weatherstatus = "cloudy";
          break;
        default:
          weatherstatus = weatherinfo.weather[0].main.toLowerCase();
          break;
      }

      document.getElementById("summaryspan").innerHTML = `${weatherstatus}`;
      document.getElementById("temperaturespan").innerHTML = `${(
        weatherinfo.main.temp - 270.15
      ).toFixed(0)}`;

      const date = new Date();
      console.log(
        await sendLocToServer(
          lat,
          lng,
          date.getTime(),
          weatherinfo.main.temp - 270.15,
          weatherinfo.sys.country,
          weatherinfo.sys.sunrise * 1000,
          weatherinfo.sys.sunset * 1000,
          weatherinfo.weather[0].main,
          weatherinfo.weather[0].description
        )
      );
    });
  });
} else {
  document.getElementById("Latitude").innerHTML = "Premission denied";
  document.getElementById("Longitude").innerHTML = "Premission denied";
}

function getDate() {
  const date0 = new Date();
  let date =
    date0.getDate() +
    "/" +
    (date0.getMonth() + 1) +
    "/" +
    date0.getFullYear() +
    ", ";

  if (date0.getHours() < 10) {
    date += "0";
  }
  date += date0.getHours();

  date += ":";

  if (date0.getMinutes() < 10) {
    date += "0";
  }
  date += date0.getMinutes();
  return date;
}

async function sendLocToServer(
  lat,
  lng,
  timestamp,
  temp,
  country,
  sunrise,
  sunset,
  weatherstatus,
  weatherdesc
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat,
      lng,
      timestamp,
      temp,
      country,
      sunrise,
      sunset,
      weatherstatus,
      weatherdesc,
    }),
  };
  const response = await fetch("/pushlog", options);
  const data = await response.json().then((server_response) => {
    return server_response;
  });

  return data;
}

async function getWeatherInfo(lat, lng) {
  const response = await fetch(`/getWeather/${lat}/${lng}`);
  const json = await response.json();
  console.log(json);
  return json;
}

async function getAQInfo(lat, lng) {
  const response = await fetch(`/getAQ/${lat}/${lng}`);
  return await response.json();
}

async function updateUserData(weatherinfo) {
  document.getElementById("weatherinfo").style.display = "block";
  document.getElementById("locationspan").innerHTML = "loading...";
  document.getElementById("summaryspan").innerHTML = "loading...";
  document.getElementById("temperaturespan").innerHTML = "loading...";

  document.getElementById(
    "locationspan"
  ).innerHTML = `${weatherinfo.coord.lat}°, ${weatherinfo.coord.lon}°`;
  document.getElementById(
    "summaryspan"
  ).innerHTML = `${weatherinfo.weather[0].main}`;
  document.getElementById("temperaturespan").innerHTML = `${(
    weatherinfo.main.temp - 270.15
  ).toFixed(0)}`;

  let station_name = "unknown";
  if (weatherinfo.name !== "") {
    station_name = weatherinfo.name;
  }

  document.getElementById(
    "locationspan"
  ).innerHTML = `${weatherinfo.coord.lat}°, ${weatherinfo.coord.lon}° (${station_name} station)`;

  document.getElementById("myLink").innerHTML = "Location sent!";
}

function toggle() {
  randomLoc = !randomLoc;
}
