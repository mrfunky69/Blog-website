//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "Hello reader, I am Rohit the creator and writer of this blog. This blogs contains experiences and trips of my travels. I hope you enjoy reading it.  ";
const aboutContent = "This site contains blogs of my travels across various parts in India. I have travelled to different parts from north to south ,from east to west. I have seen the sunrise and sunsets at mountains,beaches. Loving every part of nature experiencing every feel of it , trying to express them in the best way. Things may get hard but never stop travelling.";
const contactContent = "I love to talk to new people specially strangers so I will be happy to get connected . You contact me over any platform like LINKEDIN, INSTAGRAM , FACEBOOK looking forward to getting touch with you.  ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true,
useUnifiedTopology:true,
useFindAndModify:false});

const postSchema = {
  title:String,
  content:String
};

const Post = mongoose.model("Post",postSchema);



app.get("/", function(req, res){

  Post.find({},function(err,posts){
    res.render("home",{
      startingContent:homeStartingContent,
      posts:posts
    });
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err)
{
  if(!err)res.redirect("/");
});
});

app.get("/posts/:postID", function(req, res){

  const requestedPostID = req.params.postID;

  Post.findOne({_id:requestedPostID},function(err,post){
    res.render("post",{
      title:post.title,
      content:post.content
    });
  });


  // const requestedTitle = _.lowerCase(req.params.postName);
  //
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
  //
  //   if (storedTitle === requestedTitle)
  //   Post.find({},function(err,posts){
  //   res.render("post", {
  //     title: post.title,
  //     content: post.content
  //   });
  // }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
