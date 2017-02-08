var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 9000;


var databaseFile = "./database.json";
/*
{
	movieName : {
		.
		.
		.
	}
}
*/


app.get('/movies',(req,res) => {
	var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());
	res.json({success:true,message:"returning list of movies",movies:databaseData});
});

app.post('/movies',(req,res) => {
	var movieName = req.body.movieName;
	var movieDetails = req.body;

	if(movieName){
		var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());
		databaseData[movieName] = movieDetails;
		fs.writeFileSync(databaseFile,JSON.stringify(databaseData));

		res.json({success:true,message:"movie successfully added"});
	}
	else{
		// res.json({success:false,message:"movie name has not been passed"});
		res.status(400).send("movie name has not been passed");
	}
})

app.route("/movies/:name")
	.get((req,res) => {
		var movieName = req.params.name;
		var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());
		if(databaseData.hasOwnProperty(movieName)){
			res.json({success:true,movie:databaseData[movieName]});
		}
		else{
			// res.json({success:false,message:"movie with the name not found"});
			res.status(400).send("movie with the name not found")
		}
	})
	.delete((req,res) => {
		var movieName = req.params.name;
		var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());

		if(databaseData.hasOwnProperty(movieName)){
			delete databaseData[movieName]
			fs.writeFileSync(databaseFile,JSON.stringify(databaseData));
			res.json({success:true,message:"successfully deleted"})
		}
		else{
			// res.json({success:false,message:"movie with name not found"});
			res.status(400).send("movie with name not found");
		}
	})
	.put((req,res) => {
		var movieName = req.params.name;
		var databaseData = JSON.parse(fs.readFileSync(databaseFile).toString());

		if(databaseData.hasOwnProperty(movieName)){
			databaseData[movieName]=req.body;
			fs.writeFileSync(databaseFile,JSON.stringify(databaseData));
			res.json({success:true,message:"movie successfully updated"});
		}
		else{
			// res.json({success:false,message:"movie with name not found"});
			res.status(400).send("movie with name not found");
		}
	})

app.listen(port);
console.log("the app is running just fine");