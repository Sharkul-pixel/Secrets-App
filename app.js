//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
}) ;

userSchema.plugin(encrypt, {secret: process.env.SECRETS, encryptedField: ["password"], excludeFromEncryption:  ["email"]  });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUsers = new User({
    email: req.body.username,
    password: req.body.password
  });

newUsers.save((err) => {
  if(err) {
    console.log(err);
  }else{
    res.render("secrets");
  }
});
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, resultUser) => {
    if(err){
      console.log(err);
    }else{
      if(resultUser){
        if(resultUser.password === password){
          console.log(resultUser.password);
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
