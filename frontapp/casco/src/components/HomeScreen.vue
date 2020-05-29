<template>
 <div id= "homeScreen" >
 	<button type="button" class="btn btn-secondary" v-on:click="goDeslog() ">Cerrar sesion</button><br><br>
	<h1>MENU PRINCIPAL</h1><br>

    <h1>Bienvenido {{nombre}} {{apellido}}</h1><br>
    <h1>Rol {{rol}} Telefono {{telefono}}</h1><br>
	<button type="button" class="btn btn-primary" v-on:click="goMapa()">Ubicación actual</button><br><br>
	<button type="button" class="btn btn-info" v-on:click="goUbicaciones()">Registros ubicación</button><br><br>
	<button type="button" class="btn btn-info" v-on:click="goEstado()">Estado del dispositivo</button><br><br>
	<button type="button" class="btn btn-info" v-on:click="goConfig()">Configuración</button><br><br>
	<!--button type="button" v-on:click="goRegDisp()">Registrar dispositivo</button><br><br-->
 </div>

</template>

<script>
	import axios from 'axios';
	export default {
		name: 'Registros',
		data(){
			return{
				nombre: localStorage.nombreUsuario,
				apellido: localStorage.apellidoUsuario,
				telefono: localStorage.telefono,
				rol: localStorage.rolSession,
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
			const headers = {
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
            })
		},
		methods:{
			login(){
			},
			goMapa(){
				this.$router.push("/mapa")
			},
			goRegDisp(){
				this.$router.push("/config")
			},
			goUbicaciones(){
				this.$router.push("/data")
			},
			goConfig(){
				this.$router.push("/config")
			},
			goEstado(){
				this.$router.push("/estadodis")
			},
			goDeslog(){ //Provisional cerrar sesion
				localStorage.tokenSession="";//Borro el token
				this.$router.push("/")

			}
		},
	}
</script>

<style>
	h1 {
  color: white;
	}

	h3 {
		margin-bottom: 5%;
	}
body { 
  background-image: url('../assets/Fondo.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style> 