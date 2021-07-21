//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


// mongoose encryption
// const encrypt = require("mongoose-encryption")
// md5 for using as password
// const md5 = require("md5");
// using bcrypt
// const bcrypt = require("bcrypt");
// const saltRounds = 4;

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost/userDB",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);


// create a user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

// hash and salt the password
userSchema.plugin(passportLocalMongoose)


// keep the user model private
// userSchema.plugin(encrypt, { 
//                              secret: process.env.SECRET, 
//                              algorithm: "aes-256-cbc",
//                              encryptedFields: ["password"] 
//                           });

// create the model and expose it to the app
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});



app.get("/login", (req, res) => {
  res.render("login");
});
// create a login route
// app.post("/login", (req, res) => {
//   User.findOne({
//     email: req.body.username
//   }, (err, user) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       if (user) {
//         bcrypt.compare(req.body.password, user.password, (err, result) => {
//           if (err) {
//             res.status(500).send(err);
//           } else {
//             if (result) {
//               res.render("secrets")
//             } else {
//               res.render("login", {
//                 error: "Invalid username or password"
//               });
//             }
//           }
//         });
//       } else {
//         res.render("login", {
//           error: "Invalid username or password"
//         });
//       }
//     }
//   });
// });

// create a logout route
app.get("/logout", (req, res) => {
  res.redirect("/login");
});


app.get("/register", (req, res) => {
  req.logOut();
  res.render("register");
});


// if the user is authenticated, redirect to the secret page
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

// User register with email and password by pasport-local-mongoose
app.post("/register", (req, res) => {
  User.register(new User({
    username: req.body.username,
  }), req.body.password, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      passport.authenticate("local", (err, user) => {
        if (err) {
          res.status(500).send(err);
        } else {
          req.logIn(user, (err) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.redirect("/secrets");
            }
          });
        }
      }
      )(req, res, user);
    }
  });
});

// want a login route
app.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.redirect("/secrets");
          }
        });
      } else {
        res.render("login", {
          error: info.message
        });
      }
    }
  })(req, res);
});


// app.post("/register", (req, res) => {

//   bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       const user = new User({
//         email: req.body.username,
//         password: hash,
//       });
//       user.save(function(err) {
//         if (err) {
//           console.log(err);
//           res.send("User already exists");
//         } else {
//           res.render("secrets");
//         }
//       });
//     }
//   });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
