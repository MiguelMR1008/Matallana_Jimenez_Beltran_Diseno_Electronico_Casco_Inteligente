<template>
  <div class="signup">
    <div id="nave">
      <div>¿Desea iniciar sesión? pulse el siguiente enlace. 
      <router-link to="/">Iniciar sesión</router-link></div>
    </div>
    <h1>Registro</h1>
    <Signup />
  </div>
</template>

<script>
// @ is an alias to /src
import Signup from '@/components/Signup.vue'

export default {
  name: 'Registrarse',
  components: {
    Signup
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