var comment = require("../models/comment"),
    post = require("../models/post"),
    user = require("../models/user");
//Middleware
module.exports = {
    isLoggedIn: function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
            
        }
        res.redirect("/login");
    }
}