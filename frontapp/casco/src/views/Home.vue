<template>
  <div class="home">
  	<a id="logout" v-on:click="cerrarSesion()">Cerrar sesión</a>
    <HomeScreen />
  </div>
</template>

<script>
// @ is an alias to /src
import HomeScreen from '@/components/HomeScreen.vue'

export default {
  name: 'Home',
  components: {
    HomeScreen
  },methods:{
  	cerrarSesion(){
  		localStorage.tokenSession=" "
  		this.$router.push("/")
  	}
  }
}
</script>