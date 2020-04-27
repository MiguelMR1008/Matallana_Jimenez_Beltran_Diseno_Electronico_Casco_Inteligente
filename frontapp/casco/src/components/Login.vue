<template>
 <div id= "login">
    <h3>Inicio de Sesión</h3>
    <div>{{variable}}</div>
    <input type="text" v-model="correo" placeholder="Correo"><br>
    <input type="password" v-model="clave" placeholder="Contraseña"><br><br>
    <button type="button" v-on:click="login()">Iniciar sesión</button>
    <button type="button" v-on:click="registro()">Registrarse</button>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'LoginScreen',
        data(){
            return{
                variable: null,
                correo: null,
                clave: null,
                token: null,
            };
        },
        /*created: function(){
            axios.post('http://localhost:3000/consulta').then(res =>{
                this.users = res.data;
            })
        },*/
        methods:{
            login(){
                const headers = {
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
                    if(res.data.codigo == 0)
                        this.$router.push("/home")
                    else
                        this.variable="El usuario o contraseña no son correctos"
                })
            },registro(){
                this.$router.push("/signup")
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
    #login {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 20px;
        padding: 20px;
    }
</style>