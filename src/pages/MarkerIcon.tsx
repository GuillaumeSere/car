import L from 'leaflet';
import Shadow from "leaflet/dist/images/marker-shadow.png";
import Icon from "leaflet/dist/images/marker-icon-2x.png";

const MarkerIcon = new L.Icon({
    iconUrl: Icon,
    shadowUrl: Shadow,
    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
});

export default MarkerIcon