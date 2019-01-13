var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require("validator");

var UserSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: String,
    pic: String,
    about: String,
    address: String,
    gender: String,
    website: String,
    contactno : Number,
    work: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);