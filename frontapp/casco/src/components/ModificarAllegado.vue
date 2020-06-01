<template>
 <div class= "modAllegado"><br><br>
 	<h2>Modificar allegado</h2>
	<div>{{variable}}</div><br>
	<!--div>{{esperar}}</div>
	<h2>{{variable2}}</h2><br>
	<h2>{{variable3}}</h2><br>
	<button class="btn btn-primary" type="button" @click="boton()">Ver nombre</button><br><br-->
 	<!--Mapa 
	 :recibirCoordenadas="recibirCoordenadas"
	  @verregistro="Prueba($event)"


	  style="width:30%"
	/-->
				
		
	<table class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Nombre allegado</th>
			<th scope="col">Teléfono allegado</th>
			<th scope="col"> </th>
			<th scope="col"> </th>
		</thead>
		<!--buttonbutton v-on:click="verDato(23)" ></button-->
		<tbody>
			<tr v-for="allegado in allegados">
				<td>{{allegado.nombreAsociado}}</td>
				<td>{{allegado.telAsociado}}</td>
				<td>
				<button class="btn btn-primary" type="button" @click="modificarBoton(allegado.telAsociado)">Modificar</button>
				</td>
				<td>
				<button class="btn btn-danger" type="button" @click="eliminarAllegado(allegado.telAsociado)">Eliminar</button>
				</td>
			</tr>
		</tbody>
	</table>
	<h2 v-if="ventanaMod==1">Modificar nombre del usuario del teléfono: {{telefonoMod}}</h2>>
	<input v-if="ventanaMod==1" type="text" class="form-control" v-model="nombreMod" placeholder="Nuevo nombre"><br>
	<button v-if="ventanaMod==1" type="button" class="btn btn-primary" v-on:click="modificarNombre()">Guardar cambios</button>

			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>
	import axios from 'axios';
	import {bus} from "../main";

	export default {
		name: 'ModAllegado',
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
				nombreMod: null,
				telefonoMod: null,
				ventanaMod: 0,
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
		        	if(res.data.codigo==3)
		        		window.location.reload()
		        })
			},
			modificarNombre(){
				this.headers = {
	                'acces-token' : localStorage.tokenSession,
	                'Authorization' : 'JWT fefege...'
	            }
	            this.data = {
				    telAsociado : this.telefonoMod,
				    nuevoNombre : this.nombreMod
				}
				axios.post('http://localhost:3000/cambiarNomAllegado',this.data,{
		            headers : this.headers
		        }).then(res =>{
		        	this.variable=res.data.mensaje
		        	//alert(res.data.mensaje)
		        	if(res.data.codigo==1)
		        		setTimeout(() => {
                            window.location.reload()
                        }, 5000);
		        })
			},
			modificarBoton(tel){
				this.telefonoMod=tel
				this.ventanaMod=1
			}
		}
	}
</script>

<style>
    #modAllegado {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
    table.center {
	  margin-left: auto;
	  margin-right: auto;
	}
</style> 