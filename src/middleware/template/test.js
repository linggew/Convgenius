const { getTemplateDetails, createTemplate, updateTemplate, deleteTemplate } = require('./index')

createTemplate({ title: 'title1', content: 'content', user_id: '656fd7660a975904af419a42' })
    .then((data) => {
        console.log('Create:', data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })

getTemplateDetails('656fd7660a975904af419a42')
    .then((data) => {
        console.log('Get:', data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })

updateTemplate({ title: 'title4', content: 'content', user_id: '6572ce50528a4c08ae04e556', _id: '6572cdd547ec7103354bcb7d' })
    .then((data) => {
        console.log('Update:', data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })

deleteTemplate({ _id: '6572cde9528a4c08ae04e546', title: 'title2', content: 'content', user_id: '656fd7660a975904af419a42' })
    .then((data) => {
        console.log('Delete:', data)
    })
    .catch((error) => {
        console.error('Error:', error)
    })
