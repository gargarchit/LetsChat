var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    user = require("../models/user"),
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
    
//Home Page
router.get('/', (req,res) => {
    res.render('home',{user: req.user});
});

// Form SignUp
router.get('/signup', (req,res) => {
    res.render('signup');
});

router.post('/signup', (req,res) => {
    var newuser = new user({username: req.body.username});
    user.register(newuser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, () => {
            newuser.name = req.body.name;
            newuser.email = req.body.email;
            newuser.save();
            res.redirect("/post");
        });
        }
    });
});

// LogIn
router.get('/login', (req,res) => {
    res.render('login');
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/post",
        failureRedirect: "/login",
        failureFlash: true,
    }), (req, res) => {
});

// Log Out
router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "You have successfully logged out!");
   res.redirect("/login");
});

// Profile
router.get('/user/:id',middleware.isLoggedIn, (req, res, next) => {
    user.findById(req.params.id, (err, user) => {
       if(err){
           req.flash("error", "User Not Found");
           res.redirect("/post");
       } else {
           post.find().where('profile.id').equals(user._id).exec((err, posts) => {
               if(err){
                    req.flash("error", "User Not Found");
                    res.redirect("/post");
               }
               var currentU = req.user;
               res.render('profile', {user: user,currentU: currentU, post: posts});
           });
       }
    });
});


// show edit form
router.get("/user/:id/edit", middleware.isLoggedIn, (req, res) => {
  user.findById(req.params.id, (err, foundUser) => {
    if (err || !foundUser) {
        return res.redirect("back"); 
    }
    if (foundUser._id.equals(req.user._id)) {
      res.render("useredit", {user: foundUser}); 
    } else {
      req.flash("error", "permission Not Granted");
      res.redirect("back");
    } 
  });
});
 
//update profile
router.put("/user/:id",middleware.isLoggedIn, (req, res) => {
  user.findByIdAndUpdate(req.params.id, req.body.User, {new: true}, (err, updatedUser) => {
    if (err) {
      req.flash("error", "Something went wrong...");
      return res.redirect("/user" + req.params.id);
    }
    if (updatedUser._id.equals(req.user._id)) {
      res.redirect("/user/" + req.params.id);
    } else {
      req.flash("error","Permission Not granted");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;