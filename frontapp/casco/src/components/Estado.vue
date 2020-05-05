<template>
 <div><br><br>

	<div>Bienvenido a Estados</div>
 	<!--Mapa 
	 :recibirCoordenadas="recibirCoordenadas"
	  @verregistro="Prueba($event)"
	/-->						
	<table class="table">
		<thead>
			<th scope="col">Dispositivo</th>
			<th scope="col">Dueño dispositivo</th>
			<th scope="col">Estado</th>
			<th scope="col">Ultima conexión</th>
		</thead>
		<!--buttonbutton v-on:click="verDato(23)" ></button-->
		<tbody>
			<tr >
				<td>{{Hola}}</td>
				<td>{{Hola2}}</td>
				<td>{{Hola3}}</td>			
			</tr>
		</tbody>
	</table>
			
			<!--button @click="$emit('verregistro','hola')">Pasar dato</button-->
 </div>

</template>

<script>

	//Variable bus datos


	export default {
		name: 'Estado',
	components: {
		
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