<template>
  <div class="hello">
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
    </p>
    <h3>Ingresar datos</h3>
    <input v-model="nombrePrue" v-on:keyup.13="addToken()">
    <div>
      <!--h1>{{token}}</h1-->
      <h1>{{token2}}</h1>
    </div>
    <button @click="addToken()">Save</button>
  </div>
</template>

<script>
  //import AppStore from "../store/AppStore" 
export default {
  name: 'HelloWorld',
  data(){
    return{
      nombrePrue: null,
      edadH: null,
      //token: AppStore.data.token,
      token2: null,
    };
  },
  mounted() {
    if(localStorage.tokenSession) this.token2 = localStorage.tokenSession;
    //if(localStorage.age) this.edadH = localStorage.age;
  },
  methods: {
    /*persist() {
      localStorage.name = this.nombrePrue;
      localStorage.age = this.edadH;
      console.log('now pretend I did more stuff...');
    },*/
    addToken(){
      localStorage.tokenSession = this.nombrePrue
      this.token2 = localStorage.tokenSession
      //AppStore.methods.addToken(this.nombrePrue)
      //this.token=AppStore.data.token
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
