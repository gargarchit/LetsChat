var  express = require("express"),
     router  = express.Router({mergeParams: true}),
     post = require("../models/post"),
     comment = require("../models/comment"),
     middleware = require("../middleware");
//Create comment : Form to Create comment
router.get("/post/:id/comments/create",middleware.isLoggedIn, (req, res) => {
    post.findById(req.params.id, (err, post) => {
        if(err){
            console.log(err);
        } else {
             res.render('createcomment', {post:post});
        }
    });
});

//Comment : Create New Comment
router.post("/post/:id/comments",middleware.isLoggedIn, (req, res) => {
  post.findById(req.params.id, (err, Post) => {
      if(err){
          res.redirect("/post");
      } else {
        comment.create(req.body.Comment, (err, com) => {
          if(err){
              console.log(err);
          } else {
              com.profile.id = req.user._id;
              com.profile.username = req.user.username;
              com.save();
              Post.comments.push(com);
              Post.save();
              res.redirect('/post/' + Post._id);
          }
        });
      }
  });
});
module.exports = router;