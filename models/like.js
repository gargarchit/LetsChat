var mongoose = require("mongoose");

// Mongoose/Model config
// like Schema
var likeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('like', likeSchema);