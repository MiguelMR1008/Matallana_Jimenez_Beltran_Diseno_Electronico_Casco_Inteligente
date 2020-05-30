<template>
  <div class="config">
    <div id="nave">
      <div>
        <div>
      <router-link to="/home"><button class="btn btn-secondary">Volver</button></router-link>
    </div>
    </div>
    </div>
    <h1>Configuración</h1>
    <Streaming v-if= "rol==1 || rol==2"></Streaming>
    <Config />
    <RegistroDispositivo />
    <RegistroAsociado v-if= "rol==1 || rol==2"></RegistroAsociado>
    <!--div>
      <h2>Tipo de usuario: </h2>
      <h2 v-if="tipousuario==1"> Administrador</h2>
      <h2 v-if="tipousuario==2"> Dueño casco</h2>
      <h2 v-if="tipousuario==3"> Usuario normal (Asociado)</h2>
      <h5>Dispositivos asociados: Casco1 </h5>
      <h5>Allegados: Enrique, Jose, Vladimir </h5>
      <h5>Opciones:   </h5>
      <h5>Modificar allegados: </h5>
      <select name="Allegados">
      <option value="1">Enrique</option> 
      <option value="2">Jose</option> 
      <option value="3">Vladimir</option> 
      </select>&nbsp;    
      <button type="button" class="btn btn-info &emsp" v-on:click="asignarModificar()">Modificar </button > &nbsp;<br>
      <input v-if="modificar==1" type="text"><br><br>
       <button v-if="modificar==1" type="button" class="btn btn-primary">Cambiar nombre</button>
      <button type="button" class="btn btn-danger" v-on:click="eliminarAsociado()">Eliminar</button>
      <form action="/action_page.php"><br>
  <label for="fname">Nombre nuevo allegado:</label>
  <input type="text" id="fname" name="fname"><br><br>
  <label for="lname">Telefono usuario allegado:</label>
  <input type="number" id="lname" name="lname"><br><br>
  <button type="button" class="btn btn-primary">Guardar cambios</button>
</form>
      <h5>Activar streaming:   </h5>
      <!--h5 v-if="streaming==1">Streaming activado</h5>
      <h5 v-if="streaming==0">Streaming desactivado</h5-->
      <!--div>{{variable}}</div>
      <select id="valoresStream">
      <option value=1> Activado </option> 
      <option value=0>Desactivado</option> 
      </select>
    </br> </br>
      <button type="button" class="btn btn-primary" v-on:click="asignarStream()">Guardar cambios</button>
    </div-->

  </div>
</template>

<script>
// @ is an alias to /src
import RegistroDispositivo from '@/components/RegistroDispositivo.vue'
import RegistroAsociado from '@/components/RegistroAsociado.vue'
import Config from '@/components/Config.vue'
import Streaming from '@/components/Streaming.vue'

export default {
  name: 'Configuracion',
  components: {
    RegistroDispositivo,
    Config,
    RegistroAsociado,
    Streaming
  },data(){
    return {
      rol:localStorage.rolSession,
      variable: null,
      streaming: 3, //1, activado, 2 desactivado
      //tipousuario:localStorage.rolSession, //3= Usuario normal(asociado),2=Dueño casco, 1=Admin
      modificar:1
      }
    },
    created: function(){
            this.rol=localStorage.rolSession
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
                }else{
                    if(localStorage.estadoStreaming==0)
                      this.variable="Streaming desactivado"
                    else
                      this.variable="Streaming activado"
                }
            })
    },
    methods:{
        asignarStream(){
            this.streaming=document.getElementById("valoresStream").value;
            const headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            var data = {
                streaming : this.streaming
            }
            axios.post('http://localhost:3000/streaming',data,{
                headers : headers
            })
            .then(res =>{
                this.variable=res.data.mensaje
            })
        },
        asignarModificar(){
            this.modificar = !this.modificar;
        },
        eliminarAsociado(){
          //Funcion eliminar asociado
        }
    }
}

</script>

<style>
    h5 {
    color:white;
  }
    label {
    color:white;
  }
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