<template>

 <div id= "configScreen">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Cambiar contraseña</h2>
    <div>Nueva contraseña</div>
    <input :type="tipo" v-model="clave1" placeholder="Contraseña nueva"><br>
    <div>Repetir contraseña</div>
    <input :type="tipo" v-model="clave2" placeholder="Contraseña nueva"><br><br>
    <button type="button" v-on:click="mostrarContra()">{{textoBoton}}</button><br>
    <button type="button" v-on:click="cambiarClave()">Cambiar contraseña</button><br>
    <div>{{variable}}</div><br><br>
    <h2>Eliminar usuario</h2>
    <div>¿Desea eliminar su usuario?</div>
    <button type="button" v-on:click="eliminarUsuario()">Eliminar usuario</button>
    <div>{{variable2}}</div>
 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'Config',
        data(){
            return{
                variable: null,
                variable2: null,
                nombreDisp: null,
                clave1: null,
                clave2: null,
                tipo: "password",
                textoBoton: "Mostrar contraseña",
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
            mostrarContra(){
                if(this.tipo=='password'){
                    this.tipo = 'text'
                    this.textoBoton = "Esconder contraseña"
                }else{
                    this.tipo = 'password'
                    this.textoBoton = "Mostrar contraseña"
                }
            },
            cambiarClave(){
                if(this.clave1 == this.clave2){
                    const headers = {
                        'acces-token' : localStorage.tokenSession,
                        'Authorization' : 'JWT fefege...'
                    }
                    var data = {
                        nuevaClave : this.clave1
                    }
                    axios.post('http://localhost:3000/cambiarClave',data,{
                        headers : headers
                    })
                    .then(res =>{
                        if(res.data.codigo == 0){
                            this.variable = "Token expirado. Inicie sesión de nuevo"
                        }else{
                            this.variable = res.data.mensaje
                            localStorage.estadoSesion = " ";
                            localStorage.tokenSession = "";
                        }
                    })
                }else
                    this.variable = "Error. Las contraseñas no coinciden"
            },
            eliminarUsuario(){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    info : ""
                }
                axios.post('http://localhost:3000/eliminarUsuario',data,{
                    headers : headers
                })
                .then(res =>{
                    if(res.data.codigo == 0){
                        this.variable2 = "Token expirado. Inicie sesión de nuevo"
                    }else if(res.data.codigo == 2){
                        this.variable2 = res.data.mensaje
                    }else{
                        this.variable2 = res.data.mensaje
                        localStorage.estadoSesion = " ";
                        localStorage.tokenSession = "";
                    }
                })
            }
        }
    }
</script>

<style>
    #configScreen {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #FFFFFF;
        margin: auto;
        margin-top: 5px;
        padding: 20px;
    }
</style>