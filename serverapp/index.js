var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override");
	mongoose = require("mongoose");

var cors = require('cors')
var https = require('https');
var http = require('http');

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

//middleware
router.use(function (req, res, next) {
	const token = req.headers['acces-token'];
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
						"telAsociado" : req.body.telefono2,
						"rol" : req.body.rol
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
					codigo : 0
				});
			}else{
				res.json({ mensaje : "Usuario o contraseña incorrectos"})
			}
		}
	})
});

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
				"telAsociado": result.telAsociado,
				"rol": result.rol,
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
								console.log("Usuario eliminado")
								res.send({
									mensaje : "Usuario eliminado correctamente",
									codigo : 1
								})
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

app.post('/registroDispositivo',router, function (req, res){
	regis = mongoose.model("Dispositivo", esquemaDispositivo); 
	console.log(req.body)
	var datos
	var myData
	var query = {
		$and:[
		{ nombreDisp: req.body.nombreDisp},
		{ correoUsuario : req.decoded.correo}
		]
	}
	if((req.body.nombreDisp != "" && req.body.nombreDisp != null)){
		regis.findOne(query, function(err, result){
			if(err){
				console.log("Error en la consulta")
				res.send("Error")
			}else{
				console.log("Consulta OK")
				if(result){
					res.json({ 
						mensaje : "El dispositivo ya existe",
						codigo : 1
					})
				}else{
					datos = {
						"nombreDisp" : req.body.nombreDisp,
						"correoUsuario" : req.decoded.correo
					};
					myData= new regis(datos)
					insertarBD(myData)
					res.json({ 
						mensaje : "Registro exitoso",
						codigo : 0
					})
				}
			}
		})
	}
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

app.post('/ubicacionActual', function(req, res){
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
		rol: Number
});

var esquemaCliente=new mongoose.Schema({
		nombre: String,
		apellido: String,
		correo: String,
		telefono: String
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