<template>
  <div class="registroData">
    <div id="nave">
      <div>
      <router-link to="/home">Volver</router-link></div>
    </div>
    <h1>Registro Dispositivo</h1>
    <RegistroDipositivo />
  </div>
</template>

<script>
// @ is an alias to /src
import RegistroDipositivo from '@/components/RegistroDispositivo.vue'

export default {
  name: 'RegistrarDisp',
  components: {
    RegistroDipositivo
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