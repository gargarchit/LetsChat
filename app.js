var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"), 
    express = require("express"),
    flash = require("connect-flash"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session"),
    post = require("./models/post"),
    comment = require("./models/post"),
    user = require("./models/user"),
    postrouter = require("./routes/posts"),
    commentrouter = require("./routes/comments"),
    likerouter = require("./routes/likes"),
    authrouter = require("./routes/auth_index");

//App config 
// mongoose.connect("mongodb://localhost/Letschat", { useNewUrlParser: true });
mongoose.connect("mongodb://garg:garg123@ds047305.mlab.com:47305/letschat", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: "Secrets",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
   res.locals.currentuser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(authrouter);
app.use(postrouter);
app.use(commentrouter);
app.use(likerouter);


app.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});