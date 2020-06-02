<template>
 <div class= "adminUsuarios"><br><br>
 	<h2>Usuarios de la Base de Datos</h2>
	<h2>Rol 1: {{variable}} usuarios, Rol 2: {{variable2}} usuarios, Rol 3: {{variable3}} usuarios</h2><br>
	<button v-if="verTabla==0" type="button" class="btn btn-primary" v-on:click="estadoTabla()">Ver Tabla</button>
	<button v-else type="button" class="btn btn-primary" v-on:click="estadoTabla()">Esconder Tabla</button>
	<br><br>
	<table v-if="verTabla==1" class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Nombre</th>
			<th scope="col">Apellido</th>
			<th scope="col">Correo</th>
			<th scope="col">Teléfono</th>
			<th scope="col">Fecha de registro</th>
			<th scope="col">Tipo de usuario</th>
		</thead>
		<tbody>
			<tr v-for="usuario in usuarios">
				<td>{{usuario.nombre}}</td>
				<td>{{usuario.apellido}}</td>
				<td>{{usuario.correo}}</td>
				<td>{{usuario.telefono}}</td>
				<td>{{usuario.fechaRegis}}</td>
				<td v-if="usuario.rol==1">Administrador</td>
				<td v-else-if="usuario.rol==2">Dueño casco</td>
				<td v-else>Allegado</td>
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

	export default {
		name: 'adminUsuarios',
		data(){
			return{
				usuarios: null,
				clientes: null,
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
	        		axios.post('http://localhost:3000/adminVerUsuarios',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){
		            		this.usuarios = res.data
		            		axios.post('http://localhost:3000/adminVerClientes',this.data,{
				                headers : this.headers
				            }).then(res =>{
				            	if(res.data.codigo != 0){
				            		this.clientes = res.data
				            		var i
				            		for(i=0; i < this.usuarios.length; i++){
				            			if(this.usuarios[i].rol==1)
				            				this.contRol1++
				            			else if(this.usuarios[i].rol==2)
				            				this.contRol2++
				            			else
				            				this.contRol3++
				            		}
				            		this.variable=this.contRol1
				            		this.variable2=this.contRol2
				            		this.variable3=this.contRol3
				            		for(i=0; i < this.usuarios.length; i++){
				            			this.usuarios[i].nombre=this.clientes[i].nombre
				            			this.usuarios[i].apellido=this.clientes[i].apellido
				            		}
				            	}
							})
		            	}else{
		            		this.$router.push("/")
      						localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
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
    #adminUsuarios {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 