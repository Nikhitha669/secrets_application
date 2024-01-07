//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const fs=require("node:fs");
const app = express();
console.log(process.env.API_KEY);
const port=3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/UserDB").then(()=>{
    console.log("Database Connected")
}).catch((e)=>{
    console.log(e)
    console.log("Database Can't Be Connected")
})
const userData = new mongoose.Schema({
  email:{
      type: String
  },
  password:{
      type: String
  }
});


userData.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userData)
module.exports = User



app.get("/", function(req, res){
    res.render("home");
  });
  app.get("/login", function(req, res){
    res.render("login");
  });
  
  app.get("/register", function(req, res){
    res.render("register");
  });

  app.post("/register", async function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    await newUser.save()
    res.render("register");
    });

    app.post("/login", async function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
    
        try {
            const foundUser = await User.findOne({ email: username });
    
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            } else {
                // Handle invalid login credentials here
                res.render("login", { errorMessage: "Invalid login credentials" });
            }
        } catch (err) {
            console.error(err);
            // Handle other errors (e.g., database connection issues)
            res.status(500).send("Internal Server Error");
        }
    });
    
  

  app.listen(port, ()=>{
    console.log("App Running on port: ", port)
})