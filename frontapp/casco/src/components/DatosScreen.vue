<template>
 <div class= "data"><br><br>

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
				            			axios.post('http://localhost:3000/consultaDatos',this.data,{
							                headers : this.headers
							            }).then(res =>{
							            	if(res.data.codigo != 0)
							            		//this.datos.push(res.data)
							            		this.datos = this.datos.concat(res.data)
							            	
										})
				            		}
				            		/*for( i=0; i < this.dispositivos.length; i++ ){
						            	this.data={
						            		IDdisp : this.dispositivos[i]._id
						            	}
						            	axios.post('http://localhost:3000/nombreDispositivo',this.data,{
									        headers : this.headers
									    }).then(res =>{
									       	if(res.data.codigo != 0)
									        	this.nombresdisp = this.nombresdisp.concat(res.data)
										})

						            }*/
						            /*
									 PENDIENTE ORDEN DE LOS CASCOS
						            */
						            setTimeout(() => {
						            	for( i=0; i < this.dispositivos.length; i++ ){
										//this.variable3="Tamaño datos "+this.datos.length
											for( j=0; j < this.datos.length; j++ ){
												if(this.datos[i].IDdisp==this.dispositivos[j]._id)
													this.datos[i].IDdisp=this.dispositivos[j].nombreDisp
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
		            			axios.post('http://localhost:3000/consultaDatos',this.data,{
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
		mounted(){
				var i
				var j
				//var cont  = 0
				//var cont2 = 0
				for( i=0; i < this.dispositivos.length; i++ ){
					//this.variable3="Tamaño datos "+this.datos.length
					for( j=0; j < this.datos.length; j++ ){
						if(this.datos[j].IDdisp==this.dispositivos[i]._id)
							this.datos[j].IDdisp=this.nombresdisp[i]
						//cont++
						//this.variable2="Contador dispositivos "+cont
					}
					//cont2++
					//this.variable3="Contador dispositivos "+cont2
				}
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