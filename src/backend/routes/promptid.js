var Prompt = require('../models/prompt') // Import the Prompt model or adjust the path accordingly

module.exports = function (router) {

  var promptIdRoute = router.route('/prompt/:id')

  // Access single prompt template by ID
  promptIdRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const prompt_id = req.params.id

      // Fetch the prompt template from the database by ID
      const prompt = await Prompt.findById(prompt_id)

      // Check if the prompt template exists
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt template not found' })
      }

      res.json({ message: 'Access single prompt template', prompt })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Edit a prompt template
  promptIdRoute.put(async function (req, res) {
    try {
      // Extract parameters from the request
      const { title, content } = req.body
      const prompt_id = req.params.id

      // Fetch the prompt template from the database by ID
      const prompt = await Prompt.findById(prompt_id)

      // Check if the prompt template exists
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt template not found' })
      }

      // Validate the new title and content
      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required fields' })
      }

      // Update the prompt template
      prompt.title = title
      prompt.content = content

      // Save the updated prompt template to the database
      const updatedPrompt = await prompt.save()

      res.json({
        message: 'Prompt template updated successfully',
        prompt: updatedPrompt,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Delete a prompt template
  promptIdRoute.delete(async function (req, res) {
    try {
      // Extract parameter from the request
      const prompt_id = req.params.id

      // Delete the prompt template from the database by ID
      const deletedPrompt = await Prompt.findByIdAndDelete(prompt_id)

      // Check if the prompt template was found and deleted
      if (!deletedPrompt) {
        return res.status(404).json({ message: 'Prompt template not found' })
      }

      res.json({ message: 'Prompt template deleted successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
