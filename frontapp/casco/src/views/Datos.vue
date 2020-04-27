<template>
  <div class="registroDisp">
    <div id="nave">
      <div>
      <router-link to="/home">Volver</router-link></div>
    </div>
    <h1>Registros ubicaciones</h1>
    <!--RegistroDispositivo /-->
    <DatosScreen />
    <!--HelloWorld /-->
  </div>
</template>

<script>
// @ is an alias to /src
//import RegistroDispositivo from '@/components/RegistroDispositivo.vue'
import DatosScreen from '@/components/DatosScreen.vue'
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'RegistrarDisp',
  components: {
    //RegistroDispositivo
    DatosScreen
    //HelloWorld
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