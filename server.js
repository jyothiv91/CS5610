var express = require('express');
var mongojs = require('mongojs');
var app = express();
// serve static content (html, css, js) in the public directory
app.use(express.static(__dirname + '/public'));

// configure express to parse JSON in the body of an HTTP request
app.use(express.bodyParser());

var mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "searchandgo";
if(typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined") {
	mongodbConnectionString = "cs5610" //for local
}

var db = mongojs(mongodbConnectionString, ["comment"]);
var db1 = mongojs(mongodbConnectionString, ["serviceClients"]);

app.get('/env', function(req, res){
	res.json(process.env);

});

app.get('/getAllComments', function(req, res){
	db.comment.find(function(err, data){
		res.json(data);
		});
});


app.get('/getCommentsById/:id', function(req, res){
	var id = req.params.id;
	db.comment.findOne({
	    _id:mongojs.ObjectId(id)
	}, function(err, doc) {
	    res.json(doc);
	});


});

app.get('/removeCommentById/:id', function(req, res){
	db.comment.remove({
	    _id:mongojs.ObjectId(req.params.id)
	}, function(err, doc) {
	    res.json(doc);
	});

});

app.get('/removeCommentByName/:lastName', function(req, res){
	db.comment.remove({
	    last :req.params.lastName
	}, false, function(err, doc) {
	    res.json(doc);
	});

});


app.get('/updateComment/:id', function(req, res){

	console.log(req.query);
	var cbody = req.query.cbody;

	db.comment.findAndModify({
	    query: { _id:mongojs.ObjectId(req.params.id) },
	    update: { $set: { cbody:cbody } },
	    new: true
	}, function(err, doc, lastErrorObject) {
	     //res.json(doc);
	     db.comment.find(function(err, data){
		 		res.json(data);
		});


	});
});

app.get('/createComment', function(req, res){

	console.log(req.query);
	var comment = {
		cname: req.query.cname,
		chead: req.query.chead,
		cbody: req.query.cbody
	};

	db.comment.insert(comment, function(err, data){
		console.log(err);
		console.log(data);
		res.json(data);
		});
});


//second experiment
app.get("/serviceClients", function (req, res) {
	db1.serviceClients.find(function (err, docs) {
		res.json(docs);
	});
});

// to insert new comment body into database
app.post("/serviceClients", function (req, res) {
	// the serviceClient is in the body of the HTTP request
	var svc = req.body;

	// insert new serviceClient object into the database collection serviceClients
	db1.serviceClients.insert(req.body, function (err, doc) {
		// respond with the new object that has been inserted
		res.json(doc);
	});
});

// to select single comment in order to update it
app.get("/serviceClients/:id", function (req, res) {
	// parse id from the path parameter
	var id = req.params.id;
	// select the single document from the database
	db1.serviceClients.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
		// respond with the document retrieved from the database
		res.json(doc);
	});
});

// handle HTTP PUT request to update comment
app.put("/serviceClients/:id", function (req, res) {
	db1.serviceClients.findAndModify({
		// find the object by id
		query: { _id: mongojs.ObjectId(req.params.id) },
		// new values are in req.body, update it's name
		update: { $set: { name: req.body.name } },
		// single one
		new: true
	}, function(err, doc, lastErrorObject) {
		// respond with the new document
		res.json(doc);
	});
});

// to delete a comment with id passed as a parameter
app.delete("/serviceClients/:id", function (req, res) {
	// parse id from the path parameter
	var id = req.params.id;
	// find the document by id and remove it
	db1.serviceClients.remove({ _id: mongojs.ObjectId(id) },
		function (err, doc) {
			// respond with number of documents affected
			res.json(doc);
		});
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP|| "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ipaddress);