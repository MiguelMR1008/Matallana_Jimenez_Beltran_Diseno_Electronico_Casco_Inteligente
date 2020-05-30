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
				<td>Casco 1</td>
				<td>Álvaro</td>
				<td>Encendido 
				<img alt="Logo" src="../assets/encendido.png" width="30" height="30">
					80%
				<img alt="Logo" src="../assets/batfull.png" width="30" height="30">
				</td>	

				<td>29/05/20 09:03</td>		
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