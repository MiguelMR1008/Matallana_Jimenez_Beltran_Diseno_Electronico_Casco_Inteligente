<template>
  <div class="inicio">
  	<img src="@/assets/Slogan.png">
  	<br>
    <img alt="Logo" src="../assets/Imagen1.png">

    <Login />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'

export default {
  name: 'Inicio',
  components: {
    Login
  }
}
</script>
