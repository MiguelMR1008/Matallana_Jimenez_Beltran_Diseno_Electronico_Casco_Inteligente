<template>

  <div style="height: 500px; width: 100%">
    <div style="height: 200px overflow: auto;">
    
      <p v-if="streaming==1 && rol==1">Coordenadas casco:  {{ CoordCasco }}</p>
      <p v-if="streaming==1 && rol==1">Posicion centro: {{ currentCenter }} , el zoom es: {{ currentZoom }}</p><br>
      <!--p v-if="!Number.isNaN(Distancia) ">Distancia aproximada:  {{ Distancia }} Km</p-->
      <!--p v-else>Menos de 700m</p-->
      <h2>{{variable2}}</h2><br>
      <!--h2>{{topicIDDisp._id}}</h2><br-->
      <!--select name="disp" id="disps">
        <option disabled value="">Seleccione un elemento</option>
        <tr v-for="nombre in nombres">
            <option>{{nombre}}</option>
        </tr>
      </select><br><br-->
      <h2 v-if= "streaming==1">Dispositivos</h2>
      <select v-if= "streaming==1" v-model="topicIDDisp">
          <!--option disabled value="">Seleccione un elemento</option-->
          <option v-for="dispositivo in dispositivos" :value="dispositivo">{{dispositivo.nombreDisp}}</option>
      </select><br><br>
      <button v-if= "streaming==1" class="btn btn-primary" type="button" @click="seleccionar(topicIDDisp._id)">Seleccionar</button>
      <!--h2>{{testVal}}</h2><br-->
      <h2 v-if= "streaming==1 && Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111>=1"> Distancia: {{Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111}} Km</h2>
    <h2 v-else-if="streaming==1"> Distancia: {{Math.sqrt(Math.pow(Math.abs(caslongsum-milongsum),2)+Math.pow(Math.abs(caslatsum-milatsum),2))*111*1000}} M </h2>    
  <h2 v-if="streaming==1">Último registro: {{fecha}} </h2>
      <!--h2>Último registro: 20/04/20 15:30 (Hace 5 minutos)</h2-->
      <button v-if="streaming==1 && estado==1" type="button" class="btn btn-success">Estado: Encendido</button>
      <button v-else type="button" class="btn btn-danger">Estado: Apagado</button>
    </br></br>
      <button v-if="streaming==1 && streamingOff==0"type="button" class="btn btn-success">Streaming: Encendido</button>
      <button v-else type="button" class="btn btn-danger">Streaming: Apagado</button>
    </br></br>
      <button v-if= "streaming==1" @click="Miubicacion()">
        Mi ubicacion
      </button>
      <!--button @click="$emit('enviarcoord','hola')">Pasar dato</button-->
    </div>
    <l-map
    v-if="streaming==1"
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

  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip,LControlScale,LPolygon } from "vue2-leaflet"
import axios from 'axios';//axios para el token
import io from 'socket.io-client'
var CoordLat = 4.665918; //Coordenadas iniciales por si falla la autoubicacion
var CoordLong = -74.059916;
var CascoLat =  4.691918;
var CascoLong= -74.062958;
export default {
  name: "Mapa2",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LControlScale,
    LPolygon
  },
  data() {
    return {
      variable2: null,
      estado:1,
      payload: "Holaa",
      topicIDDisp: [],
      roomSocket: "nada",
      rol: localStorage.rolSession,
      streaming: localStorage.estadoStreaming,
      streamingOff: 0,
      dispositivos : null,
      nombres: [],
      cont: 0,
      correoAsociado: null,
      socket:{}, //Para manejar socketio
      alerta:0,
      contador: "",
      CoordLat: 4.665918, //Coordenadas iniciales por si falla la autoubicacion
      CoordLong: 4.665918,
      mensaje: "",
      zoom: 13,
      center: latLng(CoordLat , CoordLong),
      //CoordCasco: latLng(4.782904,   -74.044923),
      caslatsum:CascoLat,
      caslongsum:CascoLong,
      fecha:'29/05/20 09:00',
      milatsum:CoordLat,
      milongsum:CoordLong,
      CoordCasco: latLng(CascoLat,CascoLong),
      MisCoordenadas: latLng(CoordLat, CoordLong),
      Distancia : Math.sqrt(Math.pow(Math.abs(CoordLat-CascoLat), 2)-Math.pow(Math.abs(CoordLong-CascoLong), 2))*111.1,
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
  }, //FIn data
  props: {    //Una prueba a ver si sirve
      recibirCoordenadas: "",
      prueba:"No"
  },

  methods: {
        getPosition(position) {
          this.CoordLat = position.coords.latitude;
          this.CoordLong = position.coords.longitude;          
        },
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

      //  navigator.geolocation.getCurrentPosition(this.getPosition());
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
    },
    seleccionar(data){
        this.roomSocket=data
        //this.variable2=this.roomSocket
        this.socket.on(this.roomSocket,data=>{
        this.payload = data        //-------latitud y longitud---------
        if(localStorage.rolSession==3){
            const headers = {
              'acces-token' : localStorage.tokenSession,
              'Authorization' : 'JWT fefege...'
            }
            var data = {
              telefono : localStorage.telefono,
              rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else{
                    this.streaming=res.data.codigo
                }
            })
            //this.cont=0
        }
        //this.cont++
        //console.log('holalatitud')
        CascoLat=data.sendlat;
        CascoLong=data.sendlong;
        this.MisCoordenadas = [CoordLat,CoordLong]; //Tambien toca actualizar asi
        this.CoordCasco = [CascoLat,CascoLong];//Actualizo marcador coordenadas casco
        this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Por algun motivo se invirtieron
        this.center = [CascoLat,CascoLong]; //Primero long, luego lat
        //Actualizar ubicacion casco

        //-----------------------------------
        //----------fecha---------------
        this.fecha=data.fechita
        //-----------------------------------


        //this.variable2=this.payload
      })
    },
    comprobarStreaming(){
            const headers = {
              'acces-token' : localStorage.tokenSession,
              'Authorization' : 'JWT fefege...'
            }
            var data = {
              telefono : localStorage.telefono,
              rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else{
                    this.streaming=res.data.codigo
                }
                this.cont=0
            })

    }

  },//FIn metodos
  //created(){
    //Llenar coordenadas con posicion actual navegador
       // if (navigator.geolocation) {
          //navigator.geolocation.getCurrentPosition(this.getPosition);
          
        //}
  //},
        created: function(){ //Negar si no tiene el token
//          var socket = io.connect('http://localhost');
          //this.topicIDDisp._id="5e962540ef6a6459d46d128a"
          //this.variable2=this.topicIDDisp._id
          this.socket = io.connect("http://localhost:3001");
          //var socket = io.connect('http://localhost:3001');
          console.log('hola')
            const headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            var data = {
                telefono : localStorage.telefono,
                rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else if(localStorage.rolSession==3){                                     //Se comprueba que el usuario de la sesion actual sea asociado(rol=3)    

                /*
                  Codigo==1 autenticado, sí es allegado, streaming activado
                  Codigo==2 autenticado, sí es allegado, streaming desactivado
                  Codigo==1 autenticado, no es allegado
                */         
                  if(res.data.codigo == 4){         
                    this.variable2=res.data.mensaje
                  }else
                    this.variable2="Usted es allegado de "+res.data.nombreUsuario+" "+res.data.apellidoUsuario
                  this.streaming=res.data.codigo
                }else{
                  this.streaming=1
                  if(localStorage.estadoStreaming==1)
                    this.streamingOff=0
                  else
                    this.streamingOff=1
                }
                //Consulta dispositivos
                data = {
                    correoUsuario : res.data.correoUsuario,
                    rol : localStorage.rolSession
                }
                axios.post('http://localhost:3000/consultaDispositivos',data,{
                    headers : headers
                }).then(res =>{
                  if(res.data.codigo != 0){
                        this.dispositivos = res.data
                        /*var i
                        for( i=0; i < this.dispositivos.length; i++ ){
                          data={
                            IDdisp : this.dispositivos[i]._id
                          }
                          axios.post('http://localhost:3000/nombreDispositivo',data,{
                          headers : headers
                          }).then(res =>{
                              if(res.data.codigo != 0)
                                this.nombres = this.nombres.concat(res.data.nombreDisp)
                          })
                        }*/
                        /*setTimeout(() => {
                            this.variable2=this.nombresdisp[0] + "      " + this.nombresdisp[1]
                        }, 5000);*/
                        
                  }else{
                    this.$router.push("/")
                  localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                  }
                })
                
            })
        },
  mounted(){
    if(this.alerta==1){
      alert("Acaba de ocurrir un accidente, favor dirigirse hacia el historial");
      this.alerta=0;
    }
    
    var socket = io.connect('localhost:3001');
      socket.on("msg",data=>{ 
      console.log('holajson')
      console.log(data)

    })
    //this.socket.on("5e962540ef6a6459d46d128a",data=>{
      //if(this.topicIDDisp._id == null)
     
    //if(this.topicIDDisp._id == null){
      //this.cont++
      //this.variable2=this.cont
      this.socket.on(this.roomSocket,data=>{
        this.payload = data
        this.variable2="Pasó"
        //-------latitud y longitud---------
        console.log(data)
        //console.log('holalatitud')
        CascoLat=data.sendlat;
        CascoLong=data.sendlong;
        this.MisCoordenadas = [CoordLat,CoordLong]; //Tambien toca actualizar asi
        this.CoordCasco = [CascoLat,CascoLong];//Actualizo marcador coordenadas casco
        this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Por algun motivo se invirtieron
        this.center = [CascoLat,CascoLong]; //Primero long, luego lat
        //Actualizar ubicacion casco

        //-----------------------------------
        //----------fecha---------------
        this.fecha=data.fechita
        //-----------------------------------


        //this.variable2=this.payload
      })
    //}
    this.socket.on("msg2",data=>{
      console.log('holajson')
      console.log(data)
      //Actualizar ubicacion casco
      if(this.cont==2 && localStorage.rolSession==3){
            const headers = {
              'acces-token' : localStorage.tokenSession,
              'Authorization' : 'JWT fefege...'
            }
            var data = {
              telefono : localStorage.telefono,
              rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else{
                    this.streaming=res.data.codigo
                }
            })
            this.cont=0
      }
      this.cont++
    })
    this.socket.on("sendlat",data=>{
      console.log(data)
      console.log('holalatitud')
      CascoLat=data;
      this.MisCoordenadas = [CoordLat,CoordLong]; //Tambien toca actualizar asi
      this.CoordCasco = [CascoLat,CascoLong];//Actualizo marcador coordenadas casco
      this.polygon.latlngs = [[CoordLat, CoordLong], [CascoLat, CascoLong]];//Por algun motivo se invirtieron
      this.center = [CascoLat,CascoLong]; //Primero long, luego lat
      //Actualizar ubicacion casco
    })    

    this.socket.on("fechita",data=>{
      this.fecha=data;
      console.log(data)
     // fecha=data;
    })
    this.socket.on("alarma",data=>{
      this.alerta=data;
    })

  }/*, //Fin mounted
  methods:{
      comprobarStreaming(){
            const headers = {
              'acces-token' : localStorage.tokenSession,
              'Authorization' : 'JWT fefege...'
            }
            var data = {
              telefono : localStorage.telefono,
              rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else{
                    this.streaming=res.data.codigo
                }
            })

      }
  }*/

}; //Fin export default
</script>
<style>
  h2 {
    color:white;
  }
  p {
    color:white;
  }  
</style>