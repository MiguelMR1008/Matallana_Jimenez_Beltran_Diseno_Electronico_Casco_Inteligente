<template>

 <div id= "crearDisp">
    <router-view/>
    <!--h3>Registro</h3-->
    <h2>Crear Dispositivo</h2>
    <div>{{variable}}</div>
    <h2>
        <button class="btn btn-success" type="button" v-on:click="crear()">Crear dispositivo</button>
    </h2><br>
    <h2>Eliminar Dispositivo</h2>
    <div>{{variable2}}</div>
    <!--select v-model="topicIDDisp">
          <option disabled value="">Seleccione un elemento</option>
          <option v-for="dispositivo in dispositivos" :value="dispositivo">{{dispositivo.nombreDisp}}</option>
    </select><br><br-->
    <select v-model="idSeleccionado">
        <option disabled value="">Seleccione un serial</option>
        <option v-for="dispositivo in dispositivosSinRegis" :value="dispositivo">{{dispositivo._id}}</option>
    </select>
    <button class="btn btn-danger" type="button" v-on:click="eliminar(idSeleccionado._id)">Eliminar dispositivo</button><br>

 </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: 'crearDisp',
        data(){
            return{
                dispositivos: null,
                dispositivosSinRegis: [],
                idSeleccionado: [],
                variable: null,
                variable2: null,
                contDispSinRegis: 0,
                nombreDisp: null,
            };
        },
        created: function(){
            this.headers = {
                'acces-token' : localStorage.tokenSession,
                'Authorization' : 'JWT fefege...'
            }
                    this.data = {
                        req : " "
                    }
                    axios.post('http://localhost:3000/adminVerDispositivos',this.data,{
                        headers : this.headers
                    }).then(res =>{
                        if(res.data.codigo != 0){
                            this.dispositivos = res.data
                            var i
                            for( i=0; i < this.dispositivos.length; i++){
                                if(this.dispositivos[i].correoUsuario==" "){
                                    this.dispositivosSinRegis[this.contDispSinRegis]=this.dispositivos[i]
                                    this.contDispSinRegis++
                                }
                            }
                            this.variable2="Se encontraron "+this.contDispSinRegis+" dispositivos sin registrar"
                        }else{
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
                axios.post('http://localhost:3000/adminCrearDispositivo', data,{
                    headers : headers
                })
                .then(res =>{
                    this.variable=res.data.mensaje
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);
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
            },
            eliminar(idSelected){
                const headers = {
                    'acces-token' : localStorage.tokenSession,
                    'Authorization' : 'JWT fefege...'
                }
                var data = {
                    IDdisp : idSelected
                }
                axios.post('http://localhost:3000/adminEliminarDispositivo', data,{
                    headers : headers
                })
                .then(res =>{
                    this.variable2=res.data.mensaje
                    if(res.data.codigo==1){
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000);
                    }
                })
            }
        }
    }
</script>

<style>
    #crearDisp {
        width: 500px;
        border: 1px solid #CCCCCC;
        background-color: #008080;
        margin: auto;
        margin-top: 10px;
        padding: 20px;
    }
</style> 