<template>

 <div id= "stream">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Tipo de usuario: </h2>
      <h2 v-if="tipousuario==1"> Administrador</h2>
      <h2 v-if="tipousuario==2"> Dueño casco</h2>
      <h2 v-if="tipousuario==3"> Usuario normal (Asociado)</h2><br><br>
    <h2>Ajustes de streaming</h2>
    <div>{{variable}}</div>
    <!--div>Nombre</div>
    <input type="text" v-model="nombreDisp" v-on:keyup.13="registrar()"><br><br>
    <button type="button" v-on:click="registrar()">Registrar dispositivo</button-->
    <button type="button" v-on:click="activar()">Activar</button>
    <button type="button" v-on:click="desactivar()">Desactivar</button>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'stream',
        data(){
            return{
                tipousuario: localStorage.rolSession,
                variable: null,
                nombreDisp: null,
            };
        },
        created: function(){
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
                }
            })
        },
        /*created: function(){
            axios.post('http://localhost:3000/consulta').then(res =>{
                this.users = res.data;
            })
        },*/
        methods:{
            activar(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    streaming : 1
                }
                axios.post('http://localhost:3000/streaming',data,{
                    headers : headers
                })
                .then(res =>{
                    this.variable=res.data.mensaje
                })
            },
            desactivar(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    streaming : 0
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
    #stream {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 