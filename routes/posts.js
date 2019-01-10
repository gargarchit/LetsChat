var express = require("express"),
    router  = express.Router(),
    post = require("../models/post"),
    middleware = require("../middleware");
//Post : Show all Post Front Page
router.get('/post', (req,res) => {
    post.find( {}, (err,post) => {
        if(err){
            res.render("error");
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
            res.render("error");
        } else {
            post.profile.id = req.user._id;
            post.profile.username = req.user.username;
            post.profile.name = req.user.name;
            post.save();
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
    post.findById(req.params.id).populate('comments').exec((err, foundpost) => {
        if(err || !foundpost) {
            res.render("error");
        } else {
            res.render('show', {post:foundpost});
        }
    });
});

// Edit Route
router.get('/post/:id/edit', middleware.checkowner ,(req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if (err) {
            res.render("error");
        } else {
            res.render('edit', {post:foundpost});   
        }
    });
});

//Update Route
router.put('/post/:id',middleware.checkowner , (req,res) => {
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
router.delete('/post/:id', middleware.checkowner ,(req,res) => {
    post.findByIdAndRemove(req.params.id, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('/post/');
        } else {
            res.redirect('/post/');
        }
    });
});

// router.post("likepost");

// likepost: (req, res, next) => {
//         post.findById(req.body.post_id).then((post)=> {
//             return post.likes().then(()=>{
//                 return res.json({msg: "Done"});
//             });
//         }).catch(next);
// },


module.exports = router;