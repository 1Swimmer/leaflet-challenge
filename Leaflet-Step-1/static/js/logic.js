// I had learned this code based on clase activites. It was used as referece.

// Store our API endpoint inside queryUrl
let lastmontheearthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

let API_KEY = "pk.eyJ1Ijoic3dpbW1lcjIwMjEiLCJhIjoiY2trN2twaWw4MDJjdjJwbnNmODJhNnZhbiJ9.s3GEXBxC-KHLvDaHKGtugQ"

// Perform a GET request to the query URL
d3.json(lastmontheearthquakeURL, function(data) {
// Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Fuction to define earthquake magnitude colors
function magnitudecolor(earthquakemagnitudecolor) {
    if (earthquakemagnitudecolor <=1){
        return "lightgreen"
    }
    else if (earthquakemagnitudecolor <=2){
        return "green"
    }
    else if (earthquakemagnitudecolor <=3){
        return "lightyellow"
    }
    else if (earthquakemagnitudecolor <=4){
        return "yellow"
    }
    else if (earthquakemagnitudecolor <=5){
        return "lightred"
    }
    else {
        return "red"
    }
}

function circlesize(earthquakemagnitude) {
    if (earthquakemagnitude ==1){
        return earthquakemagnitude * 2000
    }
    if (earthquakemagnitude ==2){
        return earthquakemagnitude * 3000
    }
    if (earthquakemagnitude ==3){
        return earthquakemagnitude * 4000
    }
    if (earthquakemagnitude ==4){
        return earthquakemagnitude * 5000
    }
    else {
        return earthquakemagnitude * 6000
    }
}

function createFeatures(earthquakeData) {

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + (feature.properties.mag) + (feature.geometry.coordinates[2])+"</p>");
  }

// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
  let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, location){
          return new L.circle(location,{
              fillColor: magnitudecolor(feature.properties.mag),
              radius: circlesize(feature.properties.mag)
          })
      },
    onEachFeature: onEachFeature
  });

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

// Define streetmap and darkmap layers
  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,     
     zoomOffset: -1,
     id: "mapbox/light-v10",
    accessToken: API_KEY
 });

  let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
     tileSize: 512,
     maxZoom: 18,     
     zoomOffset: -1,
     id: "mapbox/dark-v10",
    accessToken: API_KEY
 });

// Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

// Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

// Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}