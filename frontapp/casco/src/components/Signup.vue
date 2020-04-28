<template>

 <div id= "signup">
    <router-view/>
    <!--h3>Registro</h3-->
    <div>{{variable}}</div>
    <div>Nombre</div>
    <input type="text" v-model="nombre"><br>
    <div>Apellido</div>
    <input type="text" v-model="apellido"><br>
    <div>Número de teléfono</div>
    <input type="text" v-model="telefono"><br>
    <div>Correo electrónico</div>
    <input type="text" v-model="correo"><br>
    <div>Contraseña</div>
    <input type="password" v-model="clave"><br>
    <div>Número de teléfono asociado</div>
    <input type="text" v-model="telefono2"><br><br>
    <button type="button" v-on:click="signup()">Registrarse</button>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'LoginScreen',
        data(){
            return{
                variable: null,
                nombre: null,
                apellido: null,
                telefono: null,
                correo: null,
                clave: null,
                telefono2: null,
                rol: null,
            };
        },
        /*created: function(){
            axios.post('http://localhost:3000/consulta').then(res =>{
                this.users = res.data;
            })
        },*/
        methods:{
            signup(){
                const headers = {
                    'Content-Type' : 'application/json',
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    'nombre' : this.nombre,
                    'apellido' : this.apellido,
                    'telefono' : this.telefono,
                    'correo' : this.correo,
                    'clave' : this.clave,
                    'telefono2' : this.telefono2,
                    'rol' : 2
                }
                axios.post('http://localhost:3000/registroUsuario', data,{
                    headers : headers
                })
                .then(res =>{
                    //this.token = res.data.token;
                    if(res.data.codigo == 0){
                        this.variable=res.data.mensaje
                        localStorage.estadoSesion = ""
                    }
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
    #signup {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 20px;
        padding: 20px;
    }
</style>