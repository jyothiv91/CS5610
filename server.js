var express = require('express');
var mongojs = require('mongojs');
var db = mongojs("cs5610", ["employees"]);
var app = express();

app.get('/', function(req, res){
  res.send('hello world!!!');
});

app.get('/env', function(req, res){
	res.json(process.env);

});

app.get('/someJson', function(req, res) {
	res.json({hello:"world"});
});


app.get('/getAllEmployees', function(req, res){
	db.employees.find(function(err, data){
		res.json(data);
		});

});


app.get('/getEmployeeById/:id', function(req, res){
	var id = req.params.id;
	//console.log('getEmployeesById' + id);
	//res.json([]);
	db.employees.findOne({
	    _id:mongojs.ObjectId(id)
	}, function(err, doc) {
	    res.json(doc);
	});


});

app.get('/removeEmployeeById/:id', function(req, res){
	db.employees.remove({
	    _id:mongojs.ObjectId(req.params.id)
	}, function(err, doc) {
	    res.json(doc);
	});

});

app.get('/removeEmployeeByLastName/:lastName', function(req, res){
	db.employees.remove({
	    last :req.params.lastName
	}, false, function(err, doc) {
	    res.json(doc);
	});

});


app.get('/updateEmployee/:id', function(req, res){

	console.log(req.query);
	var salary = req.query.salary;

	db.employees.findAndModify({
	    query: { _id:mongojs.ObjectId(req.params.id) },
	    update: { $set: { salary:salary } },
	    new: true
	}, function(err, doc, lastErrorObject) {
	     //res.json(doc);
	     db.employees.find(function(err, data){
		 		res.json(data);
		});


	});
});





app.get('/createEmployee', function(req, res){

	console.log(req.query);
	var employee = {
		first: req.query.firstName,
		last: req.query.lastName,
		salary: req.query.salary
	};

	db.employees.insert(employee, function(err, data){
		console.log(err);
		console.log(data);
		res.json(data);
		});
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP|| "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ipaddress);