var mongoose = require("mongoose");

// Mongoose/Model config
// Post Schema
var postSchema = new mongoose.Schema({
   caption: String,
   image: String,
   created: {type: Date, default: Date.now},
   likes : Number,
   profile: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"
      },
      name : String,
      username: String
   },
   comments: [
      {
         type : mongoose.Schema.Types.ObjectId,
         ref: "comment"
      }],
});

postSchema.methods.clap = function() {
    this.likes++
    return this.save()
}
module.exports = mongoose.model('post', postSchema);