var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    user = require("../models/user"),
    middleware = require("../middleware");

//landing Page
router.get('/', (req,res) => {
    res.render('index');
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
        failureRedirect: "/login"
    }), (req, res) => {
});

// Log Out
router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "You have successfully logged out!");
   res.redirect("/login");
});

// Profile
router.get('/profile',middleware.isLoggedIn, function(req, res, next) {
    var user = req.user;
    res.render('profile', {user: user});
});



module.exports = router;