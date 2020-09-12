async function getAllLocations() {
  console.log("Fetching data..");
  const response = await fetch("/api");
  const data = await response.json();

  for (loc of data) {
    let tr = document.createElement("tr");
    let tdNo = document.createElement("td");
    tdNo.innerHTML = data.indexOf(loc);
    let tdLat = document.createElement("td");
    tdLat.innerHTML = loc.lat;
    let tdLng = document.createElement("td");
    tdLng.innerHTML = loc.lng;
    let tdTime = document.createElement("td");
    tdTime.innerHTML = loc.date;
    let tdWeatherStatus = document.createElement("td");
    tdWeatherStatus.innerHTML = loc.weatherstatus;
    let tdTemp = document.createElement("td");
    tdTemp.innerHTML =
      loc.temp != undefined ? loc.temp.toFixed(2) : `Can't find info`;

    tr.append(tdNo, tdLat, tdLng, tdTime, tdWeatherStatus, tdTemp);
    document.getElementById("table").appendChild(tr);
  }
}

getAllLocations();
