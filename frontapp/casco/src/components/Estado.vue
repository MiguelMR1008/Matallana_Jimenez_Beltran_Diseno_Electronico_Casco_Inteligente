<template>
 <div><br><br>

 	<!--Mapa 
	 :recibirCoordenadas="recibirCoordenadas"
	  @verregistro="Prueba($event)"
	/-->					
	<table class="table table-dark">
		<thead>
			<th scope="col">Dispositivo</th>
			<th scope="col">Dueño dispositivo</th>
			<th scope="col">Estado</th>
			<th scope="col">Ultima conexión</th>
		</thead>
		<!--buttonbutton v-on:click="verDato(23)" ></button-->
		<tbody>
			<tr v-for="dato in datos">
				<td>{{dato.IDdisp}}</td>
				<td>{{nombreUsuario}}</td>

				<td>Encendido
				<img alt="Logo" src="../assets/encendido.png" width="30" height="30">
				{{dato.nivelBateria}}%
				<img v-if="dato.nivelBateria >= 70" alt="Logo" src="../assets/batfull.png" width="30" height="30">
				<img v-else-if="dato.nivelBateria >= 20" alt="Logo" src="../assets/batmed.png" width="30" height="30">
				<img v-else-if="dato.nivelBateria >= 0" alt="Logo" src="../assets/batbaj.png" width="30" height="30">
				</td>

				<td>{{dato.fechaRegis}}</td>
			</tr>
		</tbody>
	</table>
			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>

	//Variable bus datos

	import axios from 'axios';
	export default {
		name: 'Estado',
	 	data(){
			return{
				dispositivos: null,
				nombresdisp: [],
				datos: [],
				variable: null,
				variable2: null,
				variable3: null,
				correo: null,
				correoAsociado: null,
				nombreUsuario: null,
				data: null,
				headers: null,
				cont: 0,
				//Variables mapa
			};
		},
		created: function(){
			this.headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            //while(this.esperar==0){
	            if(localStorage.rolSession==3){
		            this.data = {
		            	telefono: localStorage.telefono
		            }
		            axios.post('http://localhost:3000/correoAsociado',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){			//si código es diferente a 0 quiere decir que token está activo

		            		this.correoAsociado=res.data.correoUsuario
		            		this.nombreUsuario=res.data.nombre
		            		//this.variable=this.correoAsociado
		            		this.data = {
						        correoUsuario : this.correoAsociado,
						        rol : localStorage.rolSession
						    }
		            		axios.post('http://localhost:3000/consultaDispositivos',this.data,{
				                headers : this.headers
				            }).then(res =>{
				            	if(res.data.codigo != 0){

				            		this.dispositivos = res.data
				            		var i
						            var j
				            		for( i=0; i < this.dispositivos.length; i++){
				            			this.cont=this.cont+1;
				            			this.data={
				            				IDdisp : this.dispositivos[i]._id
				            			}
				            			axios.post('http://localhost:3000/ultimoDato',this.data,{
							                headers : this.headers
							            }).then(res =>{
							            	if(res.data.codigo != 0)
							            		//this.datos.push(res.data)
							            		this.datos = this.datos.concat(res.data)
							            	
										})
				            		}
				            		for( i=0; i < this.dispositivos.length; i++ ){
						            	this.data={
						            		IDdisp : this.dispositivos[i]._id
						            	}
						            	axios.post('http://localhost:3000/nombreDispositivo',this.data,{
									        headers : this.headers
									    }).then(res =>{
									       	if(res.data.codigo != 0)
									        	this.nombresdisp = this.nombresdisp.concat(res.data.nombreDisp)
										})

						            }
						            /*
									 PENDIENTE ORDEN DE LOS CASCOS
						            */
						            setTimeout(() => {
						            	for( i=0; i < this.dispositivos.length; i++ ){
										//this.variable3="Tamaño datos "+this.datos.length
											for( j=0; j < this.datos.length; j++ ){
												if(this.datos[j].IDdisp==this.dispositivos[i]._id)
													this.datos[j].IDdisp=this.nombresdisp[i]
											}
										}
						            }, 500);

				            	}else{
				            		this.$router.push("/")
				      				localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
				            	}
							})
		            	}
					})
	        	}
	        	else{
	        		this.nombreUsuario=localStorage.nombreUsuario
	        		this.data = {
				        rol : localStorage.rolSession
				    }
	        		axios.post('http://localhost:3000/consultaDispositivos',this.data,{
		                headers : this.headers
		            }).then(res =>{
		            	if(res.data.codigo != 0){

		            		this.dispositivos = res.data
		            		var i
				            var j
		            		for( i=0; i < this.dispositivos.length; i++){
		            			this.cont=this.cont+1;
		            			this.data={
		            				IDdisp : this.dispositivos[i]._id
		            			}
		            			axios.post('http://localhost:3000/ultimoDato',this.data,{
					                headers : this.headers
					            }).then(res =>{
					            	if(res.data.codigo != 0)
					            		//this.datos.push(res.data)
					            		this.datos = this.datos.concat(res.data)
					            	
								})
		            		}
		            		for( i=0; i < this.dispositivos.length; i++ ){
				            	this.data={
				            		IDdisp : this.dispositivos[i]._id
				            	}
				            	axios.post('http://localhost:3000/nombreDispositivo',this.data,{
							        headers : this.headers
							    }).then(res =>{
							       	if(res.data.codigo != 0)
							        	this.nombresdisp = this.nombresdisp.concat(res.data.nombreDisp)
								})

				            }
				            /*
							 PENDIENTE ORDEN DE LOS CASCOS
				            */
				            setTimeout(() => {
				            	for( i=0; i < this.dispositivos.length; i++ ){
								//this.variable3="Tamaño datos "+this.datos.length
									for( j=0; j < this.datos.length; j++ ){
										if(this.datos[j].IDdisp==this.dispositivos[i]._id)
											this.datos[j].IDdisp=this.nombresdisp[i]
									}
								}
				            }, 500);

		            	}else{
		            		this.$router.push("/")
		      				localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
		            	}
					})
	        	}
		},		
		methods:{
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