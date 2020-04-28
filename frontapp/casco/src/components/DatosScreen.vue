<template>
 <div class= "data"><br><br>
	<div>{{variable}}</div>
	<table class="table">
		<thead>
			<th scope="col">Dispositivo</th>
			<th scope="col">Intensidad Golpe</th>
			<th scope="col">Fecha</th>
			<th scope="col">Botón</th>
		</thead>
		<tbody>
			<tr v-for="dato in datos">
				<td>{{dato.IDdisp}}</td>
				<td>{{dato.intensidadGolpe}}</td>
				<td>{{dato.fechaRegis}}</td>
				<button type="button" v-on:click="verDato(dato.latitud,dato.longitud)">Ver en el mapa</button><br><br>
			</tr>
		</tbody>
	</table>
 </div>

</template>

<script>
	import axios from 'axios';
	import Mapa from '@/components/Mapa.vue'
	export default {
		name: 'Datos',
		data(){
			return{
				dispositivos: null,
				datos: [],
				variable: null,
				correo: null,
				clave: null,
				data: null,
				headers: null,
				cont: 0,
			};
		},
		created: function(){
			this.headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            this.data = {
            	request: " "
            }
            axios.post('http://localhost:3000/consultaDispositivos',this.data,{
                headers : this.headers
            }).then(res =>{
            	if(res.data.codigo != 0){

            		this.dispositivos = res.data



            		//this.variable = this.dispositivos.length
            		var i
            		for( i=0; i < this.dispositivos.length; i++){
            			this.cont=this.cont+1;
            			this.data={
            				IDdisp : this.dispositivos[i]._id
            			}
            			axios.post('http://localhost:3000/consultaDatos',this.data,{
			                headers : this.headers
			            }).then(res =>{
			            	if(res.data.codigo != 0)
			            		//this.datos.push(res.data)
			            		this.datos = this.datos.concat(res.data)
			            	
						})
            		}
            		
            	}else{
            		this.$router.push("/")
      				localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
            	}
			})
		},
		methods:{
			verDato: function (lati, long){

				this.variable= " Latitud: " + lati.toString() + " Longitud: " + long.toString()
				//Mapa.methods.centrarMapa(lati,long);
				//localStorage.latitudCasco="lati.toString()"
				//localStorage.longitudCasco=long.toString()
			}
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>