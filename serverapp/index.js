var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override");
	mongoose = require("mongoose");

var cors = require('cors')
var https = require('https');
var http = require('http');
//Escuchar puerto distinto webservices para socket io
var HTTP = require('http').Server(express)

var io = require('socket.io')(HTTP) //libreria http server express

var mongoose = require('mongoose');
var mqtt = require('mqtt');

crypto = require('crypto');

var connectionstring = 'mongodb+srv://miguel:casco2020@cluster0-las5s.mongodb.net/cascointeligentedb';

jwt = require('jsonwebtoken');

var router = express.Router();

const llave = 'millavesecreta'
const jwtExpiritySeconds = 1200//Tiempo expiracion token
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
//app.use('/', router);

var arreglo = []
var contador = 0;
var lati=4.691918;
var longi=-74.062958;
var fech = getDateTime();

///Inicio MQTT+Socketio

HTTP.listen(3001,()=>{
	console.log("Socket io escuchando")
});

var client = mqtt.connect("mqtt://ioticos.org", {
    clientID: "CascosBuddy",
    username: 'NVgHV2YJyAdtZo8',
    password: 'mzeMH901DQRjn9O',
    clean: true
})

var casco_topic = '5stzM7DxxnzJ7JO/cascoInteligente/datos'

client.on('connect', function(connack){
    console.log('Conectado a MQTT')
    console.log(connack)
 
    client.subscribe(casco_topic, function(err){
        if(!err){
            console.log('Subscribed')
        }
    })
})
 
client.on('error', function(err){
    console.log(err)
})

var dispo= "";//Para el room del socketio

var fech = getDateTime();
client.on('message', function(topic, message){
    console.log('topic')
    console.log(topic)
    console.log('mensaje: ')
    console.log(message.toString())
    if(topic == '5stzM7DxxnzJ7JO/cascoInteligente/datos'){
        var texto = message.toString()
        var payload_l = JSON.parse(texto) //JSON separado


        var datos = { //Registro accidente
            "IDdisp": payload_l.IDdisp,
            "intensidadGolpe": payload_l.intensidadGolpe,
            "latitud": payload_l.latitud,
            "longitud": payload_l.longitud,
            "nivelBateria": payload_l.nivelBateria,
            "fechaRegis": getDateTime()
        }
        var datos2 = { //Registro streaming
            "IDdisp": payload_l.IDdisp,
            "latitud": payload_l.latitud,
            "longitud": payload_l.longitud,
            "nivelBateria": payload_l.nivelBateria,
            "estadoDisp" : payload_l.estadoDisp,
            "accidente" : payload_l.accidente, //Para alerta front
            "fechaRegis": getDateTime()        
        }


        if(payload_l.accidente=="1"){ //Si hubo un accidente
            //Guardar en BD
            regis = mongoose.model("Registro", esquemaRegistro);
            myData= new regis(datos)
            insertarBD(myData)
        }
        //Siempre manda info x socketio
        io.emit(payload_l.IDdisp,datos2)
        console.log("Estes es el ID: "+payload_l.IDdisp)
        console.log(datos2)
        /*res.json({ 
            mensaje : "Registro exitoso",
            codigo : 0
        })*/
    }else{
        console.log(message.toString())
    }
})
///Fin MQTT+Socketio

//middleware
router.use(function (req, res, next) {
	const token = req.headers['acces-token']; //Prueba postman
	console.log(token)
	if(token){
		jwt.verify(token, llave, (err, decoded) => {
			if(err){
				return res.json({ 
					mensaje : 'Token invalido',
					codigo : 0
				});
			}else{
				req.decoded = decoded;
				next();
			}
		});
	}else {
		res.send({
			mensaje : 'Token no valido',
			codigo : 0
		});
	}
});



//***************************************************************
//***************************************************************
//***************************************************************

app.get('/', function(req, res){
	res.json({ message : 'entrada' });
});

app.post('/registroUsuario',function (req, res){
	regisUsuario = mongoose.model("Usuarios", esquemaUsuario);
	var datos
	var myData
	var query = {
		correo : req.body.correo
	}
	if((req.body.correo != "" && req.body.correo != null) && (req.body.clave != "" && req.body.clave != null)){
		regisUsuario.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.send("Error")
			}else{
				console.log("Consulta OK")
				if(result){
					res.json({ 
						mensaje : "El usuario ya existe",
						codigo : 1
					})
				}else{
					datos = {
						"correo" : req.body.correo,
						"clave" : crypto.createHash('md5').update(req.body.clave).digest("hex"),
						"telefono" : req.body.telefono,
						"fechaRegis" : getDateTime(),
						"rol" : req.body.rol,
						"streaming" : req.body.streaming
					};
					myData= new regisUsuario(datos)
					insertarBD(myData)
					regisUsuario = mongoose.model("Cliente", esquemaCliente);
					datos = {
						"nombre": req.body.nombre,
						"apellido": req.body.apellido,
						"correo": req.body.correo,
						"telefono": req.body.telefono
					};
					myData= new regisUsuario(datos)
					insertarBD(myData)
					res.json({ 
						mensaje : "Registro exitoso, inicie sesión",
						codigo : 0
					})
				}
			}
		})
	}	
});

app.post('/autenticar', (req, res) =>{
	regis = mongoose.model("Usuarios", esquemaUsuario);
	var datos = req.body
	//var query = { correo : datos.correo}
	var query = {
		$and:[
		{ correo: datos.correo},
		{ clave : crypto.createHash('md5').update(datos.clave).digest("hex")}
		]
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			if(result){
				const payload = {
					correo : result.correo
				};
				const token = jwt.sign(payload, llave, {
					algorithm : 'HS256',
					expiresIn : jwtExpiritySeconds
				});
				res.json({
					mensaje : 'Autenticación correcta',
					token : token,
					rol : result.rol,
					streaming: result.streaming,
					codigo : 0
				});
			}else{
				res.json({ mensaje : "Usuario o contraseña incorrectos"})
			}
		}
	})
});
//Prueba destruir token

app.post('/cambiarClave', router, function(req, res){
	regis = mongoose.model("Usuarios", esquemaUsuario);
	//var query = { correo: datos.correo }
	var datos = req.body
	var query = {
		correo: req.decoded.correo
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log(result._id)
			regis.collection.update(query,
			{
				"_id": result._id,
				"correo": result.correo,
				"clave": crypto.createHash('md5').update(datos.nuevaClave).digest("hex"),
				"telefono": result.telefono,
				"fechaRegis": result.fechaRegis,
				"rol": result.rol,
				"streaming": result.streaming,
			})
			res.send({
				mensaje: "Clave modificada exitosamente",
				codigo: 1
			})
		}
	})
});

app.post('/eliminarUsuario', router, (req, res) =>{
	regis = mongoose.model("Usuarios", esquemaUsuario);
	query = { correo : req.decoded.correo}
	console.log(req.decoded.correo)
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			if(result){
				regis.deleteOne(query, function(err, result){
					if(err){
						console.log("No se pudo eliminar usuario")
						res.send({
							mensaje : "Error. No se pudo eliminar el usuario",
							codigo : 2
						})
					}else{
						regis = mongoose.model("Cliente", esquemaCliente);
						regis.deleteOne(query, function(err, result){
							if(err){
								console.log("No se pudo eliminar el cliente")
							}else{
								query = { correoUsuario : req.decoded.correo}
								regis = mongoose.model("Dispositivo", esquemaDispositivo);
								regis.findOne(query, function(err, result){
									if(err){
										console.log("No se pudó eliminar el dispositivo")
										res.send("Error")
									}else{
										regis.collection.update(query,
										{
											"_id": result._id,
											"nombreDisp": " ",
											"correoUsuario": " "
										})
										console.log("Usuario eliminado")
										res.send({
											mensaje : "Usuario eliminado correctamente",
											codigo : 1
										})
									}
								})
								
								/*regis.deleteOne(query, function(err, result){
									if(err){
										console.log("No se pudo eliminar el dispositivo")
									}else{
										regis = mongoose.model("Cliente", esquemaCliente);
										console.log("Usuario eliminado")
										res.send({
											mensaje : "Usuario eliminado correctamente",
											codigo : 1
										})
									}
								})*/
							}
						})
					}
				})
			}else{
				res.json({ 
					mensaje : "El usuario no existe"
				})
			}
		}
	})
});

/*app.post('/eliminarUsuario', (req, res) =>{
	regis = mongoose.model("Usuarios", esquemaUsuario);
	var datos = req.body
	console.log(req.body)
	//var query = { correo : datos.correo}
	var query = {
		$and:[
		{ correo: datos.correo},
		{ clave : crypto.createHash('md5').update(datos.clave).digest("hex")}
		]
	}
	var query2;
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			if(result){
				regis.deleteOne(query, function(err, result){
					if(err){
						console.log("No se pudo eliminar usuario")
						res.send({
							mensaje : "Error. No se pudo eliminar el usuario",
							codigo : 1
						})
					}else{
						regis = mongoose.model("Cliente", esquemaCliente);
						query2 = { correo : datos.correo}
						regis.deleteOne(query2, function(err, result){
							if(err){
								console.log("No se pudo eliminar el cliente")
							}else{
								console.log("Usuario eliminado")
								res.send({
									mensaje : "Usuario eliminado correctamente",
									codigo : 0
								})
							}
						})
						
					}
				})
			}else{
				res.json({ 
					mensaje : "Usuario o contraseña incorrectos"
				})
			}
		}
	})
});*/

//app.post('/consulta', router, function(req, res){
app.post('/consulta', function(req, res){
	regis = mongoose.model("Usuarios", esquemaUsuario);
	//var query = { correo: datos.correo }
	query = {

	}
	regis.find(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log(req.decoded)
			console.log("Consulta OK")
			res.send(result)
		}
	})
});

app.post('/infoCliente', router, function(req, res){
	console.log("Paso router")
	regis = mongoose.model("Cliente", esquemaCliente);
	//var query = { correo: datos.correo }
	query = { correo : req.decoded.correo}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log(req.decoded)
			console.log("Consulta OK")
			console.log(result)
			console.log(result)
			res.send(result)
		}
	})
});

app.post('/consultaDispositivos', router, function(req, res){
	var datos = req.body
	regis = mongoose.model("Dispositivo", esquemaDispositivo);
	//var query = { correo: datos.correo }
	console.log(req.body)
	if(req.body.rol==3){
		var query = {
			correoUsuario: req.body.correoUsuario
		}
	}
	else{
		var query = {
			correoUsuario: req.decoded.correo
		}
	}
	regis.find(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			res.send(result)
			console.log(result)
		}
	})
});

app.post('/consultaDatos', router, function(req, res){
	var datos = req.body
	regis = mongoose.model("Registro", esquemaRegistro);
	//var query = { correo: datos.correo }
	var query = {
		IDdisp: datos.IDdisp
	}
	regis.find(query).sort({"fechaRegis": -1}).exec(function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			res.send(result)
			console.log(result)
		}
	})
});

app.post('/consultaDatos2', router, function(req, res){
	var datos = req.body
	console.log(datos)
	var nombredispositivo
	regis = mongoose.model("Dispositivo", esquemaDispositivo);
	//var query = { correo: datos.correo }
	var query = {
		_id: datos.IDdisp
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			nombredispositivo=result.nombreDisp
			console.log(nombredispositivo)
			query = {
				IDdisp: datos.IDdisp
			}
			regis = mongoose.model("Registro", esquemaRegistro);
			regis.find(query, function(err, result){
				if(err){
					console.log("Error en la consulta")
					res.send("Error")
				}else{
					console.log("Consulta OK")
					res.json({
						IDdisp : result.IDdisp,
						intensidadGolpe : result.intensidadGolpe,
						latitud : result.latitud,
						longitud : result.longitud,
						nivelBateria : result.nivelBateria,
						nombreDisp : nombredispositivo
					})
				}
			})

		}
	})
});

app.post('/registroDispositivo',router, function (req, res){
	regis = mongoose.model("Dispositivo", esquemaDispositivo); 
	console.log(req.body)
	var datos
	var query = {
		_id: req.body.serialDisp
	}
	if((req.body.nombreDisp != "" && req.body.nombreDisp != null)){
		regis.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.json({ 
					mensaje : "El serial no es valido",
					codigo : 4
				})
			}else{
				console.log("Consulta OK")
				if(result){
					if(result.correoUsuario==""){		
						query = {
							correoUsuario: ""
						}
						regis.collection.update(query,				//No se puede hacer el query en update utilizando la variable _id porque es de tipo ObjectID y paila
						{
							//"_id": result._id,
							"nombreDisp" : req.body.nombreDisp,
							"correoUsuario" : req.decoded.correo
						})
						console.log("Pasó cambio")
						regis = mongoose.model("Usuarios", esquemaUsuario);
						var query = {
						 	correo: req.decoded.correo
						}
						regis.findOne(query, function(err, result){
							if(err){
								console.log("Error en la consulta")
							}else{
								console.log("Consulta OK")
								if(result){
									if(result.rol == 3){
										regis.collection.update(query,
										{
											"_id": result._id,
											"correo": result.correo,
											"clave": result.clave,
											"telefono": result.telefono,
											"fechaRegis": result.fechaRegis,
											"rol": 2,
											"streaming": result.streaming,
										})
										res.json({ 
											mensaje : "Registro exitoso y ahora es usuario tipo 2",
											codigo : 2
										})
									}else{
										res.json({ 
											mensaje : "Registro exitoso",
											codigo : 1
										})
									}
								}
							}
						})
					}else{
						res.json({ 
							mensaje : "El dispositivo ya se encuentra registrado",
							codigo : 3
						})
					}
				}/*else{
					datos = {
						"nombreDisp" : req.body.nombreDisp,
						"correoUsuario" : req.decoded.correo
					};
					myData= new regis(datos)
					insertarBD(myData)

					regis = mongoose.model("Usuarios", esquemaUsuario);
					var query = {
					 	correo: req.decoded.correo
					}
					regis.findOne(query, function(err, result){
						if(err){
							console.log("Error en la consulta")
						}else{
							console.log("Consulta OK")
							if(result){
								if(result.rol == 3){
									regis.collection.update(query,
									{
										"_id": result._id,
										"correo": result.correo,
										"clave": result.clave,
										"telefono": result.telefono,
										"fechaRegis": result.fechaRegis,
										"rol": 2,
										"streaming": result.streaming,
									})
									res.json({ 
										mensaje : "Registro exitoso y ahora es usuario tipo 2",
										codigo : 0
									})
								}else{
									res.json({ 
										mensaje : "Registro exitoso",
										codigo : 0
									})
								}
							}
						}
					})


					
				}*/
			}
		})
	}
});

app.post('/registroAsociado',router, function (req, res){
	regis = mongoose.model("Asociado", esquemaAsociado); 
	console.log(req.body)
	var datos
	var myData
	var query = {
		$and:[
		{ telAsociado: req.body.telAsociado},
		{ correoUsuario : req.decoded.correo}
		]
	}
	if((req.body.telAsociado != "" && req.body.telAsociado != null)){
		regis.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.send("Error")
			}else{
				console.log("Consulta OK")
				if(result){
					res.json({ 
						mensaje : "El número de teléfono ingresado ya existe",
						codigo : 1
					})
				}else{
					regis = mongoose.model("Usuarios", esquemaUsuario); 
					var query = {
						telefono: req.body.telAsociado
					}
					regis.findOne(query, function(err, result){
						if(result){
							regis = mongoose.model("Asociado", esquemaAsociado); 
							datos = {
								"nombreAsociado" : req.body.nombreAsociado,
								"telAsociado" : req.body.telAsociado,
								"correoUsuario" : req.decoded.correo
							};
							myData= new regis(datos)
							insertarBD(myData)
							res.json({ 
								mensaje : "Registro de asociado exitoso",
								codigo : 2
							})
						}else{
							res.json({ 
								mensaje : "No existe un usuario asociado a este número de teléfono",
								codigo : 3
							})
						}
					})


					

				}
			}
		})
	}
});

app.post('/eliminarAllegado', router, (req, res) =>{
	regis = mongoose.model("Asociado", esquemaAsociado);
	console.log(req.body)
	query = { 
		$and:[
		{ telAsociado: req.body.telAsociado},
		{ correoUsuario : req.decoded.correo}
		]
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			if(result){
				regis.deleteOne(query, function(err, result){
					if(err){
						console.log("No se pudo eliminar usuario")
						res.send({
							mensaje : "Error. No se pudo eliminar el usuario",
							codigo : 2
						})
					}else{
						res.send({
							mensaje : "Se ha eliminado el usuario allegado",
							codigo : 3
						})
					}
				})
			}else{
				res.json({ 
					mensaje : "El usuario no es allegado"
				})
			}
		}
	})
});

app.post('/consultaAllegados', router, function(req, res){
	var datos = req.body
	regis = mongoose.model("Asociado", esquemaAsociado);
	var query = {
		correoUsuario: req.decoded.correo
	}
	regis.find(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			res.send(result)
			console.log(result)
		}
	})
});

app.post('/streaming', router, function(req, res){
	regis = mongoose.model("Usuarios", esquemaUsuario);
	var query = {
		correo: req.decoded.correo
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				
				if(req.body.streaming==0){
					regis.collection.update(query,
					{
						"_id": result._id,
						"correo": result.correo,
						"clave": result.clave,
						"telefono": result.telefono,
						"fechaRegis": result.fechaRegis,
						"rol": result.rol,
						"streaming": 0,
					})
					res.json({ 
					mensaje : "Streaming desactivado",
					codigo : 0
				})
				}else{
					regis.collection.update(query,
					{
						"_id": result._id,
						"correo": result.correo,
						"clave": result.clave,
						"telefono": result.telefono,
						"fechaRegis": result.fechaRegis,
						"rol": result.rol,
						"streaming": 1,
					})
					res.json({ 
						mensaje : "Streaming activado",
						codigo : 0
					})
				}
								
			}
		}
	})
});

app.post('/cambiarNomAllegado', router, function(req, res){
	regis = mongoose.model("Asociado", esquemaAsociado);
	var query = { 
		$and:[
		{ telAsociado: req.body.telAsociado},
		{ correoUsuario : req.decoded.correo}
		]
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				regis.collection.update(query,
					{
					"_id": result._id,
					"nombreAsociado": req.body.nuevoNombre,
					"telAsociado": result.telAsociado,
					"correoUsuario": result.correoUsuario,
				})
				res.json({ 
					mensaje : "Nombre modificado exitosamente",
					codigo : 1
				})
								
			}
		}
	})
});

app.post('/verStreaming', router, function(req, res){
	regis = mongoose.model("Asociado", esquemaAsociado);
	var stream
	var nombreUser
	var apellidoUser
	var query = {
		telAsociado: req.body.telefono
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				regis = mongoose.model("Usuarios", esquemaUsuario);
				var query = {
				 	correo: result.correoUsuario
				}
				regis.findOne(query, function(err, result){
					if(err){
						console.log("Error en la consulta")
					}else{
						console.log("Consulta OK")
						if(result){
							stream=result.streaming
							regis = mongoose.model("Cliente", esquemaCliente);
							query = { correo : result.correo}
							regis.findOne(query, function(err, result){
								if(err){
									console.log("Error en la consulta")
									res.send("Error")
								}else{
									console.log(result)
									nombreUser=result.nombre
									apellidoUser=result.apellido
									if(stream==1){
										res.json({ 
											mensaje : "Es asociado y el streaming está activado",
											nombreUsuario : nombreUser,
											apellidoUsuario : apellidoUser,
											correoUsuario: result.correo,
											codigo : 1
										})
									}else{
										res.json({ 
											mensaje : "Es asociado y el streaming está desactivado",
											nombreUsuario : nombreUser,
											apellidoUsuario : apellidoUser,
											correoUsuario: result.correo,
											codigo : 2
										})
									}
								}
							})
						}
					}
				})			
			}else{
				if(req.body.rol==3){
					res.json({ 
						mensaje : "Usted no está vinculado a ningún usuario",
						codigo : 4
					})
				}else{
					res.json({ 
						mensaje : "Correo encontrado",
						correoUsuario: req.decoded.correo,
						codigo : 3
					})
				}
			}
		}
	})
});

app.post('/correoAsociado', router, function(req, res){
	regis = mongoose.model("Asociado", esquemaAsociado);
	var stream
	var correoUser
	var query = {
		telAsociado: req.body.telefono
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				regis = mongoose.model("Cliente", esquemaCliente);
				correoUser=result.correoUsuario
				query = {
					correo: result.correoUsuario
				}
				regis.findOne(query, function(err, result){
					if(err){
						console.log("Error en la consulta")
					}else{
						if(result){
							res.json({ 
								mensaje : "Correo encontrado",
								correoUsuario : correoUser,
								nombre : result.nombre,
								codigo : 1
							})	
						}else{
							res.json({ 
								mensaje : "Usted no está vinculado a ningún usuario",
								codigo : 3
							})
						}
					}
				})	
			}else{
				res.json({ 
					mensaje : "No se encontró el correo",
					codigo : 2
				})
			}
		}
	})
});

app.post('/nombreDispositivo', router, function(req, res){
	regis = mongoose.model("Dispositivo", esquemaDispositivo);
	console.log(req.body)
	var query = {
		_id: req.body.IDdisp
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				res.json({ 
					mensaje : "Dispositivo encontrado",
					nombreDisp : result.nombreDisp,
					IDdisp : result._id,
					codigo : 1
				})	
			}else{
				res.json({ 
					mensaje : "No se encontro el dispositivo",
					codigo : 2
				})
			}
		}
	})
});

app.post('/registroDato', function(req, res){
	regis = mongoose.model("Registro", esquemaRegistro);
	var datos = {
		"IDdisp": req.body.IDdisp,
		"intensidadGolpe": req.body.intensidadGolpe,
		"latitud": req.body.latitud,
		"longitud": req.body.longitud,
		"nivelBateria": req.body.nivelBateria,
		"fechaRegis": getDateTime()
	}
	myData= new regis(datos)
	insertarBD(myData)
	res.json({ 
		mensaje : "Registro exitoso",
		codigo : 0
	})
});

app.post('/pruebaCrypto', function(req, res){
	var datos = req.body.nombre
	var palabra = "Miguel"
	//datos=crypto.createHash('md5').update(datos).digest("hex");
	palabra=crypto.createHash('md5').update(palabra).digest("hex");
	var payload = {
		"mensaje" : crypto.createHash('md5').update(datos).digest("hex")
	}
	res.send(payload)
	/*if(datos==palabra)
		res.send("Son iguales "+datos)
	else
		res.send("Error")*/
});
app.post('/consultaToken', router, function(req, res){
	console.log("Token activo")
	res.send({
		mensaje: "Token activo",
		codigo: 1
	})
});

app.post('/ultimoDato', function(req, res){
	regis = mongoose.model("Registro", esquemaRegistro);
	console.log(req.body)

	var query = {
		IDdisp: req.body.IDdisp
	}
	regis.findOne(query).sort({"fechaRegis": -1}).exec(function(err,result){
	  if (err) throw err;
	  res.json(result);
	});
});

//------WEB SERVICES DE ADMIN PANEL--------------------------
app.post('/adminCrearDispositivo', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Dispositivo", esquemaDispositivo);
		var datos = {
			"nombreDisp": " ",
			"correoUsuario": " ",
		}
		myData= new regis(datos)
		insertarBD(myData)
		res.json({
			mensaje : "Se creó un nuevo dispositivo",
			codigo : 1
		})
	}else{
		res.json({
			mensaje : "Acceso denegado",
			codigo : 2
		})
	}
});

app.post('/adminEliminarUsuario', router, (req, res) =>{
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
	regis = mongoose.model("Usuarios", esquemaUsuario);
	query = { correo : req.body.correoUsuario}
	console.log(req.decoded.correo)
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
			res.send("Error")
		}else{
			console.log("Consulta OK")
			if(result){
				regis.deleteOne(query, function(err, result){
					if(err){
						console.log("No se pudo eliminar el usuario")
						res.send({
							mensaje : "Error. No se pudo eliminar el usuario",
							codigo : 2
						})
					}else{
						regis = mongoose.model("Cliente", esquemaCliente);
						regis.deleteOne(query, function(err, result){
							if(err){
								console.log("No se pudo eliminar el cliente")
							}else{
								query = { correoUsuario : req.body.correoUsuario}
								regis = mongoose.model("Dispositivo", esquemaDispositivo);
								regis.findOne(query, function(err, result){
									if(err){
										console.log("No se pudó eliminar el dispositivo")
										res.send("Error")
									}else{
										if(result){
										regis.collection.update(query,
										{
											"_id": result._id,
											"nombreDisp": " ",
											"correoUsuario": " "
										})
										}
										console.log("Usuario eliminado")
										res.send({
											mensaje : "Usuario eliminado correctamente",
											codigo : 1
										})
									}
								})
								
								/*regis.deleteOne(query, function(err, result){
									if(err){
										console.log("No se pudo eliminar el dispositivo")
									}else{
										regis = mongoose.model("Cliente", esquemaCliente);
										console.log("Usuario eliminado")
										res.send({
											mensaje : "Usuario eliminado correctamente",
											codigo : 1
										})
									}
								})*/
							}
						})
					}
				})
			}else{
				res.json({ 
					mensaje : "El usuario no existe"
				})
			}
		}
	})
	}
});

app.post('/adminEliminarDispositivo', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Dispositivo", esquemaDispositivo);
		query = { _id : req.body.IDdisp}
		regis.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.send("Error")
			}else{
				if(result){
					regis.deleteOne(query, function(err, result){
						if(err){
							console.log("No se pudo eliminar el dispositivo")
						}else{
							if(result){
								console.log("Dispositivo eliminado")
								res.send({
									mensaje : "Dispositivo eliminado correctamente",
									codigo : 1
								})
							}
						}
					})
				}
			}
		});
	}
});

app.post('/adminEliminarAllegado', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Asociado", esquemaAsociado);
		query = {
			$and:[
			{nombreAsociado : req.body.nombreAllegado},
			{correoUsuario : req.body.correoUsuario}
			]
		}
		regis.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.send("Error")
			}else{
				if(result){
					regis.deleteOne(query, function(err, result){
						if(err){
							console.log("No se pudo eliminar el allegado")
						}else{
							if(result){
								console.log("Allegado eliminado")
								res.send({
									mensaje : "Allegado eliminado correctamente",
									codigo : 1
								})
							}
						}
					})
				}
			}
		});
	}
});

app.post('/adminVerUsuarios', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Usuarios", esquemaUsuario);
		regis.find().sort({"fechaRegis": 1}).exec(function(err,result){
		  if (err) throw err;
		  res.json(result);
		});
	}
});

app.post('/adminVerClientes', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Cliente", esquemaCliente);
		regis.find().sort({"fechaRegis": 1}).exec(function(err,result){
		  if (err) throw err;
		  res.json(result);
		});
	}
});

app.post('/adminVerDispositivos', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Dispositivo", esquemaDispositivo);
		regis.find().sort({"fechaRegis": 1}).exec(function(err,result){
		  if (err) throw err;
		  res.json(result);
		});
	}
});

app.post('/adminVerAllegados', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Asociado", esquemaAsociado);
		regis.find().sort({"fechaRegis": 1}).exec(function(err,result){
		  if (err) throw err;
		  res.json(result);
		});
	}
});
//-----------------------------------------------------------

//------------------------------ Version 1 ----------------------------------

/*router.route('/registro').post(function (req, res){

	//console.log(req.body)
	var datos= req.body
	datos.fechaRegis = getDateTime()
	var myData= new regis(datos)

	myData.save().then(item =>{
		console.log("Guardado en BD")
		var payload = {
			"mensaje" : "OK"
		}
		res.send(payload)
	})
	.catch(err => {
		console.log("No pudo ser guardado en BD")
		var payload = {
			"mensaje" : "ERROR"
		}
		res.send(payload)
	})
});*/


var httpServer = http.createServer(app).listen(3000, function () {
	console.log(getDateTime() + "listen port "+ 3000)
});

var connectedtodb = false;

mongoose.connect(connectionstring,{ useNewUrlParser: true }, function(err, res){
	if(err){
		console.log('ERROR: connection to database. ' + err);
	}else{
		console.log('Connected to Atlas')
		connectedtodb = true;
	}
});

var esquemaUsuario=new mongoose.Schema({
		correo: String,
		clave: String,
		telefono: String,
		fechaRegis: String,
		telAsociado: String,
		rol: Number,
		streaming: Number
});

var esquemaCliente=new mongoose.Schema({
		nombre: String,
		apellido: String,
		correo: String,
		telefono: String
});

var esquemaAsociado=new mongoose.Schema({
		nombreAsociado: String,
		telAsociado: String,
		correoUsuario: String
});

var esquemaDispositivo=new mongoose.Schema({
		nombreDisp: String,
		correoUsuario: String
});

var esquemaRegistro=new mongoose.Schema({
		IDdisp: String,
		intensidadGolpe: Number,
		latitud: Number,
		longitud: Number,
		nivelBateria: Number,
		fechaRegis: String
});

var esquemaRol=new mongoose.Schema({
		permisos: Number,
		tipoUsuario: String
});

var regis, regisUsuario;

function insertarBD(mydata) {
	mydata.save().then(item =>{
		console.log("Guardado en BD")
		var payload = {
			"mensaje" : "OK"
		}
	})
	.catch(err => {
		console.log("No pudo ser guardado en BD")
		var payload = {
			"mensaje" : "ERROR"
		}
	})
}

function verificarAdmin(correoUsuario){
	if(correoUsuario=="jimenez@mail.com" || correoUsuario=="matallana@mail.com")
		return 1;
	else
		return 0;
}

app.post('/nombreDispositivo', router, function(req, res){
	regis = mongoose.model("Dispositivo", esquemaDispositivo);
	console.log(req.body)
	var query = {
		_id: req.body.IDdisp
	}
	regis.findOne(query, function(err, result){
		if(err){
			console.log("Error en la consulta")
		}else{
			console.log("Consulta OK")
			if(result){
				res.json({ 
					mensaje : "Dispositivo encontrado",
					nombreDisp : result.nombreDisp,
					codigo : 1
				})	
			}else{
				res.json({ 
					mensaje : "No se encontro el dispositivo",
					codigo : 2
				})
			}
		}
	})
});

function getDateTime() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
}