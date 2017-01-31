var express = require('express');
var app     = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 9000;

app.set('views',__dirname+"/app/views");
app.set('view engine','ejs');

var userRouter = express.Router();
var blogRouter = express.Router();
var databaseFile = "./database.json";
/*
	userName : {
		password:"supersecure",
		about:"I am sexy and I know it",
		blogs:[{
			content:"abcd",
			date:""
		},{},{},...]
	}
*/


require('./app/routes/userRoutes.js')(userRouter,databaseFile);

app.use('/users',userRouter);

require('./app/routes/blogRoutes.js')(blogRouter,databaseFile);

app.use('/blogs',blogRouter);

app.listen(port);

console.log("end of code reached!");