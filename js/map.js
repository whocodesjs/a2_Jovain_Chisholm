/**
 * @fileoverview This file initializes the Google Map, adds markers for predefined locations, handles user interactions, and provides functionalities such as filtering markers, geolocation, and getting directions.
 */

let map;
let markers = [];
let userMarker;
let userLocation = null; // Store the user's location
let directionsRenderer; // Store the directions renderer

/**
 * Initializes the Google Map and sets up event listeners for various user interactions.
 */
function initMap() {
  // Initialize the map centered at a specific location
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2387, lng: -79.8881 },
    zoom: 12,
    mapId: "MAP_ID", // Replace with a valid Map ID or remove if not needed
  });

  // Initialize the directions renderer
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Loop through the locations array and create markers
  for (const location of locations) {
    addMarker(location);
  }

  // Populate the origin and destination dropdowns
  listDropdownOptions();

  // Add event listeners for filter buttons
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

  // Add event listener for "Show All" button
  document.getElementById("show-all").addEventListener("click", () => {
    markers.forEach((marker) => {
      marker.map = map;
    });
  });

  // Add event listener for "Show My Location" button
  document.getElementById("geolocate").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Store the user's location
          userLocation = {
            name: "Your Location",
            lat: pos.lat,
            lng: pos.lng,
          };

          // Add the user's location to the dropdowns
          listDropdownOptions();

          // Show the user's location on the map
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

  // Add event listener for "Get Directions" button
  document
    .getElementById("get-directions")
    .addEventListener("click", getDirections);

  // Add event listeners to dropdowns to prevent same location selection
  document.getElementById("origin").addEventListener("change", updateDropdown);
  document
    .getElementById("destination")
    .addEventListener("change", updateDropdown);

  // Add event listener for the form submission
  document.getElementById("add-marker-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Get form inputs
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;

    // Geocode the address to get latitude and longitude
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const position = results[0].geometry.location;

        // Create a new location object
        const newLocation = {
          name: name,
          lat: position.lat(),
          lng: position.lng(),
          type: category,
          address: address,
          description: description,
        };

        // Add the new location to the locations array
        addLocation(newLocation);

        // Add the new marker to the map
        addMarker(newLocation);

        // Update the dropdowns
        listDropdownOptions();

        // Reset the form
        document.getElementById("add-marker-form").reset();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });
}

/**
 * Adds a marker to the map for a given location.
 * @param {Object} location - The location object containing details of the location.
 */
function addMarker(location) {
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

  let contentString = `<h3>${location.name}</h3>`;
  if (location.address) {
    contentString += `<p>${location.address}</p>`;
  }
  if (location.description) {
    contentString += `<p>${location.description}</p>`;
  }
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

/**
 * Populates the origin and destination dropdowns with locations.
 */
function listDropdownOptions() {
  const originDropdown = document.getElementById("origin");
  const destinationDropdown = document.getElementById("destination");

  // Clear existing options
  originDropdown.innerHTML = '<option value="">Select Origin</option>';
  destinationDropdown.innerHTML =
    '<option value="">Select Destination</option>';

  // Add options for each location
  locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.name;
    option.textContent = location.name;

    originDropdown.appendChild(option.cloneNode(true));
    destinationDropdown.appendChild(option);
  });

  // Add the user's location to the dropdowns if available
  if (userLocation) {
    const userOption = document.createElement("option");
    userOption.value = "Your Location";
    userOption.textContent = "Your Location";

    originDropdown.appendChild(userOption.cloneNode(true));
    destinationDropdown.appendChild(userOption);
  }

  // Update dropdowns to disable selected options
  updateDropdown();
}

/**
 * Updates the dropdowns to prevent the same location from being selected as both origin and destination.
 */
function updateDropdown() {
  const originDropdown = document.getElementById("origin");
  const destinationDropdown = document.getElementById("destination");

  const originValue = originDropdown.value;
  const destinationValue = destinationDropdown.value;

  // Enable all options in both dropdowns
  Array.from(originDropdown.options).forEach(
    (option) => (option.disabled = false)
  );
  Array.from(destinationDropdown.options).forEach(
    (option) => (option.disabled = false)
  );

  // Disable the selected option in the other dropdown
  if (originValue) {
    const selectedOriginOption = destinationDropdown.querySelector(
      `option[value="${originValue}"]`
    );
    if (selectedOriginOption) {
      selectedOriginOption.disabled = true;
    }
  }

  if (destinationValue) {
    const selectedDestinationOption = originDropdown.querySelector(
      `option[value="${destinationValue}"]`
    );
    if (selectedDestinationOption) {
      selectedDestinationOption.disabled = true;
    }
  }
}

/**
 * Clears the directions from the map.
 */
function clearDirections() {
  directionsRenderer.setDirections({ routes: [] });
}

/**
 * Gets directions between the selected origin and destination.
 */
function getDirections() {
  const origin = document.getElementById("origin").value;
  const destination = document.getElementById("destination").value;

  if (!origin || !destination) {
    alert("Please select both origin and destination.");
    return;
  }

  // Find the selected locations in the locations array or use the user's location
  const originLocation =
    origin === "Your Location"
      ? userLocation
      : locations.find((loc) => loc.name === origin);
  const destinationLocation =
    destination === "Your Location"
      ? userLocation
      : locations.find((loc) => loc.name === destination);

  if (!originLocation || !destinationLocation) {
    alert("Invalid origin or destination selected.");
    return;
  }

  // Clear existing directions
  clearDirections();

  // Use Google Maps DirectionsService to get directions
  const directionsService = new google.maps.DirectionsService();
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

/**
 * Filters markers by type.
 * @param {string} type - The type of markers to display (e.g., park, museum, waterfall, restaurant).
 */
function filterMarkers(type) {
  markers.forEach((marker) => {
    marker.map = marker.type === type ? map : null;
  });
}

/**
 * Shows the user's position on the map.
 * @param {Object} position - The position object containing the user's coordinates.
 */
function showPositionOnMap(position) {
  const icon_content = document.createElement("img");
  icon_content.src = "http://maps.google.com/mapfiles/kml/shapes/poi.png";

  // Remove existing user marker if it exists
  if (userMarker) {
    userMarker.map = null;
  }

  // Add a new marker for the user's location
  userMarker = new google.maps.marker.AdvancedMarkerElement({
    map: map,
    position: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    title: "You are here",
    content: icon_content,
  });

  // Center the map on the user's location
  map.setCenter({
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  });
  map.setZoom(14);
}
