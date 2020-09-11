let sendButton = document.getElementById("SendButton");
let sendingStatus = document.getElementById("SendingStatus");
sendButton.disabled = true;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    console.log(position);

    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    sendButton.disabled = false;

    document.getElementById("Latitude").innerHTML = "Latitude: " + lat;
    document.getElementById("Longitude").innerHTML = "Longitude: " + lng;

    const date = getDate();

    sendButton.addEventListener("click", async (event) => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        document.getElementById("Latitude").innerHTML = "Latitude: " + lat;
        document.getElementById("Longitude").innerHTML = "Longitude: " + lng;
      });
      console.log("AQ INFO");
      console.log(await getAQInfo(lat, lng));
      document.getElementById("weatherinfo").style.display = "block";
      document.getElementById("locationspan").innerHTML = "loading...";
      document.getElementById("summaryspan").innerHTML = "loading...";
      document.getElementById("temperaturespan").innerHTML = "loading...";

      const weatherinfo = await getWeatherInfo(lat, lng);

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
      ).innerHTML = `${weatherinfo.coord.lat}°, ${weatherinfo.coord.lon}°`;
      document.getElementById(
        "summaryspan"
      ).innerHTML = `${weatherinfo.weather[0].main}`;
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
  sendingStatus.innerHTML = "Sending data to server...";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng, date, weatherstatus, temp }),
  };
  const response = await fetch("/api", options);
  const data = await response.json().then((server_response) => {
    sendingStatus.innerHTML = "Location sent! Send again?";
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

// marin
document.getElementById("intro").addEventListener("click", (event) => {
  if (document.getElementById("text").innerHTML != "marin") {
    document.getElementById("text").innerHTML = "marin";
  } else {
    document.getElementById("text").innerHTML = "Who is the biggest retard?";
  }
});
