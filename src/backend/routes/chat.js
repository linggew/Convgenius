var Chat = require('../models/chat') // Import the Chat model or adjust the path accordingly
var History = require('../models/history') // Import the History model or adjust the path accordingly

module.exports = function (router) {

  var chatRoute = router.route('/chat')

  // Create a new chat entry
  chatRoute.post(async function (req, res) {
    try {
      // console.log("4:++++++++++++++:" + JSON.stringify(req.body, null, 2))
      // Extract parameters from the request body
      const { query, answer, userChoice, history_id } = req.body
      console.log("query is " + query)
      console.log("answers is " + answer)
      // Validate input parameters
      if (!query || !answer || answer.length !== 3 || userChoice === undefined) {
        return res.status(400).json({ message: 'Invalid input parameters' })
      }
      // Fetch the history for the specified user from the database
      const history = await History.findById(history_id)

      // Check if the history exists
      if (!history) {
        return res.status(404).json({ message: 'Chat history not found' })
      }
      // Create a new chat entry
      const newChat = new Chat({
        query,
        answer: answer,
        userChoice,
        history_id,
        // Add other fields as needed
      })
      console.log("chat is " + newChat)

      // Save the new chat entry to the database
      const savedChat = await newChat.save()

      res.json({
        message: 'Chat entry created successfully',
        chat: {
          chatid: savedChat._id,
          query: savedChat.query,
          answer: savedChat.answer,
          userChoice: savedChat.userChoice,
          history_id: savedChat.history_id,
        },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Access all chat entries for a specific history_id
  chatRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const { history_id } = req.query

      // Fetch all chat entries for the specified history_id from the database
      const chatEntries = await Chat.find({ history_id })

      res.json({ message: 'Access all chat entries', chats: chatEntries })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
