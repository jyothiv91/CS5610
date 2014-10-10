var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/serviceClients", function(req, res){
	var svc1 = {
			name: "LinkedIn"
			};

		var svc2 = {
			name: "Rotten Tomaetoes"
			};

		var svc3 = {
				name: "IMDB"
			};

	var serviceClients = [svc1, svc2, svc3];
	res.json(serviceClients);
});



app.listen(3000);