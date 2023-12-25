const { createUser } = require('./index')

createUser({ username: 'username', email: 'email', password: 'password' })
    .then((data) => {
        console.log('Create:', data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })
