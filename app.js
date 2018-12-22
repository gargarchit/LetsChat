var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
var post = [
        {caption: "Hello Everyone", image: "https://images.pexels.com/photos/237018/pexels-photo-237018.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"},
        ];

app.get('/', (req,res) => {
    res.render('index');
});

app.get('/post', (req,res) => {
    
    res.render("index", {post:post});
});

app.post('/post', (req,res) => {
    var caption = req.body.caption;
    var image = req.body.image;
    var newpost = {caption:caption,image:image};
    post.push(newpost);
    res.redirect('/post');
});

app.get('/createpost', (req,res) => {
    res.render('createpost');
});

app.listen(process.env.PORT, process.env.IP, () => {
   console.log('Server started'); 
});