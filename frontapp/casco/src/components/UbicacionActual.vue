<template>
 <div id= "homeScreen">
	<h1>MENU PRINCIPAL</h1><br>

    <h1>Bienvenido {{nombre}} {{apellido}}</h1><br>
 </div>

</template>

<script>
	import axios from 'axios';
	export default {
		name: 'Registros',
		data(){
			return{
				nombre: null,
				apellido: null,
				registros: null,
				variable: null,
				IDdisp: null,
				intensidadGolpe: null,
				latitud: null,
				longitud: null,
				nivelBateria: null,
				fechaRegis: null,
				token: localStorage.tokenSession,
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
            axios.post('http://localhost:3000/infoCliente',data,{
                headers : headers
            })
            .then(res =>{
            	if(res.data.codigo == 0){
            		this.$router.push("/")
      				localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
            	}else{
            		localStorage.estadoSesion = "";
	                this.nombre = res.data.nombre;
	                this.apellido = res.data.apellido;
            	}
            })
		},
		/*function(){
			axios.post('http://localhost:3000/consultaDatos').then(res =>{
				this.registros = res.data;
			})
		},*/
		methods:{
			login(){
			},
			goRegDisp(){
				this.$router.push("/regdisp")
			}
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>