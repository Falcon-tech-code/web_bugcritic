var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./models/users");
var app = express();
  
mongoose.connect("mongodb+srv://admin:asd0226@bugcritic.84orqcu.mongodb.net/?retryWrites=true&w=majority");
  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
//=====================
// ROUTES
//=====================
  
// Showing home page
app.get("/main.ejs", function (req, res) {
    res.render("main");
});

// Showing register form
app.get("/register.ejs", function (req, res) {
    res.render("register");
});
  
// Handling user signup
app.post("/register.ejs", async (req, res) => {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    });
    
    return res.status(200).json(user);
  });
  
//Showing login form
app.get("/login.ejs", function (req, res) {
    res.render("login");
});
  
//Handling user login
app.post("/login.ejs", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("main.ejs");
          } else {
            res.status(400).json({ error: "Şifre Hatalı" });
          }
        } else {
          res.status(400).json({ error: "Böyle Bir Kullanıcı Bulunmamaktadır." });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});
  
//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.get("/", function (req, res) {
    res.render("main");
});
  

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login.ejs");
}
  
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});