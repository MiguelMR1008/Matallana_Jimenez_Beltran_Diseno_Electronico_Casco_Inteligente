<template>
  <div class="registroDisp">
    <div id="nave">
      <div>
        <div>
      <router-link to="/home"><button class="btn btn-secondary">Volver</button></router-link>
    </div>
    </div>
    </div>
    <h1>Registros ubicaciones</h1><br>
    <h2>{{variable2}}</h2><br><br>
    <!--RegistroDispositivo /-->

    <!--DatosScreen /-->
    <Mapa v-if="(rol==1 || rol==2) || (rol==3 && asociado==1)"></Mapa>
    <!--HelloWorld /-->
  </div>
</template>

<script>
// @ is an alias to /src
//import RegistroDispositivo from '@/components/RegistroDispositivo.vue'
import Mapa from '@/components/Mapa.vue'
import DatosScreen from '@/components/DatosScreen.vue'
import axios from 'axios';
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'RegistrarDisp',
  components: {
    //RegistroDispositivo
    Mapa,
    DatosScreen
    //HelloWorld
  },
  data(){
    return {
      variable2:null,
      rol:null,
      asociado: null
    }
  },
    created: function(){ 
            this.rol=localStorage.rolSession
            const headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
            var data = {
                telefono : localStorage.telefono,
                rol : localStorage.rolSession
            }
            axios.post('http://localhost:3000/verStreaming',data,{
                headers : headers
            })
            .then(res =>{
                if(res.data.codigo == 0){                                                   //no se pudo autenticar
                    this.$router.push("/")
                    localStorage.estadoSesion = "Usuario no autenticado. Inicie sesión";
                }else if(localStorage.rolSession==3){                                     //Se comprueba que el usuario de la sesion actual sea asociado(rol=3)    

                /*
                  Codigo==1 autenticado, sí es allegado, streaming activado
                  Codigo==2 autenticado, sí es allegado, streaming desactivado
                  Codigo==1 autenticado, no es allegado
                */         
                  if(res.data.codigo == 4){         
                    this.variable2=res.data.mensaje
                    this.asociado=0
                  }else{
                    this.variable2="Usted es allegado de "+res.data.nombreUsuario+" "+res.data.apellidoUsuario
                    this.asociado=1
                  }
                }                
            })
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