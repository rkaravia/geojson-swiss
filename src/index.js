import 'leaflet/dist/leaflet.css';
import 'leaflet.elevation/dist/Leaflet.Elevation-0.0.2.css';
import './style.css';

import * as lib from './lib';

const options = lib.getOptions();
const baseLayers = lib.getBaseLayers();
const defaultBaseLayer = baseLayers['Gray map'];
const map = lib.initMap(defaultBaseLayer);
const layerControl = lib.initLayerControl(baseLayers);
map.addControl(layerControl);
if (options.trackUrl) {
  lib.getTrack(options.trackUrl).then((track) => {
    lib.addTrack(map, layerControl, track);
  });
} else {
  lib.setDefaultView(map, defaultBaseLayer);
}
