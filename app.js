var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(),
    post = require("./models/post"),
    comment = require("./models/post");

//App config

mongoose.connect("mongodb://localhost/Letschat", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


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
    post.findById(req.params.id, (err, foundpost) => {
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

app.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});