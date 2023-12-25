var Prompt = require('../models/prompt') // Import the Prompt model or adjust the path accordingly
var User = require("../models/users")
module.exports = function (router) {

  var promptRoute = router.route('/prompt')

  // Access all prompt templates for a specific user
  promptRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const { user_id } = req.query

      // Fetch all prompt templates for the specified user from the database
      const promptTemplates = await Prompt.find({ user_id })

      res.json({ message: 'Access all prompt templates', prompts: promptTemplates })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  promptRoute.post(async function (req, res) {
    // console.log("+++++++++++++" + JSON.stringify(req.body, null, 2))
    try {
      // Extract parameters from the request body
      const { title, content, user_id } = req.body

      // Check if required fields are provided
      if (!title || !content || !user_id) {
        return res.status(400).json({ message: 'Title, content, and user_id are required fields' })
      }

      // Check if the user with the provided user_id exists
      const existingUser = await User.findById(user_id)
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Create a new prompt template
      const newPrompt = new Prompt({
        title,
        content,
        user_id, // Set the user field with the ObjectId of the user
        // Add other fields as needed
      })

      // Save the new prompt template to the database
      const savedPrompt = await newPrompt.save()

      res.json({
        message: 'Prompt template created successfully',
        prompt: {
          title: savedPrompt.title,
          content: savedPrompt.content,
          prompt_id: savedPrompt._id,
          user_id: savedPrompt.user, // Include the user_id in the response
          // Include other prompt information as needed
        },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
