//this file would contain all the routes associated with a blog
var fs = require('fs');
module.exports = function(blogRouter,databaseFile){
	blogRouter.get('/',function(req,res){

		var databaseData = JSON.parse(fs.readFileSync(databaseFile));
		var allBlogs = [];
		var allUsers = [];

		for(userName in databaseData){
			allUsers.push({
				name:userName,
				about:databaseData[userName].about
			})
			for(var blog in databaseData[userName].blogs){
				// allBlogs.push(databaseData[userName].blogs[blog]);
				allBlogs.push({
					name:userName,
					content:databaseData[userName].blogs[blog].content,
					date:databaseData[userName].blogs[blog].date
				})				
			}
		}

		console.log('all blogs->',allBlogs);

		res.render('pages/allBlogs',{
			allBlogs:allBlogs,
			allUsers:allUsers
		});
	});

	blogRouter.get('/createBlog',function(req,res){
		res.render('pages/createBlog');
	});
	blogRouter.post('/createBlog',function(req,res){
		var name = req.body.name;
		var password = req.body.password;
		var content = req.body.content;
		var date = new Date(Date.now());

		var databaseData = JSON.parse(fs.readFileSync(databaseFile));
		if(databaseData.hasOwnProperty(name)){
			if(databaseData[name].password==password){
				databaseData[name].blogs.push({
					content:content,
					date:date.toString()
				});
				fs.writeFileSync(databaseFile,JSON.stringify(databaseData));
				// res.json({success:true});
				res.redirect('/users/profile?name='+name);
			}
			else{
				res.json({success:false, message:"password does not match"});
			}
		}
		else{
			res.json({sucess:false,message:"no user with that name exists!"})
		}
	})
}