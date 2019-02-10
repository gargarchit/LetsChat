var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"), 
    express = require("express"),
    flash = require("connect-flash"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    user = require("./models/user"),
    postrouter = require("./routes/posts"),
    commentrouter = require("./routes/comments"),
    likerouter = require("./routes/likes"),
    authrouter = require("./routes/auth_index"),
    middleware = require("./middleware"),
    http = require('http').Server(app),
    io = require('socket.io')(http);
    
//App config 
var dburl = process.env.DBURL || "mongodb://localhost/Letschat"
mongoose.connect(dburl, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

// Moment.js for Timestamp
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


// Chat Routes
app.get('/chat',middleware.isLoggedIn, function(req, res){
  res.render('chat.ejs', {user:req.user});
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
  });
});

// Unhandled routes
app.get("*",(req, res)=> {
  res.render('error');
});

http.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});