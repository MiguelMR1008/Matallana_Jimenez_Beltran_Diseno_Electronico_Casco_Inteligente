<template>
 <div id= "registroScreen">
	<h3>Users:</h3>
	<input v-model="correo">
	<input v-model="clave">
	<div>{{variable}}</div>
	<table class="table">
		<thead>
			<th scope="col">id</th>
			<th scope="col">IDdisp</th>
			<th scope="col">intensidadGolpe</th>
			<th scope="col">latitud</th>
			<th scope="col">longitud</th>
			<th scope="col">nivelBateria</th>
			<th scope="col">fechaRegis</th>
		</thead>
		<tbody>
			<tr v-for="registro in registros" v-bind:key="registro._id">
				<th scope="row">{{registro._id}}</th>
				<td>{{registro.IDdisp}}</td>
				<td>{{registro.intensidadGolpe}}</td>
				<td>{{registro.latitud}}</td>
				<td>{{registro.longitud}}</td>
				<td>{{registro.nivelBateria}}</td>
				<td>{{registro.fechaRegis}}</td>
			</tr>
		</tbody>
	</table>
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
				const headers = {
					'Content-Type' : 'application/json',
					'Authorization' : 'JWT fefege...'
				}
				var data = {
					'correo' : correo,
					'clave' : clave
				}
				axios.post('http://localhost:3000/autenticar', data,{
					headers : headers
				})
				.then(res =>{
					this.variable = res;
				})
			}
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>