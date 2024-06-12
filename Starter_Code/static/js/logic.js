d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
    // Create a map object
    let myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 5
    });
  
    // Add a tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(myMap);

    // Define depth ranges and corresponding colors
    let depthRanges = [0, 10, 30, 50, 70, 90];
    let colors = ["green", "lightgreen", "yellow", "orange", "darkorange", "red"];

    // Create legend HTML
    let html = '<div id="legend">';
    html += '<h3>Depth (km)</h3>';
    for (let i = 0; i < depthRanges.length; i++) {
        html += `<div><span class="legend-color" style="background-color: ${colors[i]}"></span>${depthRanges[i]} - ${depthRanges[i + 1] || '+'}</div>`;
    }
    html += '</div>';

    // Add legend to map
    let control = L.control({ position: "bottomright" });
    control.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML = html;
        return div;
    };
    control.addTo(myMap);

    // Loop through the data to create map markers
    let features = data.features;
    for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let coords = feature.geometry.coordinates;
        let properties = feature.properties;
        let depth = coords[2];
        let magnitude = properties.mag;

        // Determine marker color based on depth
        let fillColor = depth > 90 ? colors[5] :
                        depth > 70 ? colors[4] :
                        depth > 50 ? colors[3] :
                        depth > 30 ? colors[2] :
                        depth > 10 ? colors[1] :
                                    colors[0];

        // Create a circle marker
        let marker = L.circleMarker([coords[1], coords[0]], {
            radius: magnitude * 4,
            color: "#000",
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(myMap);

        // Bind a popup to the marker
        marker.bindPopup(`<h3>${properties.place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p><p>${new Date(properties.time)}</p>`);
    }
});
