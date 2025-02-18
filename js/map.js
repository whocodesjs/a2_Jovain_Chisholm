let map;
let markers = [];
let userMarker;
let userLocation = null;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2387, lng: -79.8881 },
    zoom: 12,
    mapId: "MAP_ID",
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

  listDropdownOptions();

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

  document.getElementById("geolocate").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          userLocation = {
            name: "You are here",
            lat: pos.lat,
            lng: pos.lng,
          };

          listDropdownOptions();

          showPositionOnMap(position);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });

  document
    .getElementById("get-directions")
    .addEventListener("click", getDirections);

  document.getElementById("origin").addEventListener("change", updateDropdown);
  document
    .getElementById("destination")
    .addEventListener("change", updateDropdown);
}

function listDropdownOptions() {
  const originDropdown = document.getElementById("origin");
  const destinationDropdown = document.getElementById("destination");

  originDropdown.innerHTML = '<option value="">Select Origin</option>';
  destinationDropdown.innerHTML =
    '<option value="">Select Destination</option>';

  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.name;
    option.textContent = location.name;

    originDropdown.appendChild(option.cloneNode(true));
    destinationDropdown.appendChild(option);
  });

  if (userLocation) {
    const userOption = document.createElement("option");
    userOption.value = "You are here";
    userOption.textContent = "You are here";

    originDropdown.appendChild(userOption.cloneNode(true));
    destinationDropdown.appendChild(userOption);
  }

  updateDropdown();
}

function updateDropdown() {
  const originDropdown = document.getElementById("origin");
  const destinationDropdown = document.getElementById("destination");

  const originValue = originDropdown.value;
  const destinationValue = destinationDropdown.value;

  Array.from(originDropdown.options).forEach(
    (option) => (option.disabled = false)
  );
  Array.from(destinationDropdown.options).forEach(
    (option) => (option.disabled = false)
  );

  if (originValue) {
    const selectedOrigin = destinationDropdown.querySelector(
      `option[value="${originValue}"]`
    );
    if (selectedOrigin) {
      selectedOrigin.disabled = true;
    }
  }

  if (destinationValue) {
    const selectedDestination = originDropdown.querySelector(
      `option[value="${destinationValue}"]`
    );
    if (selectedDestination) {
      selectedDestination.disabled = true;
    }
  }
}

function getDirections() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (!origin || !destination) {
    alert("Please select both origin and destination");
    return;
  }

  const originLocation =
    origin === "You are here"
      ? userLocation
      : locations.find((loc) => loc.name === origin);
  const destinationLocation =
    destination === "You are here"
      ? userLocation
      : locations.find((loc) => loc.name === destination);

  if (!originLocation || !destinationLocation) {
    alert("Invalid origin or destination selected");
    return;
  }

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);

  directionsService.route(
    {
      origin: { lat: originLocation.lat, lng: originLocation.lng },
      destination: {
        lat: destinationLocation.lat,
        lng: destinationLocation.lng,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        alert("Directions request failed due to " + status);
      }
    }
  );
}

// Filter markers by type
function filterMarkers(type) {
  markers.forEach((marker) => {
    marker.map = marker.type === type ? map : null;
  });
}

function showPositionOnMap(position) {
  const icon_content = document.createElement("img");
  icon_content.src = "http://maps.google.com/mapfiles/kml/shapes/poi.png";

  if (userMarker) {
    userMarker.map = null;
  }

  userMarker = new google.maps.marker.AdvancedMarkerElement({
    map: map,
    position: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    title: "You are here",
    content: icon_content,
  });

  map.setCenter({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  });
  map.setZoom(14);
}
