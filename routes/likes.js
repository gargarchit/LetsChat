var  express = require("express"),
     router  = express.Router({mergeParams: true}),
     post = require("../models/post"),
     like = require("../models/like"),
     user = require("../models/user"),
     middleware = require("../middleware");
     

//Like : Create New Like
router.post("/post/:id/likes",middleware.isLoggedIn, (req, res) => {
  post.findById(req.params.id, (err, Post) => {
      if(err){
          res.render("error");
      } else {
        like.create(req.body.Like, (err, com) => {
          if(err){
              res.render("error");
          } else {
                com.profile.id = req.user._id;
                com.profile.username = req.user.username;
                com.profile.name = req.user.name;
                com.save();
                Post.like.push(com);
                Post.save();
                res.redirect('back');
            }
        });
      }
  });
});


//Show likes
router.get('/post/:id/like', (req,res) => {
    post.findById(req.params.id).populate('like').exec((err, foundpost) => {
        if(err || !foundpost) {
            res.render("error");
        } else {
            res.render('like', {post:foundpost});
        }
    });
});
module.exports = router;