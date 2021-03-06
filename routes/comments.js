var  express = require("express"),
     router  = express.Router({mergeParams: true}),
     post = require("../models/post"),
     comment = require("../models/comment"),
     middleware = require("../middleware");
//Create comment : Form to Create comment
router.get("/post/:id/comments/create",middleware.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if(err){
            res.render("error");
        } else {
             res.render('createcomment', {post:post});
        }
    });
});

//Comment : Create New Comment
router.post("/post/:id/comments",middleware.isLoggedIn, (req, res) => {
  post.findById(req.params.id, (err, Post) => {
      if(err){
          res.render("error");
      } else {
        comment.create(req.body.Comment, (err, com) => {
          if(err){
              res.render("error");
          } else {
                com.profile.id = req.user._id;
                com.profile.username = req.user.username;
                com.profile.name = req.user.name;
                com.save();
                Post.comments.push(com);
                Post.save();
                req.flash("success", "Comment Added!");
                res.redirect('/post/' + Post._id);
          }
        });
      }
  });
});

// Edit Route
router.get('/post/:id/comments/:commentid/edit', middleware.checkownercomment ,(req,res) => {
    post.findById(req.params.id, (err, foundpost) => {
        if(err || !foundpost) {
            res.render("error");
        } else {
            comment.findById(req.params.commentid, (err, foundcomment) => {
                if (err) {
                    res.render("error");
                } else {
                    res.render('editcomment', {post_id: req.params.id, comment: foundcomment});   
                }
            });
        }
    });
});


//Update Route
router.put('/post/:id/comments/:commentid/', middleware.checkownercomment , (req,res) => {
    req.body.Comment.text = req.sanitize(req.body.Comment.text);
    comment.findByIdAndUpdate(req.params.commentid, req.body.Comment, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('/editcomment');
        } else {
            req.flash("success", "Comment Updated!");
            res.redirect('/post/' + req.params.id);
        }
    });
});


//Delete Route
router.delete('/post/:id/comments/:commentid/', middleware.checkownercomment ,(req,res) => {
    comment.findByIdAndRemove(req.params.commentid, {new: true}, (err, updatedPost) => {
        if(err) {
            res.redirect('back');
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect('/post/' + req.params.id);
        }
    });
});

module.exports = router;