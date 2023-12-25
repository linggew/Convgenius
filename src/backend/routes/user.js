var User = require("../models/users")

module.exports = function (router) {

  var userRoute = router.route('/user')

  userRoute.get(function (req, res) {
    // console.log("++++++++++++++++" + JSON.stringify(req.query, null, 2))
    // Example: Fetch users from MongoDB
    const { username, password } = req.query
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    User.findOne({ username, password }, 'username email', function (err, user) {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        console.log("I am here ")
        if (user) {
          // Login successful, return user information
          console.log("I am here ")
          res.json({
            message: 'Login successfully',
            user: {
              username,
              userid: user._id,
              // Include other user information as needed
            }
          },)
        } else {
          // Login failed, user not found or incorrect credentials
          res.status(401).json({ error: 'Invalid username or password' })
        }
      }
    })
  })

  userRoute.post(async function (req, res) {
    // Example: Create a new user in MongoDB
    // console.log("++++++++++++++++" + JSON.stringify(req.body, null, 2))
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required fields' })
    }
    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' })
      }
      // If the username is unique, create a new user
      const newUser = new User({
        username: username,
        email: email,
        password: password,
        // Add other fields as needed
      })

      // console.log(newUser)
      // Save the new user to the database
      const savedUser = await newUser.save()
      // Exclude the password field from the response
      const userWithoutPassword = savedUser.toObject()
      delete userWithoutPassword.password

      res.json({ message: 'Sighup successful', userWithoutPassword })
    } catch (err) {
      res.status(500).json({ error: err })
    }
  })
  return router
}