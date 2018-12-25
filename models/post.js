var mongoose = require("mongoose");

// Mongoose/Model config
// Post Schema
var postSchema = new mongoose.Schema({
   caption: String,
   image: String,
   created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('post', postSchema);