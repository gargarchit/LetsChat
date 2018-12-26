var express = require("express"),
    router  = express.Router(),
    post = require("../models/post"),
    middleware = require("../middleware");
//Post : Show all Post Front Page
router.get('/post', (req,res) => {
    post.find( {}, (err,post) => {
        if(err){
            console.log(err);
        } else {
            res.render("index", {post:post});
        }
    });
});

//Post : Create New Post
router.post('/post',middleware.isLoggedIn, (req,res) => {
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
router.get('/createpost',middleware.isLoggedIn, (req,res) => {
    res.render('createpost');
});

//Show Post on Click
router.get('/post/:id', (req,res) => {
    post.findById(req.params.id).populate('comment').exec((err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {post:foundpost});
        }
    });
});

// Edit Route
router.get('/post/:id/edit', (req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('edit', {post:foundpost});
        }
    });
});

//Update Route
router.put('/post/:id', (req,res) => {
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
router.delete('/post/:id', (req,res) => {
    post.findByIdAndRemove(req.params.id, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('/post/');
        } else {
            res.redirect('/post/');
        }
    });
});

module.exports = router;