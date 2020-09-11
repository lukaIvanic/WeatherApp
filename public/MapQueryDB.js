// consts
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

// leaflet map bs
const mymap = L.map("mapid").setView([0, 0], 1);
const tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(mymap);

async function getAllLocations() {
  const response = await fetch("/api");
  const data = await response.json();

  for (loc of data) {
    let weatherstatus;
    switch (loc.weatherstatus.toLowerCase()) {
      case "rain":
        weatherstatus = "rainy";
        break;
      case "clouds":
        weatherstatus = "cloudy";
        break;
      default:
        weatherstatus = loc.weatherstatus.toLowerCase();
        break;
    }

    const txt = `The weather status here at ${loc.lat}&deg; was, ${
      loc.lng
    }&deg; is ${weatherstatus} with a temperature of ${Math.round(
      loc.temp
    )}&deg; C at ${loc.date}.`;

    // Marker
    let marker = L.marker([loc.lat, loc.lng]).addTo(mymap);
    marker.bindPopup(txt);
  }
}

getAllLocations();
