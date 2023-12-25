// Load required packages
var mongoose = require('mongoose')

var historySchema = new mongoose.Schema({
  title: String,
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

// Export the Mongoose model
module.exports = mongoose.model('History', historySchema)
