async function getAllLocations() {
  console.log("Fetching data..");
  const response = await fetch("/queryDB");
  const data = await response.json();

  if (data == undefined) return "Database is empty";

  for (loc of data) {
    let tr = document.createElement("tr");

    for (package in loc) {
      let td = document.createElement("td");
      td.innerHTML = loc[package];
      tr.appendChild(td);
    }
    // let tdNo = document.createElement("td");
    // tdNo.innerHTML = data.indexOf(loc);
    // let tdLat = document.createElement("td");
    // tdLat.innerHTML = loc.Latitude;
    // let tdLng = document.createElement("td");
    // tdLng.innerHTML = loc.Longitude;
    // let tdTime = document.createElement("td");
    // tdTime.innerHTML = loc.Timestamp;
    // let tdWeatherStatus = document.createElement("td");
    // tdWeatherStatus.innerHTML = loc["Weather status"];
    // let tdTemp = document.createElement("td");
    // tdTemp.innerHTML =
    //   loc.Temperature != undefined ? loc.Temperature : `Can't find info`;

    //tr.append(tdNo, tdLat, tdLng, tdTime, tdWeatherStatus, tdTemp);
    document.getElementById("table").appendChild(tr);
  }
}

getAllLocations();
