<template>
 <div class= "modAllegado"><br><br>

	<div>{{variable}}</div><br>
	<!--div>{{esperar}}</div>
	<h2>{{variable2}}</h2><br>
	<h2>{{variable3}}</h2><br>
	<button class="btn btn-primary" type="button" @click="boton()">Ver nombre</button><br><br-->
 	<!--Mapa 
	 :recibirCoordenadas="recibirCoordenadas"
	  @verregistro="Prueba($event)"
	/-->
				
		
	<table class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Nombre allegado</th>
			<th scope="col">Teléfono allegado</th>
			<th scope="col"> </th>
		</thead>
		<!--buttonbutton v-on:click="verDato(23)" ></button-->
		<tbody>
			<tr v-for="allegado in allegados">
				<td>{{allegado.nombreAsociado}}</td>
				<td>{{allegado.telAsociado}}</td>
				<button class="btn btn-danger" type="button" @click="eliminarAllegado('allegado.telAsociado')">Eliminar</button><br><br>
			</tr>
		</tbody>
	</table>
			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>
	import axios from 'axios';
	import {bus} from "../main";

	export default {
		name: 'modAllegado',
		data(){
			return{
				allegados: null,
				nombresdisp: [],
				datos: [],
				variable: null,
				variable2: null,
				variable3: null,
				correo: null,
				correoAsociado: null,
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
				        rol : localStorage.rolSession
				    }
	        		axios.post('http://localhost:3000/consultaAllegados',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){
		            		this.allegados = res.data
		            	}
					})
		},
		methods:{
			eliminarAllegado(tel){
				this.headers = {
	                'acces-token' : localStorage.tokenSession,
	                'Authorization' : 'JWT fefege...'
	            }
	            this.data = {
				    telAsociado : tel
				}
				axios.post('http://localhost:3000/eliminarAllegado',this.data,{
		            headers : this.headers
		        }).then(res =>{
		        	alert(res.data.mensaje)
		        })
			},
			boton(){
				//this.variable2=this.nombresdisp.length
				//this.variable2=this.datos.length

				this.variable2=this.nombresdisp[0] + "       " + this.nombresdisp[1]
				this.variable3=this.dispositivos[0]._id + "      " + this.dispositivos[1]._id
				/*this.variable2="1"
				setTimeout(() => { console.log("World!"); }, 2000);
				this.variable2="2"*/
				var i
				var j
				var cont  = 0
				var cont2 = 0
				for( i=0; i < this.dispositivos.length; i++ ){
					//this.variable3="Tamaño datos "+this.datos.length
					for( j=0; j < this.datos.length; j++ ){
						if(this.datos[j].IDdisp==this.dispositivos[i]._id)
							this.datos[j].IDdisp=this.nombresdisp[i]
						cont++
						//this.variable2="Contador dispositivos "+cont
					}
					cont2++
					//this.variable3="Contador dispositivos "+cont2
				}
				/*for( i=0; i < this.dispositivos.length; i++ ){
				            	this.data={
				            		IDdisp : this.dispositivos[i]._id
				            	}
				            	axios.post('http://localhost:3000/nombreDispositivo',this.data,{
							        headers : this.headers
							    }).then(res =>{
							       	if(res.data.codigo != 0)
							        	this.nombresdisp[i] = res.data.nombreDisp
							        this.variable2=this.nombresdisp[i]
								})

				            }*/
			}
		}
	}
</script>

<style>
	h3 {
		margin-bottom: 5%;
	}
</style>