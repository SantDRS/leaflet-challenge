// Jose Santos
// Module 15 leaflet_challenge

function createMap(earthquakes) {

    // Create tile layer for map background
    let street_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create scale
    let scale = L.control.scale({
        position: 'bottomright',
        imperial: true
    });
    
    // Create baseMaps object to hold street_map layer
    let baseMaps = {
      "Street Map": street_map
    };
  
    // Create overlayMaps object to hold the earthquake markers layer
    let overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create map object with options
    let mymap = L.map("map", {
      center: [29.4241, -98.4936],
      zoom: 7,
      layers: [street_map, earthquakes]
    });
   
    // Create layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(mymap);
  }
  
  function createMarkers(response) {

    // Pull "earthquake" property from response.data
    let features = response.features;
  
    // Initialize array to hold earthquake markers
    let earthquakeMarkers = [];
  
    // Loop through features array
    for (let i = 0; i < features.length; i++) {
      let feature = features[i];
      let coordinates = feature.geometry.coordinates;
      let magnitude = feature.properties.mag;
  
      // Choose a color based on the depth of the earthquake.
      let color = "";
      if (coordinates[2] > 90) {
        color = "purple";
      } else if (coordinates[2] > 70 && coordinates[2] < 90) {
        color = "blue";
      } else if (coordinates[2] > 50 && coordinates[2] < 70) {
        color = "teal";
      } else if (coordinates[2] > 30 && coordinates[2] < 50) {
        color = "maroon";
      } else if (coordinates[2] > 10 && coordinates[2] < 30) {
        color = "silver";
      } else {
        color = "olive";
      }

      // Create a marker for each earthquake 
      let earthquakeMarker = L.polygon([ [coordinates[1], coordinates[0] + 0.2], [coordinates[1] + 0.2, coordinates[0]], [coordinates[1], coordinates[0] - 0.2], [coordinates[1] - 0.2, coordinates[0]] ], {
        fillOpacity: 1,
        color: "black",
        weight: 1,
        fillColor: color,

        // Adjust radius
        radius: parseFloat(magnitude) * 10000
      }).bindPopup("<h3>Earthquake Information</h3><hr><p><strong>Magnitude:</strong> " + magnitude + "</p>");
  
      // Add marker to earthquakeMarkers array
      earthquakeMarkers.push(earthquakeMarker);
    }
  
    // Create a layer for earthquake markers array, and pass to createMap function
    createMap(L.layerGroup(earthquakeMarkers));
  }
  
  // Perform API call to data site to and createMarkers function
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(createMarkers);
