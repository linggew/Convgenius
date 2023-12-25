// Load required packages
var mongoose = require('mongoose')

var promptSchema = new mongoose.Schema({
  title: String,
  content: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Prompt', promptSchema)