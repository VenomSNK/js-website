var express     = require("express"),
     app        = express(),
     bodyParser = require("body-parser"),
     mongoose   = require("mongoose"),
     passport   = require("passport"),
     LocalStrategy = require("passport-local"),
     methodOverride = require("method-override"),
     Dog = require("./models/dog"),
     Comment    = require("./models/comment"),
     User       = require("./models/user");

    //routes
    var commentRoutes = require("./routes/comments"),
        dogsRoutes = require("./routes/dogs"),
        indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/dogs_db", { useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//passport config
app.use(require("express-session")({
    secret: "Once again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res ,next){
    res.locals.currentUser = req.user;
    next();
})

app.use("/", indexRoutes);
app.use("/dogs", dogsRoutes);
app.use("/dogs/:id/comments", commentRoutes);

var server = app.listen(3000, function (){
    console.log("Server has started.");
});
