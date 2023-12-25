var History = require('../models/history') // Import the History model or adjust the path accordingly
var User = require('../models/users')
module.exports = function (router) {

  var historyRoute = router.route('/history')

  // See all chat history for a user
  historyRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const { user_id } = req.query

      // Fetch the history for the specified user from the database
      const history = await History.find({ user_id })

      // Check if the history exists
      if (!history) {
        return res.status(404).json({ message: 'Chat history not found for the user' })
      }

      res.json({ message: 'See all chat history', history })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Upload chat history for a user
  historyRoute.post(async function (req, res) {
    console.log(req.body)
    try {
      // Extract parameters from the request body
      const { user_id, title } = req.body

      // Validate the input
      if (!user_id || !title) {
        return res.status(400).json({ message: 'Invalid input. User ID and history title are required.' })
      }
      // Check if the user with the provided user_id exists
      const existingUser = await User.findById(user_id)
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Create a new history entry
      const newHistory = new History({
        user_id,
        title
        // history: chat_history,
      })

      await newHistory.save()

      res.json({ message: 'Chat history creat successfully', history_id: newHistory._id })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
