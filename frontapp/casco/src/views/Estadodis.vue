<template>

  <div class="estadodisp">
  	<h1>Estado dispositivos</h1>
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
				<td>Laura</td>
				<td>Andres</td>
				<td>Encendido 
				<img alt="Logo" src="../assets/encendido.png" width="30" height="30">
					92%
				<img alt="Logo" src="../assets/batfull.png" width="30" height="30">
				</td>	

				<td>20/05/20 17:29 (Hace 5 minutos)</td>		
			</tr>
			<tr >
				<td>fdsj932982j982f39</td>
				<td>Javier</td>
								<td>Apagado 
				<img alt="Logo" src="../assets/apagado.png" width="30" height="30">
					50%
				<img alt="Logo" src="../assets/batmed.png" width="30" height="30">
				</td>			
				<td>12/05/20 10:30</td>
			</tr>
			<tr >
				<td>MiCasco</td>
				<td>Marco</td>
				<td>Apagado 
				<img alt="Logo" src="../assets/apagado.png" width="30" height="30">
					8%
				<img alt="Logo" src="../assets/batbaj.png" width="30" height="30">
				</td>		
				<td>05/05/20 13:30</td>			
			</tr>						
		</tbody>
	</table>
  </div>
</template>

<script>
// @ is an alias to /src
//import Estado from '@/components/Estado.vue'

export default {
  name: 'Estadodis',
  components: {
  	//Estado
  }
}
</script>