// Load required packages
var mongoose = require('mongoose')

var chatSchema = new mongoose.Schema({
  query: String,
  answer: [String],
  userChoice: Number,
  history_id: { type: mongoose.Schema.Types.ObjectId, ref: 'History' }
})

// Export the Mongoose model
module.exports = mongoose.model('Chat', chatSchema)
