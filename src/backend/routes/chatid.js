var Chat = require('../models/chat') // Import the Chat model or adjust the path accordingly
var History = require('../models/history')

module.exports = function (router) {

  var chatIdRoute = router.route('/chat/:id')

  // Access single chat by ID
  chatIdRoute.get(async function (req, res) {
    try {
      // Extract parameter from the request
      const chat_id = req.params.id

      // Fetch the chat from the database by ID
      const chat = await Chat.findById(chat_id)

      // Check if the chat exists
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' })
      }

      res.json({
        chat_in_history: {
          query: chat.query,
          answer: chat.answer,
          userChoice: chat.userChoice
        }
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Edit a chat
  chatIdRoute.put(async function (req, res) {
    try {
      console.log(req.body)
      // Extract parameters from the request body
      const { new_query, new_answer, new_userChoice } = req.body
      const chat_id = req.params.id

      // Fetch the chat from the database by ID
      const chat = await Chat.findById(chat_id)

      // Check if the chat exists
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' })
      }

      // Validate the input
      if (!new_query || !new_answer || new_answer.length !== 3 || new_userChoice === undefined) {
        return res.status(400).json({ message: 'Invalid input. New query, 3 new answers, and new userChoice are required.' })
      }

      // Update the chat
      chat.query = new_query
      chat.answer[0] = new_answer[0]
      chat.answer[1] = new_answer[1]
      chat.answer[2] = new_answer[2]
      chat.userChoice = new_userChoice

      console.log("chat is" + chat)
      // Save the updated chat to the database
      const updatedChat = await chat.save()

      res.json({
        message: 'Chat updated successfully',
        chat: {
          chatId: updatedChat._id,
          query: updatedChat.query,
          answers: [updatedChat.answer[0], updatedChat.answer[1], updatedChat.answer[2]],
          userChoice: updatedChat.userChoice,
        },
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  // Delete a chat
  chatIdRoute.delete(async function (req, res) {
    try {
      // Extract parameter from the request
      const chat_id = req.params.id

      // Find the chat to be deleted
      const deletedChat = await Chat.findByIdAndDelete(chat_id)

      // Check if the chat was found and deleted
      if (!deletedChat) {
        return res.status(404).json({ message: 'Chat not found' })
      }

      // Remove the chat_id from the associated History document
      const history_id = deletedChat.history_id
      await History.updateOne(
        { _id: history_id },
        { $pull: { history: chat_id } }
      )

      res.json({ message: 'Chat deleted successfully' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })


  return router
}
