<template>
 	<div id="mapid"></div>
</template>

<script>
	import axios from 'axios';
	export default {
		name: 'Map',
		data(){
			return{
				nombre: localStorage.nombreUsuario,
				apellido: localStorage.apellidoUsuario,
				registros: null,
				variable: null,
				IDdisp: null,
				intensidadGolpe: null,
				latitud: null,
				longitud: null,
				nivelBateria: null,
				fechaRegis: null,
			};
		},
		created: function(){
			src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
			   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
			   crossorigin=""
			var mymap = L.map('mapid').setView([51.505, -0.09], 13);
 		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		    maxZoom: 18,
		    id: 'mapbox/streets-v11',
		    tileSize: 512,
		    zoomOffset: -1,
		    accessToken: 'your.mapbox.access.token'
		}).addTo(mymap);
			/*var mymap = L.map('mapid').setView([51.505, -0.09], 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			L.marker([51.5, -0.09]).addTo(map)
			    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
			    .openPopup();
			/*const headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            var data = {
            	correo : ""
            }
            axios.post('http://localhost:3000/consultaToken',data,{
                headers : headers
            })
            .then(res =>{
            	if(res.data.codigo == 0){
            		this.$router.push("/")
      				localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
            	}
            })*/
		},
		methods:{
			login(){
			},
			goRegDisp(){
				this.$router.push("/config")
			},
			goUbicaciones(){
				this.$router.push("/data")
			},
			goConfig(){
				this.$router.push("/config")
			}
		},
	}
</script>

<style>
	#mapid { height: 180px; }
</style>