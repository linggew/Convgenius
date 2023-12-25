var User = require("../models/users")

module.exports = function (router) {

  var resetRoute = router.route('/reset')

  resetRoute.post(function (req, res) {
    // console.log("++++++++++++++++" + JSON.stringify(req.body, null, 2))

    // Example: Fetch users from MongoDB
    const { username, oldPassword, newPassword } = req.body

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Username, oldPassword, and newPassword are required' })
    }

    User.findOne({ username, password: oldPassword }, 'username email', function (err, user) {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        console.log("I am here ")
        if (user) {
          // Update password if old password matches
          user.password = newPassword
          user.save(function (err) {
            if (err) {
              res.status(500).json({ error: 'Error updating password' })
            } else {
              // Password update successful
              res.json({ message: 'Password updated successfully' })
            }
          })
        } else {
          // Old password doesn't match, password update failed
          res.status(401).json({ error: 'Invalid old password' })
        }
      }
    })
  })
  return router
}
