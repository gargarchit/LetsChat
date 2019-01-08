var comment = require("../models/comment"),
    post = require("../models/post"),
    user = require("../models/user");
//Middleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please Login !!");
        res.redirect("/login");
    };
 
middlewareObj.checkowner = function checkowner(req,res,next) {
    if(req.isAuthenticated()){
        post.findById(req.params.id, (err, foundpost) => {
            if(err) {
                req.flash("error", "NO POST FOUND");
                res.redirect('back');
            } else {
                if(foundpost.profile.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Permission Not Granted");
                    res.redirect('back');
                }
            }
        });  
    } else {
        req.flash("error", "Please Login First!");
        res.redirect('/login');
    }
};
middlewareObj.checkownercomment = function(req, res, next){
        if(req.isAuthenticated()){
            comment.findById(req.params.commentid, function(err, com){
                if(err) {
                req.flash("error", "NO Comment FOUND");
                res.redirect('back');
            } else {
                if(com.profile.id.equals(req.user._id)){
                    return next();
                } else {
                    req.flash("error", "Permission Not Granted");
                    res.redirect('back');
                }
            }
        });  
    } else {
        req.flash("error", "Please Login First!");
        res.redirect('/login');
    }
};

module.exports = middlewareObj;