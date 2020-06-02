<template>

 <div id= "registroDisp">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Registro Dispositivo</h2>
    <div>{{variable}}</div>
    <div>Nombre</div>
    <input type="text" v-model="nombreDisp" v-on:keyup.13="registrar()"><br><br>
    <div>Serial dispositivo</div>
    <input type="text" v-model="serialDisp" v-on:keyup.13="registrar()"><br><br>
    <button type="button" v-on:click="registrar()">Registrar dispositivo</button>
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
                serialDisp: null,
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
            registrar(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    nombreDisp : this.nombreDisp,
                    serialDisp : this.serialDisp
                }
                axios.post('http://localhost:3000/registroDispositivo', data,{
                    headers : headers
                })
                .then(res =>{
                    //this.token = res.data.token;
                    if(res.data.codigo == 2){
                        this.variable=res.data.mensaje
                        localStorage.rolSession=2
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000);
                    }else
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
    #registroDisp {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 