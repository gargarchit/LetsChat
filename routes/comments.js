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
                com.profile.name = req.user.name;
                com.save();
                Post.comments.push(com);
                Post.save();
                res.redirect('/post/' + Post._id);
          }
        });
      }
  });
});

// // Edit Route
// router.get('/post/:id/comments/:comment_id/edit', middleware.checkowner ,(req,res) => {
//     post.findById(req.params.id, (err, foundcomment) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render('editcomment', {post_id: req.params.id, comment: foundcomment});   
//         }
//     });
// });

// //Update Route
// router.put('/post/:id',middleware.checkowner , (req,res) => {
//     req.body.Post.caption = req.sanitize(req.body.Post.caption);
//     post.findByIdAndUpdate(req.params.id, req.body.Post, {new: true}, (err, updatedPost) => {
//         if(err) {
//             res.redirect('/post');
//         } else {
//             res.redirect('/post/' + req.params.id);
//         }
//     });
// });

// //Delete Route
// router.delete('/post/:id', middleware.checkowner ,(req,res) => {
//     post.findByIdAndRemove(req.params.id, {new: true}, (err, updatedPost) => {
//         if(err) {
//             res.redirect('/post/');
//         } else {
//             res.redirect('/post/');
//         }
//     });
// });

module.exports = router;