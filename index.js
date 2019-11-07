 var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"), 
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer");
// APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());
// MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String, 
	image:String, 
	body:String, 
	created:{type:Date, default:Date.now}
}); 

var Blog = mongoose.model("Blog",blogSchema);

// INDEX ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
}) 

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs})
		}
	});
})

//NEW AND CREATE ROUTES
app.get("/blogs/new",function(req,res){
	res.render("new")
})

app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs")
		}
	})
})

//SHOW
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("show",{blog: foundBlog})
		}
	})
})
//EDIT
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.render("/blogs")
		}else{
			res.render("edit",{blog: foundBlog})
		}
	});
});
//UPDATE
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs/"+req.params.id)
		}
	})
})
//DESTROY
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs")
		}
	})
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("RESTfull Blog App Server has started!")
}); 