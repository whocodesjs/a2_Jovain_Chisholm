/**
 * @fileoverview This file contains the definition of the `locations` array and the `addLocation` function.
 * The `locations` array holds predefined locations with their respective details such as name, latitude, longitude, type, and address.
 * The `addLocation` function allows adding new locations to the `locations` array.
 */

/**
 * Array of predefined locations.
 * Each location object contains the following properties:
 * - name: The name of the location.
 * - lat: The latitude of the location.
 * - lng: The longitude of the location.
 * - type: The type of the location (e.g., park, museum, waterfall, restaurant).
 * - address: The address of the location.
 */
let locations = [
  {
    name: "Bayfront Park",
    lat: 43.2716,
    lng: -79.8724,
    type: "park",
    address: "200 Harbour Front Dr, Hamilton, ON L8L 1C8",
  },
  {
    name: "Royal Botanical Gardens",
    lat: 43.336202,
    lng: -79.909242,
    type: "park",
    address: "1185 York Blvd, Hamilton, ON L0R 2H9",
  },
  {
    name: "Art Gallery of Hamilton",
    lat: 43.2574,
    lng: -79.8721,
    type: "museum",
    address: "123 King St W, Hamilton, ON L8P 4S8",
  },
  {
    name: "Canadian Warplane Heritage Museum",
    lat: 43.1599,
    lng: -79.925,
    type: "museum",
    address: "9280 Airport Rd, Mount Hope, ON L0R 1W0",
  },
  {
    name: "Webster's Falls",
    lat: 43.2763,
    lng: -79.9809,
    type: "waterfall",
    address: "Fallsview Rd, Hamilton, ON L9H 5E2",
  },
  {
    name: "Tiffany Falls",
    lat: 43.2382,
    lng: -79.9581,
    type: "waterfall",
    address: "Tiffany Falls, Hamilton, ON L9C 7N7",
  },
  {
    name: "The Burnt Tongue",
    lat: 43.2605,
    lng: -79.8669,
    type: "restaurant",
    address: "10 Cannon St E, Hamilton, ON L8L 1Z5",
  },
  {
    name: "Rapscallion",
    lat: 43.2612,
    lng: -79.8668,
    type: "restaurant",
    address: "61 Young St, Hamilton, ON L8N 1V1",
  },
  {
    name: "Dundurn Castle",
    lat: 43.2695,
    lng: -79.8846,
    type: "museum",
    address: "610 York Blvd, Hamilton, ON L8R 3E7",
  },
  {
    name: "Gage Park",
    lat: 43.2424,
    lng: -79.8287,
    type: "park",
    address: "1000 Main St E, Hamilton, ON L8M 1N2",
  },
];

/**
 * Adds a new location to the `locations` array.
 * @param {Object} newLocation - The new location object to be added.
 * @param {string} newLocation.name - The name of the new location.
 * @param {number} newLocation.lat - The latitude of the new location.
 * @param {number} newLocation.lng - The longitude of the new location.
 * @param {string} newLocation.type - The type of the new location (e.g., park, museum, waterfall, restaurant).
 * @param {string} newLocation.address - The address of the new location.
 */
function addLocation(newLocation) {
  locations.push(newLocation);
}
