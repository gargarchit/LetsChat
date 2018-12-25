var mongoose = require("mongoose");

// Mongoose/Model config
// Comment Schema
var commentSchema = new mongoose.Schema({
   text: String,
   profile: String,
   created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('comment', commentSchema);