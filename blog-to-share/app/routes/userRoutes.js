//this file would contain all the routes associated with the user
var fs = require('fs');

module.exports = function(userRouter,databaseFile){
	userRouter.get('/signup',function(req,res){
		res.render('pages/signup.ejs')
	});

	userRouter.post('/signup',function(req,res){
		var name = req.body.name;
		var password = req.body.password;
		var about = req.body.about;

		//check if user with that username exists
			//if yes, show an alert
			//if no, create a new user

		var databaseData = JSON.parse(fs.readFileSync(databaseFile));
		// console.log("databaseData->",databaseData);

		if(databaseData.hasOwnProperty(name)){
			res.json({success:false,message:"user with that name already exists! Choose a different userName"});
		}
		else{
			databaseData[name]={
				password : password,
				about : about,
				blogs : []
			}
			fs.writeFileSync(databaseFile,JSON.stringify(databaseData));

			res.json({success:true});
		}
	})
}