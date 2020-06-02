<template>
 <div class= "adminAllegados"><br><br>
 	<h2>Allegados de la Base de Datos</h2><br>
 	<h2>Existen {{allegados.length}} allegados asociados</h2><br>
	<button v-if="verTabla==0" type="button" class="btn btn-primary" v-on:click="estadoTabla()">Ver Tabla</button>
	<button v-else type="button" class="btn btn-primary" v-on:click="estadoTabla()">Esconder Tabla</button>
	<br><br>
	<table v-if="verTabla==1" class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Nombre asignado</th>
			<th scope="col">Teléfono allegado</th>
			<th scope="col">Correo dueño del casco</th>
			<th scope="col">Eliminar</th>
		</thead>
		<tbody>
			<tr v-for="allegado in allegados">
				<td>{{allegado.nombreAsociado}}</td>
				<td>{{allegado.telAsociado}}</td>
				<td>{{allegado.correoUsuario}}</td>
				<button class="btn btn-danger" type="button" @click="eliminarAllegado(allegado.correoUsuario,allegado.nombreAsociado)">Eliminar</button>
			</tr>
		</tbody>
	</table>
			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>
	import axios from 'axios';

	export default {
		name: 'adminAllegados',
		data(){
			return{
				allegados: null,
				nombresdisp: [],
				verTabla: 0,
				datos: [],
				contRol1: 0,
				contRol2: 0,
				contRol3: 0,
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
		created: function(){
			this.headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
	        		this.data = {
				        req : " "
				    }
	        		axios.post('http://localhost:3000/adminVerAllegados',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){
		            		this.allegados = res.data
		            	}else{
		            		this.$router.push("/")
      						localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
		            	}
					})
		},
		methods:{
			eliminarAllegado(correo, nombre){
				this.headers = {
	                'acces-token' : localStorage.tokenSession,
	                'Authorization' : 'JWT fefege...'
	            }
	            this.data = {
				    correoUsuario : correo,
				    nombreAllegado : nombre
				}
				axios.post('http://localhost:3000/adminEliminarAllegado',this.data,{
		            headers : this.headers
		        }).then(res =>{
		        	alert(res.data.mensaje)
		        	if(res.data.codigo==1)
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
                        }, 3000);
		        })
			},
			modificarBoton(tel){
				this.telefonoMod=tel
				this.ventanaMod=1
			},
			estadoTabla(){
				if(this.verTabla==0)
					this.verTabla=1
				else
					this.verTabla=0
			}
		}
	}
</script>

<style>
    #adminAllegados {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 