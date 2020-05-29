<template>

 <div id= "registroAso">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Registro asociado</h2>
    <div>{{variable}}</div>
    <div>Nombre del asociado</div>
    <input type="text" v-model="nombreAsociado" ><br><br>
    <div>Número de teléfono</div>
    <input type="text" v-model="telAsociado" v-on:keyup.13="registrar()"><br><br>
    <button type="button" v-on:click="registrar()">Registrar asociado</button>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'RegistroAso',
        data(){
            return{
                variable: null,
                nombreAsociado: null,
                telAsociado: null,
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
        methods:{
            registrar(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    'nombreAsociado' : this.nombreAsociado,
                    'telAsociado' : this.telAsociado

                }
                axios.post('http://localhost:3000/registroAsociado', data,{
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
    #registroAso {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 