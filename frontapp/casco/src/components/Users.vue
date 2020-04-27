<template>
 <div class= "container">
	<h3>Users:</h3>
	<input v-model="correo">
	<input v-model="clave">
	<div>{{variable}}</div>
	<table class="table">
		<thead>
			<th scope="col">id</th>
			<th scope="col">nombre</th>
			<th scope="col">apellido</th>
			<th scope="col">rol</th>
			<th scope="col">correo</th>
			<th scope="col">clave</th>
		</thead>
		<tbody>
			<tr v-for="user in users" v-bind:key="user._id">
				<th scope="row">{{user._id}}</th>
				<td>{{user.nombre}}</td>
				<td>{{user.apellido}}</td>
				<td>{{user.rol}}</td>
				<td>{{user.correo}}</td>
				<td>{{user.clave}}</td>
			</tr>
		</tbody>
	</table>
 </div>

</template>

<script>
	import axios from 'axios';
	export default {
		name: 'Users',
		data(){
			return{
				users: null,
				variable: null,
				correo: null,
				clave: null,
			};
		},
		created: function(){
			axios.post('http://localhost:3000/consulta').then(res =>{
				this.users = res.data;
			})
		},
		methods:{
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>