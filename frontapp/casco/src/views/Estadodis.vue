<template>

  <div class="estadodisp">
     <div>
      <router-link to="/home"><button class="btn btn-secondary">Volver</button></router-link>
    </div>
  	<h1>Estado dispositivos</h1>

    	<table class="table table-dark">
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

				<td>20/05/20 17:29</td>		
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
import axios from 'axios';//axios para el token
export default {
  name: 'Estadodis',
  components: {
  	//Estado
  },
          created: function(){ //Negar si no tiene el token
            const headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            var data = {
                correo : ""
            }
            axios.post('http://localhost:3000/consultaToken',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }
            })
        },
}

</script>
<style>
    #nave {
      padding: 30px;
    }

    #nave a {
      font-weight: bold;
      color: #2c3e50;
    }

    #nave a.router-link-exact-active {
      color: #42b983;
    }
</style>