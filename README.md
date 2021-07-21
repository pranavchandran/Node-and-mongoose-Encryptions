### Using cookies and sessiions wanted Libraries
passport
passport-local
passport-local-mongoose
express-session

npm i passport passport-local passport-local-mongoose express-session

1 start from session
  in app.js
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

<!-- 2nd -->
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


<!-- second step -->
app.use(passport.initialize());
app.use(passport.session());

<!-- third step -->
userSchema.plugin(passportLocalMongoose)

<!-- There is an error of depreciation  -->
mongoose.connect("mongodb://localhost/userDB",{useNewUrlParser: true, useUnifiedTopology: true});
solved:1 


<!-- After that i rewrite register and create get fucntion in secrets -->
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


After that session and cookies working perfectly

<!--Now we can set login part -->

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

<!-- whenever you restart nodemon cookies will delete -->
### Different machines and check the history of machines.
https://cryptii.com/

# For using Hashing passwords installing and how to use

npm i md5

// md5 for using as password
const md5 = require("md5");

app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });


### Password encryption

mongoose-encryption

## want a good idea where to start and end.-> Logic

### Using Environment variables to keep secrets safe.

npm i dotenv
### How to use dotenv

### First line in app.js
require('dotenv').config()

Create an .env file in root folder

and keep the secre there and map it to the app.js secret

After that chek your .env file if we upload to github we want to keep
safe .check .gitignore

<!-- Degrade to a lowel level node by nvm -->
nvm install 10.15.0

# Level 4 bcrypt (with salting)

### At register route
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const user = new User({
        email: req.body.username,
        password: hash,
      });
      user.save(function(err) {
        if (err) {
          console.log(err);
          res.send("User already exists");
        } else {
          res.render("secrets");
        }
      });
    }

### At login part
app.post("/login", (req, res) => {
  User.findOne({
    email: req.body.username
  }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            if (result) {
              res.render("secrets")
            } else {
              res.render("login", {
                error: "Invalid username or password"
              });
            }
          }
        });
      } else {
        res.render("login", {
          error: "Invalid username or password"
        });
      }
    }
  });
});




