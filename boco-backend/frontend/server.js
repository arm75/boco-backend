var http = require("http");
var express = require("express");

var app = express();
var server = http.createServer(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + "/public"));

var controllers = require("./controllers");

controllers.init(app);

server.listen(3000);