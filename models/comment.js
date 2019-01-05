var mongoose = require("mongoose");

// Mongoose/Model config
// Comment Schema
var commentSchema = new mongoose.Schema({
   text: String,
   profile: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        name : String,
        username: String
   },
   
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('comment', commentSchema);