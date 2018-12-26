var express = require("express"),
    router  = express.Router(),
    post = require("../models/post"),
    comment = require("../models/comment");

//Create comment : Form to Create comment
router.get('/post/:id/comments/create', (req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err) {
            console.log(err);
        } else {
            res.render('createcomment', {post:foundpost});
        }
    });
});

//Comment : Create New Comment
router.post('/post/:id/comments', (req,res) => {
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

module.exports = router;