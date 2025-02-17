let map;
let markers = [];
let userMarker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2387, lng: -79.8881 },
    zoom: 12,
    mapId: "MAP_ID_GOES_HERE", // Remove or replace with a valid Map ID
  });

  for (const location of locations) {
    let new_icon;
    if (location.type === "park")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    else if (location.type === "museum")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    else if (location.type === "waterfall")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    else if (location.type === "restaurant")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    else new_icon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

    const icon_content = document.createElement("img");
    icon_content.src = new_icon;

    const contentString = `<h3>${location.name}</h3>${
      location.address ? `<p>${location.address}</p>` : ""
    }`;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat: location.lat, lng: location.lng },
      title: location.name,
      content: icon_content,
    });

    marker.type = location.type;

    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });

    markers.push(marker);
  }

  document
    .getElementById("show-parks")
    .addEventListener("click", () => filterMarkers("park"));
  document
    .getElementById("show-museums")
    .addEventListener("click", () => filterMarkers("museum"));
  document
    .getElementById("show-waterfalls")
    .addEventListener("click", () => filterMarkers("waterfall"));
  document
    .getElementById("show-restaurants")
    .addEventListener("click", () => filterMarkers("restaurant"));

  document.getElementById("show-all").addEventListener("click", () => {
    markers.forEach((marker) => {
      marker.map = map;
    });
  });
}

// Filter markers by type
function filterMarkers(type) {
  markers.forEach((marker) => {
    marker.map = marker.type === type ? map : null;
  });
}
