<template>
 <div class= "data"><br><br>

	<div>{{variable}}</div>
 	<!--Mapa 
	 :recibirCoordenadas="recibirCoordenadas"
	  @verregistro="Prueba($event)"
	/-->
				
		
	<table class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Dispositivo</th>
			<th scope="col">Intensidad Golpe</th>
			<th scope="col">Fecha</th>
			<th scope="col">Botón</th>

		</thead>
		<!--buttonbutton v-on:click="verDato(23)" ></button-->
		<tbody>
			<tr v-for="dato in datos">
				<td>{{dato.IDdisp}}</td>
				<td>{{dato.intensidadGolpe}}</td>
				<td>{{dato.fechaRegis}}</td>
				<button class="btn btn-primary" type="button" @click="$emit('enviarcoord',[dato.latitud ,dato.longitud])">Ver en el mapa</button><br><br>
			</tr>
		</tbody>
	</table>
			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>
	import axios from 'axios';
	import Mapa from '@/components/Mapa.vue'
	//Variable bus datos
	import {bus} from "../main";

	export default {
		name: 'Datos',
	components: {
		Mapa
 	 },
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
				//Variables mapa

			};
		},
		props: {
			Regislong: Array,
			Regislat: Array,
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
			verDato: function (lati){
			//verDato: function (lati, long){
				bus.$emit=('plotRegistro',lati);
				//this.variable= " Latitud: " + lati.toString() + " Longitud: " + long.toString()
				//this.$emit('verDato',lati,long);//('metodo',variables)
				//Mapa.methods.centrarMapa(lati,long);
				//localStorage.latitudCasco="lati.toString()"
				//localStorage.longitudCasco=long.toString()
			},
			Prueba(dato){
				alert(dato);
			}
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>