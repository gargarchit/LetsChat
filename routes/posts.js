var express = require("express"),
    router  = express.Router(),
    post = require("../models/post"),
    middleware = require("../middleware"),
    multer = require('multer'),
    

storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only jpg, jpeg, png, gif format file accepted'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'letschat', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
    
    
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
router.post('/post',middleware.isLoggedIn, upload.single('image'), (req,res) => {
    cloudinary.uploader.upload(req.file.path, (result)=> {
        req.body.Post.image = result.secure_url;
        req.body.Post.imageId = result.public_id;
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
});

//Create Post : Form to Create Post
router.get('/createpost',middleware.isLoggedIn, (req,res) => {
    res.render('createpost');
});

//Show Post on Click
router.get('/post/:id', (req,res) => {
    post.findById(req.params.id).populate('comments').populate('like').exec((err, foundpost) => {
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
router.put("/post/:id", upload.single('image'), function(req, res){
    post.findById(req.params.id, async function(err, post){
        if(err){
            res.redirect('error');
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(post.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  post.imageId = result.public_id;
                  post.image = result.secure_url;
              } catch(err) {
                  console.log(err);
                  res.redirect('error');
              }
            }
            post.caption = req.body.caption;
            post.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/post/" + post._id);
        }
    });
});
//Delete Route
router.delete('/post/:id', middleware.checkowner, function(req, res) {
  post.findById(req.params.id, async function(err, post) {
    if(err) {
      res.redirect('/post/');
    }
    try {
        await cloudinary.v2.uploader.destroy(post.imageId);
        post.remove();
        res.redirect('/post/');
    } catch(err) {
        if(err) {
          res.redirect('/post/');
        }
    }
  });
});

module.exports = router;