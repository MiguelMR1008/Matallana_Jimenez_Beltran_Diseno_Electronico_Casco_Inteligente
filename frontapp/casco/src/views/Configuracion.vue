<template>
  <div class="config">
    <div id="nave">
      <div>
      <router-link to="/home">Volver</router-link></div>
    </div>
    <h1>Configuración</h1>
    <Config />
    <RegistroDispositivo />
    <div>
      <h2>Tipo de usuario: Dueño casco</h2>
      <h5>Dispositivos asociados: Casco1 </h5>
      <h5>Allegados: Enrique, Jose, Vladimir </h5>
      <h5>Opciones:   </h5>
      <h5>Modificar allegados: </h5>
      <select name="Allegados">
      <option value="1">Enrique</option> 
      <option value="2">Jose</option> 
      <option value="3">Vladimir</option> 
      </select>&nbsp;    
      <button type="button" class="btn btn-info &emsp">Modificar </button > &nbsp;
      <button type="button" class="btn btn-danger">Eliminar</button>
      <form action="/action_page.php"><br>
  <label for="fname">Nombre nuevo allegado:</label>
  <input type="text" id="fname" name="fname"><br><br>
  <label for="lname">Correo usuario allegado:</label>
  <input type="text" id="lname" name="lname"><br><br>
  <button type="button" class="btn btn-primary">Guardar cambios</button>
</form>
      <h5>Activar streaming:   </h5>
      <select name="streaming">
      <option value="1">Activado</option> 
      <option value="2">Desactivado</option> 
      </select>
    </br> </br>
      <button type="button" class="btn btn-primary">Guardar cambios</button>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import RegistroDispositivo from '@/components/RegistroDispositivo.vue'
import Config from '@/components/Config.vue'

export default {
  name: 'Configuracion',
  components: {
    RegistroDispositivo,
    Config
  }
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