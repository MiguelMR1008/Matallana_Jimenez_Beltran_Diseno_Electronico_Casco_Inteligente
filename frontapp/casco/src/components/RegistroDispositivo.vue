<template>

 <div id= "signup">
    <router-view/>
    <!--h3>Registro</h3-->
    <div>{{variable}}</div>
    <div>Nombre</div>
    <input type="text" v-model="nombreDisp"><br>
    <button type="button" v-on:click="registar()">Registrar dispositivo</button>
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
        /*created: function(){
            axios.post('http://localhost:3000/consulta').then(res =>{
                this.users = res.data;
            })
        },*/
        methods:{
            registrar(){
                const headers = {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    'nombreDisp' : this.nombreDisp,
                    'correoUsuario' : "matallana@mail.com"
                }
                axios.post('http://localhost:3000/registroDispositivo', data,{
                    headers : headers
                })
                .then(res =>{
                    //this.token = res.data.token;
                    if(res.data.codigo == 0)
                        this.variable=res.data.mensaje
                    else
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
            /*hola(){
                if(this.correo=="Miguel"&&this.clave=="Matallana")
                    this.variable = "Hola "+this.correo+" Crack";
                else
                    this.variable = this.correo+" es un marrano";
            }*/
        }
    }
</script>

<style>
    #signup {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 20px;
        padding: 20px;
    }
</style>