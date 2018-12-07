// Default public access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGllbWNmYWxsIiwiYSI6ImNqcDlwMDhiZDA5angzcHFqeTM1MDc5ZTkifQ.2CHynRh3rtgVuaxsa6_O8w';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v9', // stylesheet location
  center: [-87.6298, 41.8781], // starting position [lng, lat]
  zoom: 12, // starting zoom
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// When map has loaded
map.on('load', function () {

  // District borders
  map.addSource("borders", {
    "type": "geojson",
    "data": "./data/boundaries.geojson"
  });

  map.addLayer({
    'id': 'borders',
    'type': 'fill',
    'source': 'borders',
    'layout': {},
    'paint': {
      'fill-color': {
        type: 'identity',
        property: 'color',
      },
      'fill-opacity': 0.5,
      'fill-outline-color': '#088',//'rgba(200, 100, 240, 1)'
    }
    // 'paint': {
    //   'fill-color': '#088',
    //   'fill-opacity': 0.2,
    //   //'line-color': '#088',
    //   //'line-opacity': 0.8,
    // },
    //'fill-outline-color': '#ffff00',
  });

  // map.addLayer({
  //   "id": "borders",
  //   "type": "circle",
  //   "source": "borders",
  //   //"paint": "line-opacity",
  //   }
  // });



  // Police stations
  map.addSource("police-stations", {
    "type": "geojson",
    "data": "./data/police-stations.geojson"
  });

  map.addLayer({
    "id": "police-stations",
    "type": "circle",
    "source": "police-stations",
    "paint": {
      "circle-radius": 5,
      "circle-color": "#ff0000"
    }
  });

  // When a click event occurs on a feature in the police stations layer, open a
  // popup at the location of the click, with description HTML from its properties.
  map.on('click', 'police-stations', function (e) {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(e.features[0].properties.District)
    .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the states layer.
  map.on('mouseenter', 'police-stations', function () {
      map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'police-stations', function () {
      map.getCanvas().style.cursor = '';
  });
});

var toggleableLayerIds = [ 'police-stations', 'borders' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
