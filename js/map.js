let map;
let markers = [];
let userMarker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2387, lng: -79.8881 },
    zoom: 12,
    mapId: "MAP_ID_GOES_HERE", // Remove or replace with a valid Map ID
  });

  let infoWindow = new google.maps.InfoWindow();

  let marker_clicked = function () {
    infoWindow.close();
    infoWindow.setContent(this.NAME);
    infoWindow.open(map, this);
  };

  for (i = 0; i < locations.length; i++) {
    if (locations[i].type === "park")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
    else if (locations[i].type === "museum")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    else if (locations[i].type === "waterfall")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/waterfall.png";
    else if (locations[i].type === "restaurant")
      new_icon = "https://maps.google.com/mapfiles/ms/icons/purple-dot.png";
    else new_icon = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

    const icon_content = document.createElement("img");
    icon_content.src = new_icon;

    new_marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat: locations[i].lat, lng: locations[i].lng },
      title: locations[i].name,
      content: icon_content,
    });

    new_marker.NAME = locations[i].name;
    new_marker.addListener("click", marker_clicked);
  }
}
