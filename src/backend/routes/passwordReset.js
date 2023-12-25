var User = require("../models/users")

module.exports = function (router) {

  var resetRoute = router.route('/reset')
  resetRoute.put(async function (req, res) {
    try {
      // Extract parameters from the request body
      const { username, old_password, new_password } = req.body

      // Fetch the user from the database based on the username
      const user = await User.findOne({ username })

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Check if the old password matches the stored password
      if (user.password !== old_password) {
        return res.status(401).json({ message: 'Incorrect old password' })
      }

      // Update the user's password
      user.password = new_password
      const updatedUser = await user.save()

      // Return the response with username, userid, and a message
      res.json({
        username: updatedUser.username,
        userid: updatedUser._id,
        message: 'Password updated successfully'
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}