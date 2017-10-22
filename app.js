var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var cookieParser=require('cookie-parser');
//Instantiating express
var app=express();

//bodyParser middleware

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

//mongodb connection
var db = 'mongodb://localhost/blogdb';
mongoose.connect(db);


//including the blogschema and model
var Blog=require('./blogschema.js');
var blogModel=mongoose.model('Blog');

// application level middleware
app.use(function(req,res,next){

	console.log("Hostname",req.hostname);
	console.log("Date",new Date());
	console.log("Ip address",req.ip);
	console.log("Request Method ",req.method);

	next();
});
//routes
app.get('/',function(req,res){
	res.send("A blog application with CRUD functionality");
});

//route to get all blogs
app.get('/blogs',function(req,res){
	blogModel.find(function(err,result){
		if(err){
			res.send(err);
		}else{
			res.send(result);
		}
	});

});

//route to get a specific blog

app.get('/blogs/:id',function(req,res){
	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			console.log("You got an error");
			res.send(err);
		}else{
			res.send(result);
		}
	});
});

//route to create a blog

app.post('/blog/create',function(req,res){

	var newBlog = new blogModel({

		title : req.body.title,
		author : req.body.author,
		blogBody : req.body.blogBody

	});

	//Date for new blog
	var today = Date.now();
	newBlog.createdOn = today;

	//Saving the newly created blog

	newBlog.save(function(err){
		if(err){
			console.log("An error occcured while creating "+ req.body.title +" blog!");
			res.send(err);

		}
		else{
			res.send(newBlog);
			console.log("Created new blog  : "+req.body.title);

		}

	});

});

//route to edit a blog

app.put('/blogs/:id/edit',function(req,res){
	var update = req.body;

	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
		if(err){
			console.log(" There was a Problem Updating the blog");
			res.send(err);
		}else{
			res.send(result);
			console.log("Updated blog  : "+req.body.title);
		}
	});
});

//route to delete a blog
app.post('/blogs/:id/delete',function(req, res) {

	blogModel.remove({'_id':req.params.id},function(err,result){

		if(err){
			console.log("ERROR");
			res.send(err);
		}
		else{
			res.send(result);
		    console.log("Deleted blog  : "+req.body.title);

		}


	});
});

app.use(function(req,res) {
	res.status('404').send("404: Page not found");
	console.log("404 Error");
});


//generic error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!');
  next(err);
})


app.listen(3000, function () {
	console.log('BlogApp  listening on port 3000!');
});