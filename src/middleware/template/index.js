import configpath from '../../frontend/configpath'

async function getTemplateDetails (userId) {
    try {
        const response = await fetch(`${configpath.apiUrl}/api/prompt?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch (error) {
        return console.error('Error:', error)
    }
}

async function createTemplate (data) {
    console.log("++++++" + JSON.stringify(data, null, 2))
    try {
        const response = await fetch(`${configpath.apiUrl}/api/prompt`, {
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

async function updateTemplate (template) {
    const data = { title: template.title, content: template.content }
    console.log("hahahahahahahahahah+++++" + JSON.stringify(data, null, 2))
    try {
        const response = await fetch(`${configpath.apiUrl}/api/prompt/${template._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return await response.json()
    } catch (error) {
        return console.error('Error:', error)
    }
}

async function deleteTemplate (template) {
    console.log("kkk++" + template._id)
    try {
        const response = await fetch(`${configpath.apiUrl}/api/prompt/${template._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await response.json()
    } catch (error) {
        return console.error('Error:', error)
    }
}

export { getTemplateDetails, createTemplate, updateTemplate, deleteTemplate }
