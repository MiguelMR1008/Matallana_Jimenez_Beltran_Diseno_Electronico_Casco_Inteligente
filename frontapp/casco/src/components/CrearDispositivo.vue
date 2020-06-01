<template>

 <div id= "registroDisp">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Crear Dispositivo</h2>
    <div>{{variable}}</div>
    <button type="button" v-on:click="crear()">Crear dispositivo</button>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'RegistroDisp',
        data(){
            return{
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
            crear(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    req : " "
                }
                axios.post('http://localhost:3000/crearDispositivo', data,{
                    headers : headers
                })
                .then(res =>{
                    alert(res.data.mensaje)
                    this.variable=res.data.mensaje
                })
                /*const headers = {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'JWT fefege...'
                }
                //this.variable = headers;
                var data = {
                    'correo' : this.correo,
                    'clave' : this.clave
                }
                axios.post('http://localhost:3000/autenticar', data,{
                    headers : headers
                })
                .then(res =>{
                    this.token = res.data.token;
                    if(this.token != null)
                        this.$router.push("/about")
                    else
                        this.variable="El usuario o contraseña no son correctos"
                })*/
            }
        }
    }
</script>

<style>
    #registroDisp {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 