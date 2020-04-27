<template>
  <div class="config">
    <div id="nave">
      <div>
      <router-link to="/home">Volver</router-link></div>
    </div>
    <h1>Configuración</h1>
    <Config />
    <RegistroDispositivo />
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