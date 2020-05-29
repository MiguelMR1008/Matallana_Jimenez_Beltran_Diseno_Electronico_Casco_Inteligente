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
    <Config />
    <RegistroDispositivo />
    <RegistroAsociado />
    <div>
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
      <h5 v-if="streaming==1">Streaming activado</h5>
      <h5 v-if="streaming==0">Streaming desactivado</h5>
      <select id="valoresStream">
      <option value=1> Activado </option> 
      <option value=0>Desactivado</option> 
      </select>
    </br> </br>
      <button type="button" class="btn btn-primary" v-on:click="asignarStream()">Guardar cambios</button>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import RegistroDispositivo from '@/components/RegistroDispositivo.vue'
import RegistroAsociado from '@/components/RegistroAsociado.vue'
import Config from '@/components/Config.vue'

export default {
  name: 'Configuracion',
  components: {
    RegistroDispositivo,
    Config,
    RegistroAsociado
  },data(){
    return {
      streaming: 1, //1, activado, 2 desactivado
      tipousuario:localStorage.rolSession, //3= Usuario normal(asociado),2=Dueño casco, 1=Admin
      modificar:1
      }
    },
    methods:{
        asignarStream(){
            this.streaming=document.getElementById("valoresStream").value;
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