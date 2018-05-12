import { Browser, Control, geoJson, Map, Point } from 'leaflet';
import Swiss, { EPSG_2056 as crs, latLngBounds, unproject_2056 as unproject } from 'leaflet-tilelayer-swiss';
import 'd3';
import 'leaflet.elevation/src/L.Control.Elevation';

export function getOptions() {
  const encodedOptions = window.location.search.split('options=').pop();
  if (encodedOptions) {
    return JSON.parse(decodeURIComponent(encodedOptions));
  }
  return {};
}

export function getBaseLayers() {
  return {
    'Gray map': new Swiss({
      layer: 'ch.swisstopo.pixelkarte-grau',
      opacity: 0.5,
    }),
    'Color map': new Swiss({
      opacity: 0.5,
    }),
    'Aerial imagery': new Swiss({
      layer: 'ch.swisstopo.swissimage',
      maxZoom: 28,
      opacity: 0.5,
    }),
  };
}

export function initMap(defaultBaseLayer) {
  const container = window.document.createElement('div');
  window.document.body.appendChild(container);

  return new Map(container, {
    crs,
    layers: [defaultBaseLayer],
    maxBounds: latLngBounds,
  });
}

export function initLayerControl(baseLayers) {
  return new Control.Layers(baseLayers);
}

export function getTrack(url) {
  return fetch(url).then(response => response.json()).then((features) => {
    const track = geoJson(features, {
      style: () => ({
        color: '#4682b4',
        weight: 5,
      }),
    });
    return track;
  });
}

function initElevationControl(track) {
  const elevation = new Control.Elevation({
    position: 'bottomright',
    theme: 'steelblue-theme',
    useHeightIndicator: false,
    width: 750,
  });
  track.eachLayer((layer) => {
    elevation.addData(layer.feature);
  });
  return elevation;
}

function addElevationControl(map, elevation) {
  const browserTouchBefore = Browser.touch;
  Browser.touch = false;
  map.addControl(elevation);
  Browser.touch = browserTouchBefore;
}

export function addTrack(map, layerControl, track) {
  map.addLayer(track);
  map.fitBounds(track.getBounds());
  layerControl.addOverlay(track, 'Track');
  const elevation = initElevationControl(track);
  addElevationControl(map, elevation);
}

export function setDefaultView(map) {
  map.setView(unproject(new Point(2600000, 1200000)), 16);
}
