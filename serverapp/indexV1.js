var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override");
	mongoose = require("mongoose");

var cors = require('cors')
var https = require('https');
var http = require('http');

var mongoose = require('mongoose');
var connectionstring = 'mongodb+srv://miguel:casco2020@cluster0-las5s.mongodb.net/cascointeligentedb';

var router = express.Router();

router.use(function (req, res, next) {
	next();
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/', router);

/*router.route('/consulta').get(function (req, res){

	var payload = {
		"mensaje" : "OK"
	}
	res.send(payload)
});*/

router.route('/consulta').post(function (req, res){

	var datos = req.body

	var query={correo : datos.correo}
	regis.find(query,function(err,result){
		if(err){
			console.log('Error en la consulta')
			res.send('ERROR')
		}else{
			console.log('Consulta OK')
			res.send(result)
		}

	})
});

router.route('/registro').post(function (req, res){

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
		console.log(err)
		var payload = {
			"mensaje" : "ERROR"
		}
		res.send(payload)
	})
});

/*router.route('/registro').post(function (req, res){

	console.log(req.body)
	var payload = {
		"mensaje" : "OK"
	}
	res.send(payload)
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

var nameSchema=new mongoose.Schema({
		nombre: String,
		apellido: String,
		rol: Number,
		correo: String,
		clave: String,
		fechaRegis: String
	});

var regis = mongoose.model("Usuarios", nameSchema);

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