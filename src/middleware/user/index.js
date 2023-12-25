import configpath from '../../frontend/configpath'

async function createUser(data) {
    try {
        const response = await fetch(`${configpath.apiUrl}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return await response.json()
    } catch (error) {
        return console.error('Error fetching data:', error)
    }
}

module.exports = { createUser }