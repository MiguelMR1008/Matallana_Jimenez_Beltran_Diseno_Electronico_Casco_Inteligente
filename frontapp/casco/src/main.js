import Vue from 'vue'
import App from './App.vue'
import router from './router'
//Para el mapa sdf
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { Icon } from 'leaflet'
delete Icon.Default.prototype._getIconUrl;
//Vue.prototype.$bus= new Vue();
export const bus = new Vue();//Bus de eventos multiples objetos 
//Vue.prototype.$eventHub = new Vue(); // Global event bus

//////Fin bus
Vue.config.productionTip = false

Icon.Default.imagePath = '.';
Icon.Default.mergeOptions({ //imagenes traidas desde carpeta node_modules
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.component('v-map', LMap);
Vue.component('v-tilelayer', LTileLayer);
Vue.component('v-marker', LMarker);

new Vue({
  data: {
  	tokenSession: '',
  	estadoSesion: '',
  	nombreUsuario: '',
  	apellidoUsuario: '',
  	latitudCasco: 4.517388,
  	longitudCasco: -74.106131
  },
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
