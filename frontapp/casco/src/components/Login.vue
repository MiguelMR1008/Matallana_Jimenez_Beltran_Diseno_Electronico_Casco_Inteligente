<template>
 <div id= "login">
    <h3>Inicio de Sesión</h3>
    <div>{{variable}}</div>
    <input type="text" v-model="correo" placeholder="Correo"><br>
    <input type="password" v-model="clave" placeholder="Contraseña" v-on:keyup.13="login()"><br><br>
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
                variable: localStorage.estadoSesion,
                correo: null,
                clave: null,
                token: null,
                data: null,
                headers: null,
            };
        },
        /*created: function(){
            axios.post('http://localhost:3000/consulta').then(res =>{
                this.users = res.data;
            })
        },*/
        methods:{
            login(){
                this.variable = "Iniciando sesión"
                this.headers = {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'JWT fefege...'
                }
                this.data = {
                    'correo' : this.correo,
                    'clave' : this.clave
                }
                axios.post('http://localhost:3000/autenticar', this.data,{
                    headers : this.headers
                })
                .then(res =>{
                    if(res.data.codigo == 0){
                        localStorage.tokenSession = res.data.token;
                        this.headers = {
                            'acces-token' : localStorage.tokenSession,
                            'Authorization' : 'JWT fefege...'
                        }
                        this.data = {
                            correo : ""
                        }
                        axios.post('http://localhost:3000/infoCliente',this.data,{
                            headers : this.headers
                        })
                        .then(res =>{
                            if(res.data.codigo != 0){
                                localStorage.estadoSesion = "";
                                localStorage.nombreUsuario = res.data.nombre;
                                localStorage.apellidoUsuario = res.data.apellido;
                                this.$router.push("/home")
                            }
                        })

                    }else{
                        localStorage.estadoSesion="El usuario o contraseña no son correctos"
                        this.variable=localStorage.estadoSesion
                    }
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