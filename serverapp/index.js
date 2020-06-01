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
///Inicio socket io
HTTP.listen(3001,()=>{
	console.log("Socket io escuchando")
});
var arreglo = []
var contador = 0;
var lati=4.691918;
var longi=-74.062958;
var fech = getDateTime();
////////variables socketio
io.on('connection',(socket)=>{
	console.log("Nuevo cliente")
	socket.emit('msg','hola desde node'+getDateTime())
	arreglo.push(socket);

	socket.on('incremento',(counter)=>{
		console.log('Msg from socket io incremento'+counter)

	})
	socket.on('decremento',(counter)=>{
		console.log('Msg from socket io decremento'+counter)
	})

	socket.on('disconnect',(reason)=>{
		var i = arreglo.indexOf(socket)
		if(i != -1){
			console.log('Socket desconectado')
			arreglo.splice(i,1)
		}
	})
})

////////////////INICIO MQTT
var mqtt = require("mqtt")

var client = mqtt.connect("mqtt://ioticos.org",{
	clientId : "Casco1",
	username: "QAU363T02xoXQBk", //Miguel
	password: "1EBGBSBG22Kip55", //Miguel
	//username: "NVgHV2YJyAdtZo8", //alvaro
	///password: "mzeMH901DQRjn9O", //alvaro
	clean: true
});

var fabrica_topic = "5stzM7DxxnzJ7JO/fabrica/coord";
//var contador_topic = "5stzM7DxxnzJ7JO/fabrica/nodecontador";

client.on("connect",function(connack){
	console.log("Conectado a MQTT")
	console.log(connack)
	client.subscribe(fabrica_topic, function(err){
		if(!err){
			console.log("subscribed")
		}
		});
});
client.on("message",function(topic,message){ //Escuchar ioticos
	console.log("topic")
	console.log(topic)
	console.log("mensaje: ")
	console.log(message)
	console.log(message.toString());
	//Enviar el mensaje al frontapp
	app.post('/mapa', function(req, res){//Enviar a la pestaña mapa


	/*if(datos==palabra)
		res.send("Son iguales "+datos)
	else
		res.send("Error")*/
});
})

function intervalFunc(){
	/*
	if(client.connected == true){
		var op={
			retain: false,
			qos: 0
		};
		client.publish(contador_topic, "Test message node",op)
	}
	*/
}
	var cascopayload = {
		"long" : "4",
		"lat=" : "74",
		"bateria": "85.6",
		"iddispo" : "7468243e",
		"fecha" :getDateTime()
	}
	//res.send(cascopayload)
var contador = 0;
var lati=4.691918;
var longi=-74.062958;
var lati2=6.2518400;
var longi2=-75.5635900;
var fech = getDateTime();

function envio_sio(){
//	if(flag==1){
			//JSON.stringify(cascopayload) para enviarlo asi
			//io.emit('msg2','cuenta: '+ contador++ +JSON.stringify(cascopayload) );
			contador++;
			if(contador>=5){
				//io.emit('alarma',1);
				contador=0;
			}
			if(lati>5.1){
				lati=4.5
			}
			if(lati2>7){
				lati2=6
			}
			lati=lati+0.002
			lati2=lati2+0.002
			fech = getDateTime()
			console.log(fech)
			var data ={
				'idDisp':"5e962540ef6a6459d46d128a",
				'sendlat':lati,
				'sendlong':longi,
				'fechita':fech,
				'accidente':0,
				'estadoDisp':1
			}
			io.emit('5e962540ef6a6459d46d128a',data)
			var data2 ={
				'idDisp':"5e9f6a4c1eb5f23a2c8861d6",
				'sendlat':lati2,
				'sendlong':longi2,
				'fechita':fech,
				'accidente':0,
				'estadoDisp':1
			}
			io.emit('5e9f6a4c1eb5f23a2c8861d6',data2)
			/*io.emit('sendlat',+lati)
			io.emit('fechita',''+ fech)
			io.emit('sendlong',+longi)*/
			
	//	}
}
////Fin io
setInterval(envio_sio,3000)
//setInterval(intervalFunc,7500);

////////////Fin MQTT
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
											"nombreDisp": "",
											"correoUsuario": ""
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
app.post('/crearDispositivo', router, function(req, res){
	var permiso = verificarAdmin(req.decoded.correo)
	if(permiso==1){
		regis = mongoose.model("Dispositivo", esquemaDispositivo);
		var datos = {
			"nombreDisp": "",
			"correoUsuario": "",
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