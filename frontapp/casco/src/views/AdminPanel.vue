<template>
  <div class="adminPanel">
    <div id="nave">
      <div>
        <div>
      <router-link to="/home"><button class="btn btn-secondary">Volver</button></router-link>
    </div>
    </div>
    </div>
    <h1>Admin Panel</h1>
    <AdminCrearDispositivo />
    <AdminUsuariosInfo />
    <AdminDispositivosInfo />
    <AdminAllegadosInfo />

  </div>
</template>

<script>
// @ is an alias to /src
import AdminUsuariosInfo from '@/components/AdminUsuariosInfo.vue'
import AdminDispositivosInfo from '@/components/AdminDispositivosInfo.vue'
import AdminCrearDispositivo from '@/components/AdminCrearDispositivo.vue'
import AdminAllegadosInfo from '@/components/AdminAllegadosInfo.vue'

export default {
  name: 'AdminPanel',
  components: {
    AdminUsuariosInfo,
    AdminAllegadosInfo,
    AdminDispositivosInfo,
    AdminCrearDispositivo
  },data(){
    return {
      rol:localStorage.rolSession,
      variable: null,
      streaming: 3 //1, activado, 2 desactivado
      //tipousuario:localStorage.rolSession, //3= Usuario normal(asociado),2=Dueño casco, 1=Admin
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