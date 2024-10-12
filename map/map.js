
var color_data = {
  "box": ["rec8UZJfhC8yCdPbB", "#ff7f11"],
  "bullet":["recxCtRV7ljIxXQ8n", "#ff3f00"],
  "dome": ["reczcJy0asZKXfCJB", "#7DDF64"],
  "doorbell": ["recEuO93A47OVxl46", "#2660A4"],
  "nest": ["recIXNdUhIjiSTLXS", "#0CA4A5"],
  "ptz": ["recLM2NLdaxYnyrB1", "#03CEA4"],
  "turret":["recNESaA2fKPfVrmy", "#FDE74C"],
};

console.log("hello map");

const map = L.map('map').fitWorld();

// L.tileLayer.grayscale(url, options)
const tiles = L.tileLayer.grayscale('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function onLocationFound(e) {
  const radius = e.accuracy / 2;

  // const locationMarker = L.marker(e.latlng).addTo(map)
  //   .bindPopup(`You are within ${radius} meters from this point`).openPopup();

  const locationCircle = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 16});

//move or zoom triggers this, could be used to update the makers
map.on('moveend', () => {
  console.log("move");
});

//get locations from airtable, right now just get all locations!
//could the distance calc maybe be dont by airtable??
let allSightings = [];
let markers = [];

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'patxeF8i4nhZP07q7.c5859ae986f18ab5b26786adee657598d3110ae493d921a44062fcc628e873c7' }).base('appkKVYgOCUz8gC1H');

//get all ther recores
base('sightings').select({view: 'Grid view'}).all().then(records => {
  // records array will contain every record in Main View.
  console.log("data received");
  allSightings = records; //might
  makeMarkers();
}).catch(err => {
  // Handle error.
})

function makeMarkers(){
  //debugger;

  for(let s of allSightings){
    // debugger;
    let marker = L.circle([s.get("latitude"), s.get("longitude")], {
      color: color_data[s.get("species")][1],
      // fill: color_data[s.get("species")][1],
      // fill: '#f03',
      fillOpacity: 0.8,
      radius:10
    }).addTo(map);
    marker.bindPopup(`<img src=${s.get("base64")}>`);
    markers.push(marker);
  }
}


//filter the results, only grab the points that are within 5 km
//don't destroy the original list, just make a sub copy

//use the haversine formula, thanks chatgpt
// function haversineDistance(lat1, lon1, lat2, lon2) {
//     const toRadians = (degrees) => degrees * (Math.PI / 180);

//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);
//     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//               Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in kilometers
// }

//for each point in the list
//put a small circle, the color should be equivalent to the same color from the capture function

//pin a popup to each, show the image of the caputre in the popup, if possible!

//if there is a move, update the list of pins

//here is how you can remove markers, but in yoru case markers is an array of marker
// var marker;
// function onMapClick(e) {
//         marker = new L.Marker(e.latlng, {draggable:true});
//         map.addLayer(marker);
//         marker.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
// };

// then later :

// map.removeLayer(marker)

