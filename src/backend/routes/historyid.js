var History = require('../models/history') // Import the History model or adjust the path accordingly
var Chat = require('../models/chat') // Import the Chat model or adjust the path accordingly
module.exports = function (router) {

  var historyIdRoute = router.route('/history/:id')

  // Download chat history by ID
  historyIdRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const history_id = req.params.id

      // Fetch the history from the database by ID
      const history = await History.findById(history_id)

      // Check if the history exists
      if (!history) {
        return res.status(404).json({ message: 'History not found' })
      }

      res.json({ title: history.title, history: history.history })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Update chat history
  historyIdRoute.put(async function (req, res) {
    try {
      // Extract parameters from the request body
      const { chat_id, title } = req.body
      const history_id = req.params.id

      // Fetch the history from the database by ID
      const history = await History.findById(history_id)

      // Check if the history exists
      if (!history) {
        return res.status(404).json({ message: 'History not found' })
      }

      // Fetch the history from the database by ID
      const chat = await Chat.findById(chat_id)

      // Check if the history exists
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' })
      }
      const existchat = await history.history.includes(chat_id)

      // Check if the history exists
      if (existchat) {
        return res.status(404).json({ message: 'Chat already exist' })
      }
      // Update the chat history
      console.log("chatid" + chat_id)
      history.history.push(chat_id)
      if (title) {
        history.title = title
      }
      // Save the updated history to the database
      const updatedHistory = await history.save()

      res.json({
        message: 'Chat history updated successfully',
        history: updatedHistory.history,
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Delete chat history
  historyIdRoute.delete(async function (req, res) {
    try {
      // Extract parameter from the request
      const history_id = req.params.id

      // Fetch the history from the database by ID
      const history = await History.findById(history_id)

      // Check if the history exists
      if (!history) {
        return res.status(404).json({ message: 'History not found' })
      }

      // Get the chat IDs associated with the history
      const chatIdsToDelete = history.history

      // Delete the associated chats from the Chat collection
      await Promise.all(chatIdsToDelete.map(async (chatId) => {
        await Chat.findByIdAndDelete(chatId)
      }))

      // Delete the history from the database by ID
      const deletedHistory = await History.findByIdAndDelete(history_id)

      // Check if the history was found and deleted
      if (!deletedHistory) {
        return res.status(404).json({ message: 'History not found' })
      }

      res.json({ message: 'Chat history and related chats deleted successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
