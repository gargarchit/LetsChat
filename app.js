var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session"),
    post = require("./models/post"),
    comment = require("./models/post"),
    user = require("./models/user");

//App config
mongoose.connect("mongodb://localhost/Letschat", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

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
//RestFul Routes

//landing Page
app.get('/', (req,res) => {
    res.render('index');
});

//Post : Show all Post Front Page
app.get('/post', (req,res) => {
    post.find( {}, (err,post) => {
        if(err){
            console.log(err);
        } else {
            res.render("index", {post:post});
        }
    });
});

//Post : Create New Post
app.post('/post', (req,res) => {
    req.body.Post.caption = req.sanitize(req.body.Post.caption);
    var newpost = req.body.Post;
    post.create(newpost, (err,post) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/post');
        }
    });
});

//Create Post : Form to Create Post
app.get('/createpost', (req,res) => {
    res.render('createpost');
});

//Show Post on Click
app.get('/post/:id', (req,res) => {
    post.findById(req.params.id).populate('comment').exec((err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {post:foundpost});
        }
    });
});

// Edit Route
app.get('/post/:id/edit', (req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('edit', {post:foundpost});
        }
    });
});

//Update Route
app.put('/post/:id', (req,res) => {
    req.body.Post.caption = req.sanitize(req.body.Post.caption);
    post.findByIdAndUpdate(req.params.id, req.body.Post, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('/post');
        } else {
            res.redirect('/post/' + req.params.id);
        }
    });
});

//Delete Route
app.delete('/post/:id', (req,res) => {
    post.findByIdAndRemove(req.params.id, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('/post/');
        } else {
            res.redirect('/post/');
        }
    });
});

//---COMMENTS ROUTES-----------------------------(Later will move all commment and post route in *routes*)-----------------

//Create comment : Form to Create comment
app.get('/post/:id/comments/create', (req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('createcomment', {post:foundpost});
        }
    });
});

//Comment : Create New Comment
app.post('/post/:id/comments', (req,res) => {
    post.findById(req.params.id, (err,post) => {
        if(err){
            res.redirect('/post');
        } else {
            comment.create(req.body.Comment, (err,post) => {
                if(err){
                    console.log(err);
                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/post/' + post._id);
                }
            });
        }
    });
});

// Will continue comments later first I will add Authentication (logIn/ SignUp)

// Form SignUp
app.get('/signup', (req,res) => {
    res.render('signup');
});

app.post('/signup', (req,res) => {
    var newuser = new user({username: req.body.username});
    user.register(newuser, req.body.password, (err, user) => {
        if(err){
            console.log(err.message);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, () => {
           res.redirect("/post"); 
        });
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});