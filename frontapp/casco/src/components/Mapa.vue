<template>

  <div style="height: 500px; width: 100%">
    <div style="height: 200px overflow: auto;">
      <p>Coordenadas casco:  {{ Coordenadas1 }}</p>
      <p>Posicion centro: {{ currentCenter }} , el zoom es: {{ currentZoom }}</p>
      <button @click="centrarMapa2">
        Ubicacion1
      </button>
      <button v-on:click="centrarMapa">
        Ubicacion2
      </button> 
    </div>
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"

    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />

      <l-marker :lat-lng="CoordCasco">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            Tu ubicacion
          </div>
        </l-tooltip>
      </l-marker>

      <l-marker   :lat-lng="Coordenadas1" >
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            Ubicacion actual casco
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet"
var CoordLat = 4.665918;
var CoordLong = -74.059916;

var CascoLat = 4.782904;
var CascoLong= -74.044923;
export default {
  name: "Mapa",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  data() {
    return {
      zoom: 13,
      center: latLng(CoordLat , CoordLong),
      //CoordCasco: latLng(4.782904,   -74.044923),
      CoordCasco: latLng(CascoLat,CascoLong),
      Coordenadas1: latLng(CoordLat, CoordLong),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(CoordLat, CoordLong),
      currentZoom: 11.5,
      currentCenter: latLng(CoordLat, CoordLong),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },  
    centrarMapa2() {
      this.center = [CascoLat,CascoLong];
    },
    innerClick() {
      alert("Esta es la ubicacion actual");
    },
    centrarMapa: function() {
      CoordLat= CoordLat+0.001;
      this.center = [CoordLat,CoordLong];
      this.Coordenadas1 = [CoordLat,CoordLong]; //Tambien toca actualizar asi
    }
  }
};
</script>
