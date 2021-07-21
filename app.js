//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// mongoose encryption
const encrypt = require("mongoose-encryption")

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost/userDB",{useNewUrlParser: true, useUnifiedTopology: true});

// create a user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

// keep the user model private
userSchema.plugin(encrypt, { 
                             secret: process.env.SECRET, 
                             algorithm: "aes-256-cbc",
                             encryptedFields: ["password"] 
                          });

// create the model and expose it to the app
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});


app.get("/login", (req, res) => {
  res.render("login");
});
// create a login route
app.post("/login", (req, res) => {
  User.findOne({
    email: req.body.username
  }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (user) {
        if (user.password === req.body.password) {
          res.render("secrets")
        } else {
          res.send({
            success: false,
            message: "Invalid credentials"
          });
        }
      } else {
        res.send({
          success: false,
          message: "User not found"
        });
      }
    }
  });
});


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save(function(err) {
    if (err) {
      console.log(err);
      res.send("User already exists");
    } else {
      res.render("secrets");
    }
  });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
