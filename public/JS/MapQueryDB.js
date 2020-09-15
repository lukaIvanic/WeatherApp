// consts
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// leaflet map bs
const mymap = L.map("mapid").setView([0, 0], 1);
const tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(mymap);

async function getAllLocations() {
  const response = await fetch("/queryDB");
  const data = await response.json();

  for (loc of data) {
    let weatherstatus;
    switch (loc["Weather status"].toLowerCase()) {
      case "rain":
        weatherstatus = "rainy";
        break;
      case "clouds":
        weatherstatus = "cloudy";
        break;
      default:
        weatherstatus = loc["Weather status"].toLowerCase();
        break;
    }

    const txt = `The weather status here at ${loc.Latitude}&deg; was ${
      loc.Longitude
    }&deg; is ${weatherstatus}, with a temperature of ${Math.round(
      loc.Temperature
    )}&deg; C at ${loc.Timestamp}.`;

    // Marker
    let marker = L.marker([loc.Latitude, loc.Longitude]).addTo(mymap);
    marker.bindPopup(txt);
  }
}

getAllLocations();
