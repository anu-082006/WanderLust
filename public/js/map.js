import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.0.0/dist/maplibre-gl.mjs';

const mapData = JSON.parse(
    document.getElementById("map-data").textContent
);

const coordinates = mapData.coordinates.coordinates;

const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/bright",
    center: coordinates,
    zoom: 13
});

// Fullscreen button
map.addControl(new maplibregl.FullscreenControl());

const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML(`
        <p>Exact location provided after booking</p>
    `);

new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);