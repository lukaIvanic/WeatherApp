let sendButton = document.getElementById("SendButton");
let sendingStatus = document.getElementById("SendingStatus");
sendButton.disabled = true;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    console.log(position);

    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

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

        document.getElementById("Latitude").innerHTML =
          "Latitude: " + lat + "&deg;";
        document.getElementById("Longitude").innerHTML =
          "\nLongitude: " + lng + "&deg;";
        document.getElementById("myLink").innerHTML = "Sending...";
      });

      document.getElementById("weatherinfo").style.display = "block";
      document.getElementById("locationspan").innerHTML = "loading...";
      document.getElementById("summaryspan").innerHTML = "loading...";
      document.getElementById("temperaturespan").innerHTML = "loading...";

      const weatherinfo = await getWeatherInfo(lat, lng);

      document.getElementById("myLink").innerHTML = "Location sent!";

      console.log("weatherinfo: ");
      console.log(weatherinfo);

      document.getElementById(
        "locationspan"
      ).innerHTML = `${weatherinfo.coord.lat}°, ${weatherinfo.coord.lon}°`;
      document.getElementById(
        "summaryspan"
      ).innerHTML = `${weatherinfo.weather[0].main}`;
      document.getElementById("temperaturespan").innerHTML = `${(
        weatherinfo.main.temp - 270.15
      ).toFixed(0)}`;
      document.getElementById(
        "locationspan"
      ).innerHTML = `${weatherinfo.coord.lat}°, ${weatherinfo.coord.lon}° (${weatherinfo.name} station)`;

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

      console.log(
        await sendLocToServer(
          lat,
          lng,
          date,
          weatherinfo.weather[0].main,
          weatherinfo.main.temp - 270.15
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

async function sendLocToServer(lat, lng, date, weatherstatus, temp) {
  console.log("weatherstatus: " + weatherstatus);
  console.log("temp: " + temp);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng, date, weatherstatus, temp }),
  };
  const response = await fetch("/api", options);
  const data = await response.json().then((server_response) => {
    return server_response;
  });

  return data;
}

async function getWeatherInfo(lat, lng) {
  const response = await fetch(`/getWeather/${lat}/${lng}`);
  return await response.json();
}

async function getAQInfo(lat, lng) {
  const response = await fetch(`/getAQ/${lat}/${lng}`);
  return await response.json();
}
