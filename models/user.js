var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require("validator");

var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String, 
        unique: true, 
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
        
    },
    username: {
            type: String,
            lowercase: true, 
            unique: true, 
            trim: true, 
            minlength: 4,
            match: [/^[a-z]{1}[A-Za-z0-9_]{3,16}$/, 'is invalid'], 
            index: true
        
    },
    password: {type: String, minlength: 8, maxlength: 20},
    image: String,
    imageId: String,
    about: String,
    address: String,
    gender: String,
    website: String,
    contactno : Number,
    work: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);