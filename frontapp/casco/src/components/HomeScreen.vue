<template>
 <div id= "homeScreen">
	<h1>MENU PRINCIPAL</h1><br><br>
	<button type="button" v-on:click="login()">Ubicación actual</button><br><br>
	<button type="button" v-on:click="login()">Registros ubicación</button><br><br>
	<button type="button" v-on:click="login()">Estado del dispositivo</button><br><br>
	<button type="button" v-on:click="goRegDisp()">Registrar dispositivo</button><br><br>
 </div>

</template>

<script>
	import axios from 'axios';
	export default {
		name: 'Registros',
		data(){
			return{
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
			axios.post('http://localhost:3000/consultaDatos').then(res =>{
				this.registros = res.data;
			})
		},
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