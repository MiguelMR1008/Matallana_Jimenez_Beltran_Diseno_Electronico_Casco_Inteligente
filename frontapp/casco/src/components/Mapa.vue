<template>

  <div style="height: 500px; width: 100%">
    <div style="height: 200px overflow: auto;">
    
      <p>Coordenadas casco:  {{ CoordCasco }}</p>
      <p>Posicion centro: {{ currentCenter }} , el zoom es: {{ currentZoom }}</p>
      <!--p v-if="!Number.isNaN(Distancia) ">Distancia aproximada:  {{ Distancia }} Km</p-->
      <!--p v-else>Menos de 700m</p-->

      <h2 v-if="Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111>=1"> Distancia: {{Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111}} Km</h2>
    <h2 v-else> Distancia: {{Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111*1000}} M </h2>    

      <!--h2>Diferencia long: {{Math.abs(caslongsum-milongsum)}}</h2-->
      <!--h2>Diferencia lat: {{Math.abs(caslatsum-milatsum)}}</h2-->
      <button class="btn btn-primary" @click="Miubicacion()">
        Mi ubicacion
      </button>
      <button class="btn btn-warning" v-on:click="centrarMapa()">
        Ubicacion Casco
      </button> 
      <!--button @click="$emit('enviarcoord','hola')">Pasar dato</button-->
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
      <l-control-scale position="bottomright" :imperial="false" :metric="true"></l-control-scale>
      <l-polygon :lat-lngs="polygon.latlngs" :color="polygon.color"></l-polygon>
      <l-marker :lat-lng="MisCoordenadas">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            Mi ubicacion
          </div>
        </l-tooltip>
      </l-marker>

      <l-marker   :lat-lng="CoordCasco">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            Ubicacion actual casco
          </div>
        </l-tooltip>
      </l-marker>
    </l-map>
    <DatosScreen

      @enviarcoord="RecibirCoord($event)"
    />
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip,LControlScale,LPolygon } from "vue2-leaflet"
import DatosScreen from '@/components/DatosScreen.vue'
var CoordLat = 4.665918; //Coordenadas iniciales por si falla la autoubicacion
var CoordLong = -74.059916;
var CascoLat =  4.691918;
var CascoLong= -74.062958;
export default {
  name: "Mapa",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LControlScale,
    LPolygon,
    DatosScreen
  },

  data() {
    return {
      variable2: "Inicio Hola",
      zoom: 13,
      center: latLng(CoordLat , CoordLong),
      //CoordCasco: latLng(4.782904,   -74.044923),
      caslatsum:CascoLat,
      caslongsum:CascoLong,
      milatsum:CoordLat,
      milongsum:CoordLong,
      CoordCasco: latLng(CascoLat,CascoLong),
      MisCoordenadas: latLng(CoordLat, CoordLong),
      //Distancia : Math.sqrt(Math.pow(Math.abs(CoordLat-CascoLat), 2)-Math.pow(Math.abs(CoordLong-//CascoLong), 2))*111.1,
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
      polygon: {
        latlngs: [[CoordLat, CoordLong], [CascoLat, CascoLong]],
        color: 'green'
      },
      showMap: true
    };
  },
  props: {    //Una prueba a ver si sirve
      recibirCoordenadas: "",
      prueba:"No"
  },

  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },  
    centrarMapa2() {//Centrar en mis coordenadas
      this.center = [CoordLat,CoordLong];
      this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];
    },
    innerClick() {
      alert("Esta es la ubicacion actual");
    },
    centrarMapa() {//Centrar casco

      //CascoLat= CascoLat+0.001;
      this.variable2="Entró"
 
      this.center = [CascoLat,CascoLong]; //Primero long, luego lat
      this.MisCoordenadas = [CoordLat,CoordLong]; //Tambien toca actualizar asi
      this.CoordCasco = [CascoLat,CascoLong];//Actualizo marcador coordenadas casco
      this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Por algun motivo se invirtieron
   //   this.Distancia = Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111;//Recalculo variable distancia
    },
    Miubicacion() {//Ubicacion pariente casco


        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getPosition);
        }
        function getPosition(position) {
          CoordLat = position.coords.latitude;          
          CoordLong = position.coords.longitude;          
          
        }
        this.milatsum=CoordLat;
        this.milongsum=CoordLong;
        this.center = [CoordLat,CoordLong];//La centro actualizando esta variable        
        this.MisCoordenadas = [CoordLat,CoordLong]; //Actualizo coordenadas marcador
        this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Por algun motivo se invirtieron
        //Aproximacion euclidea sin tomar curvatura tierra
        //this.Distancia = Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111;//Recalculo variable distancia
    },
    RecibirCoord(vari){ //Coordenada que llega desde hijo tabla
     this.variable2="Entró"
        
       // vari[1];//Longitud
      //this.CascoLat=lati;
      CascoLat=vari[0];//Latitud
      CascoLong=vari[1];//Longitud
      this.caslatsum=CascoLat;
      this.caslongsum=CascoLong;
      this.center = [CascoLat,CascoLong];
      this.MisCoordenadas = [CoordLat,CoordLong]; //Tambien toca actualizar asi
      this.CoordCasco = [CascoLat,CascoLong];//Actualizo marcador coordenadas casco
      this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Actualizar linea
      //Aproximacion euclidea sin tomar curvatura tierra
      this.Distancia = Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111;//Recalculo variable distancia        
    }

  },//FIn metodos
  created(){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getPosition);
        }
        function getPosition(position) {
          this.CoordLat = position.coords.latitude;
          this.CoordLong = position.coords.longitude;          
        }

      
  },

};
</script>
