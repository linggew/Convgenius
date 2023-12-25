import axios from 'axios'
import { OpenAI } from 'langchain/llms/openai'
import configpath from '../../frontend/configpath'

// parameter : userInput
// Functionality: return list of answers : [chatGpt, Llama2]
async function postUserQuery(userInput) {
    // Initialization for ChatGPT
    const llm_chatGpt = new OpenAI({
        openAIApiKey: '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', // Replace with your actual API key
    })

    // URL and token for Llama-2
    const apiUrl = 'https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-70b-chat-hf'
    const bearerToken = 'kB44YJ5jqOAQBvZVtOyvjsVmeJups7EN' // Replace with your actual bearer token

    // Check if user input exceeds 50 words
    const wordCount = userInput.split(/\s+/).length
    let ChatGPT_response, Llama2_response

    if (wordCount > 50) {
        ChatGPT_response = "say 'word limit is 50'"
        Llama2_response = "<<SYS>> say 'word limit is 50' <<SYS>>"
    } else {
        const combinedInput = `${userInput}`
        const chatGptResult = await llm_chatGpt.predict(combinedInput)
        // Combine ChatGPT response into a single string
        ChatGPT_response = chatGptResult.replace(/\n+/g, ' ')

        // Constructing the payload for Llama-2
        const payload = {
            input: `[INST] ${userInput} [/INST]`,
            max_new_tokens: 2048,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 0,
            repetition_penalty: 1.2,
            num_responses: 1,
            stream: false,
        }

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
            })
            Llama2_response = response.data.results[0].generated_text.replace(/\n+/g, ' ') // Combine Llama2 response into a single string
        } catch (error) {
            console.error('Error:', error)
            Llama2_response = 'Error in processing request'
        }
    }

    return { ChatGPT_response, Llama2_response }
}

// Assuming you have functions like these (you'll need to implement them based on your API):
async function createHistory(userId, title) {
    // Implement the API request to create a new history
    // Example:
    const response = await axios.post(`${configpath.apiUrl}/api/history`, {
        user_id: userId,
        title: title,
    })
    return response.data // Return the created history object
}

async function createChat(question, answers, userChoice, historyId) {
    // Implement the API request to create a new chat
    // Example:
    // console.log("query is " + question)
    // console.log("answers is " + answers)
    // console.log("userChoice is " + userChoice)
    // console.log("historyId is " + historyId)
    const response = await axios.post(`${configpath.apiUrl}/api/chat`, {
        query: question,
        answer: answers,
        userChoice: userChoice,
        history_id: historyId,
    })
    // console.log("4:++++++++++++++++++" + JSON.stringify(response, null, 2))
    return response.data // Return the created chat object
}
async function addChatToHistory(historyId, chatId) {
    // Implement the API request to add a chat to the history
    const response = await axios.put(`${configpath.apiUrl}/api/history/${historyId}`, {
        chat_id: chatId,
    })
    return response // Return the updated history object
}
// Answer is a
// The chooseAnswer function
async function chooseAnswer(question, answers, llm_id, historyId = -1, historyTitle = '', userId) {
    let currentHistoryId

    if (historyId === -1) {
        const newHistory = await createHistory(userId, historyTitle)
        currentHistoryId = newHistory.history_id
    } else {
        currentHistoryId = historyId
    }

    try {
        const chatResponse = await createChat(question, answers, llm_id, currentHistoryId)
        let newChatId = chatResponse.chat.chatid
        console.log('newChatId', newChatId)
        await addChatToHistory(currentHistoryId, newChatId)
    } catch (error) {
        console.error('Error in chooseAnswer:', error)
    }
}

// get a user's chat history

async function getChatHistory(userId) {
    try {
        // Step 1: Get the user's history objects
        const historyResponse = await axios.get(`${configpath.apiUrl}/api/history?user_id=${userId}`)
        let histories = historyResponse.data.history

        // Step 2: Retrieve chat objects for each history
        for (let curhistory of histories) {
            const chats_objects = await axios.get(`${configpath.apiUrl}/api/chat?history_id=${curhistory._id}`)
            curhistory.chats = chats_objects.data.chats
        }
        // for (let curhistory of histories) {
        //     let chatObjects = []
        //     for (let chatId of curhistory.history) {
        //         const chatResponse = await axios.get(`${configpath.apiUrl}/api/chat?history_id=${curhistory._id}`) // 这里改成historyid
        //         chatObjects.push(chatResponse.data.chats)
        //     }

        //     // Step 3: Attach chat objects to the history object
        //     curhistory.chats = chatObjects
        // }

        return histories
    } catch (error) {
        console.error('Error in getChatHistory:', error)
        throw error // Rethrow error to handle it in the calling context
    }
}

async function downloadChatHistory(historyId) {
    try {
        // Step 1: Get chatIds from the history
        const historyResponse = await axios.get(`${configpath.apiUrl}/api/history/${historyId}`)
        const chatIds = historyResponse.data.history

        // Step 2: Fetch chat content for each chatId
        const chatContentPromises = chatIds.map(async (chatId) => {
            const chatResponse = await axios.get(`${configpath.apiUrl}/api/chat/${chatId}`)
            return chatResponse.data
        })

        // Step 3: Wait for all chat content to be fetched
        const chatContents = await Promise.all(chatContentPromises)

        // Step 4: Combine chat content into a JSON object
        const combinedChatContent = {
            title: historyResponse.data.title,
            chats: chatContents,
        }

        // Step 5: Convert JSON object to a Blob
        const blob = new Blob([JSON.stringify(combinedChatContent)], { type: 'application/json' })

        // Step 6: Create a download link and trigger download
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `chat_history_${historyId}.json`
        document.body.appendChild(link)
        link.click()

        // Step 7: Clean up
        document.body.removeChild(link)
        return { success: true, message: 'Download successful' }
    } catch (error) {
        console.error('Error in downloadChatHistory:', error)
        throw error
    }
}

async function uploadChatHistory(history_json, userId) {
    console.log('1:+++++++++' + JSON.stringify(history_json, null, 2))
    try {
        const history_id = await createHistory(userId, history_json.title)
        const chatResults = []
        for (const chatData of history_json.chats) {
            // console.log("2:+++++++++" + JSON.stringify(chatData, null, 2))
            // console.log("query is " + chatData.chat_in_history.query)
            // console.log("answers is " + chatData.chat_in_history.answer)
            // console.log("userChoice is " + chatData.chat_in_history.userChoice)
            // console.log("historyId is " + history_id.history_id)
            const result = await createChat(chatData.chat_in_history.query, chatData.chat_in_history.answer, chatData.chat_in_history.userChoice, history_id.history_id)
            // console.log("3:+++++++++" + JSON.stringify(result, null, 2))
            console.log('3:+++++++++' + JSON.stringify(result, null, 2))
            const response = await addChatToHistory(history_id.history_id, result.chat.chatid)
            // chatResults.push(response)
            // console.log("4:+++++++++" + JSON.stringify(response, null, 2))
            console.log('4:+++++++++' + JSON.stringify(response, null, 2))
        }
        return { success: true, message: 'Upload successful', chatResults }
    } catch (error) {
        console.error('Error uploading chat history:', error.message)
        return { success: false, message: 'Error uploading chat history', error: error.message }
    }
}

export { postUserQuery, createHistory, createChat, chooseAnswer, getChatHistory, downloadChatHistory, uploadChatHistory }
