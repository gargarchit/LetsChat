var comment = require("../models/comment"),
    post = require("../models/post"),
    user = require("../models/user");
//Middleware
var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
            
        }
        res.redirect("/login");
    };

middlewareObj.checkowner = function checkowner(req,res,next) {
    if(req.isAuthenticated()){
        post.findById(req.params.id, (err, foundpost) => {
            if(err) {
                res.redirect('back');
            } else {
                if(foundpost.profile.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect('back');
                }
            }
        });  
    } else {
        res.redirect('/login');
    }
};
middlewareObj.checkownercomment = function(req, res, next){
        if(req.isAuthenticated()){
            comment.findById(req.params.commentid, function(err, com){
                if(err) {
                res.redirect('back');
            } else {
                if(com.profile.id.equals(req.user._id)){
                    return next();
                } else {
                    res.redirect('back');
                }
            }
        });  
    } else {
        res.redirect('/login');
    }
};

module.exports = middlewareObj;