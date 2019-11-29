let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    MongoClient = require("mongodb").MongoClient,
    MongoObjectID = require("mongodb").ObjectID,
    WebSocketServer = require('websocket').server,
    http = require('http'),
    dataBase
;

//Mongo Configuration

MongoClient.connect("mongodb://localhost/sie", {useNewUrlParser: true})
    .then((db) => {                                                     
        console.log("connected to database 'SIE'");                    
        dataBase = db.db("sie").collection("files");                    
        app.emit('ready');})                                            
    .catch((err) => console.log(err)); 

//Express configuration

app.on('ready', function() {                                   
    app.use(bodyParser.json({ type: 'application/json' }));
    // CRUD
    app.post('/api/sie', function (req, res) {    
        dataBase.insertOne(req.body);                          
    });
    app.get('/api/sie/:id', function (req, res) {
	dataBase.find({ _id: new MongoObjectID(req.params.id) })
	.toArray(function(err, results) {
	    res.send(results);  
        });
    });
    app.get('/api/files', function (req, res) {                
        dataBase.find({},{projection:{_id:1,name:1}})
	    .toArray(function(err, results) {
		res.send(results);  
            });
    });
    app.delete('/api/sie', function (req, res) {             
        dataBase.deleteOne({_id:new MongoObjectID(req.body["id"])});
    });
    // start server
    app.use(express.static('client'));                        
    app.listen(8081, function () {                            
        console.log('server online listening to port 8081');
    });
});

// websocket configuration

let server = http.createServer(function(request, response) {});
server.listen(1337, function() {
    console.log('websocket online listening on port 1337');
});

let clients = [];

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    let connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
	clients.forEach(client => client.sendUTF(message.utf8Data));
    });
    connection.on('close', function(connection) {
	console.log('user logged out');
    });
    clients.push(connection);
});
