import 'leaflet/dist/leaflet.css';
import 'leaflet.elevation/dist/Leaflet.Elevation-0.0.2.css';
import './style.css';

import { getOptions, getBaseLayers, initMap, initLayerControl, getTrack, addTrack } from './lib';

const options = getOptions();
const baseLayers = getBaseLayers();
const defaultBaseLayer = baseLayers['Gray map'];
const map = initMap(defaultBaseLayer);
const layerControl = initLayerControl(baseLayers);
map.addControl(layerControl);
if (options.trackUrl) {
  getTrack(options.trackUrl).then((track) => {
    addTrack(map, layerControl, track);
  });
}
