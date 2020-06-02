<template>
 <div class= "adminClientes"><br><br>
 	<h2>Dispositivos de la base de datos</h2><br>
 	<h2>Existen {{dispositivos.length}} dispositivos</h2><br>
	<h2>Dispositivos registrados: {{contDispRegis}} dispositivos</h2>
	<h2>Dispositivos sin registrar: {{contDispSinRegis}} dispositivos</h2><br>
	<button v-if="verTabla==0" type="button" class="btn btn-primary" v-on:click="estadoTabla()">Ver Dispositivos registrados</button>
	<button v-else type="button" class="btn btn-primary" v-on:click="estadoTabla()">Esconder Tabla</button>
	<br><br>
	<table v-if="verTabla==1" class="table table-dark">
		<thead class="thead-dark">
			<th scope="col">Serial dispositivo</th>
			<th scope="col">Nombre dispositivo</th>
			<th scope="col">Correo dueño del dispositivo</th>
		</thead>
		<tbody>
			<tr v-for="dispositivo in dispositivosRegis">
				<td>{{dispositivo._id}}</td>
				<td>{{dispositivo.nombreDisp}}</td>
				<td>{{dispositivo.correoUsuario}}</td>
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
		name: 'adminClientes',
		data(){
			return{
				dispositivos: null,
				dispositivosRegis: [],
				verTabla: 0,
				datos: [],
				contDispRegis: 0,
				contDispSinRegis: 0,
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
	        		axios.post('http://localhost:3000/adminVerDispositivos',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){
		            		this.dispositivos = res.data
		            		var i
		            		for( i=0; i < this.dispositivos.length; i++){
		            			if(this.dispositivos[i].correoUsuario==" ")
		            				this.contDispSinRegis++
		            			else{
		            				this.dispositivosRegis[this.contDispRegis]=this.dispositivos[i]
		            				this.contDispRegis++
		            			}
		            		}
		            	}else{
		            		this.$router.push("/")
      						localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
		            	}
					})
		},
		methods:{
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
    #adminClientes {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 