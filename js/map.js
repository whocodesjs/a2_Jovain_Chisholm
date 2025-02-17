let map;
let markers = [];
let userMarker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2387, lng: -79.8881 },
    zoom: 12,
    mapId: "MAP_ID_GOES_HERE", // Remove or replace with a valid Map ID
  });
}
