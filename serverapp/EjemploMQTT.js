var express= require("express"),
	app=express();
	bodyParser = require("body-parser"),
	methodOverride = require("method-override");
	mongoose =  require("mongoose");

var cors = require("cors")
var https = require("https");
var http = require("http");

var mongoose = require("mongoose");
var connectionsstring = "mongodb+srv://enrike:Cajita123.@cluster0-jz0zs.mongodb.net/test?retryWrites=true&w=majority"
////////////////
var mqtt = require("mqtt")

var client = mqtt.connect("mqtt://ioticos.org",{
	clientId : "Casco",
	username: "NVgHV2YJyAdtZo8",
	password: "mzeMH901DQRjn9O",
	clean: true
});

var fabrica_topic = "5stzM7DxxnzJ7JO/fabrica/#";
var contador_topic = "5stzM7DxxnzJ7JO/fabrica/nodecontador";

client.on("connect",function(connack){
	console.log("Conectado a MQTT")
	console.log(connack)
	client.subscribe(fabrica_topic, function(err){
		if(!err){
			console.log("subscribed")
		}
		});
});
client.on("message",function(topic,message){
	console.log("topic")
	console.log(topic)
	console.log("mensaje: ")
	console.log(message)
	console.log(message.toString());
})

function intervalFunc(){
	if(client.connected == true){
		var op={
			retain: false,
			qos: 0
		};
		client.publish(contador_topic, "Test message node",op)
	}
}
setInterval(intervalFunc,1500);