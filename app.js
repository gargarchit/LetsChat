var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

//App config
mongoose.connect("mongodb://localhost/Letschat", { useNewUrlParser: true });
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

// Mongoose/Model config
var postSchema = new mongoose.Schema({
   caption: String,
   image: String,
   created: {type: Date, default: Date.now}
});

var post = mongoose.model('post', postSchema);

//RestFul Routes
//landing Page
app.get('/', (req,res) => {
    res.render('index');
});

//Post : Show all Post
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
    var caption = req.body.caption;
    var image = req.body.image;
    var newpost = {caption:caption,image:image};
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

app.get('/post/:id', (req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {post:foundpost});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});