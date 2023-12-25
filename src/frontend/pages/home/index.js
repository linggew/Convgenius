import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar'
import InputBox from '../../components/inputbox'
import AppNavbar from '../../components/navbar'
import './style.css'

import { getTemplateDetails } from '../../../middleware/template'
import { getChatHistory, postUserQuery } from '../../../middleware/llm/llm_module'
import MessageWindow from '../../components/messageWindow'
import Chat from '../../components/chat'

export const Home = () => {
    const [userId, setUserId] = useState([])

    const [histories, setHistories] = useState([])
    const [historyId, setHistoryId] = useState('initialValue')

    const [userChoice, setUserChoice] = useState(null)
    const [query, setQuery] = useState('')
    const [answers, setAnswers] = useState([])

    const [templates, setTemplates] = useState([])

    const handleTemplatesChanges = async () => {
        const response = await getTemplateDetails(localStorage.getItem('userId'))
        console.log('kkkkkkkk++++++++++here is two' + JSON.stringify(response, null, 2))
        if (response) {
            setTemplates(response.prompts || [])
        }
        console.log('here')
    }

    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    const handleChatHistoryRetrieval = () => {
        getChatHistory(localStorage.getItem('userId'))
            .then((data) => {
                setHistories(data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    const handleFeedback = (type, content) => {
        setMessage(content)
        setMessageType(type)
    }

    useEffect(() => {
        // Implement fetching of chat history here
        handleChatHistoryRetrieval()
        handleTemplatesChanges()
    }, [userId])

    const handleAnswer = async (query) => {
        try {
            setQuery(query)
            const llm_responses = await postUserQuery(query)
            console.log('llm_responses: ', llm_responses)
            setAnswers(llm_responses)
        } catch (error) {
            console.error('Error fetching answers:', error)
            setMessage('Failed to fetch answers')
            setMessageType('error')
        }
    }

    return (
        <>
            <MessageWindow message={message} messageType={messageType} onClose={() => setMessage('')} />
            
            <AppNavbar setUserId={setUserId} handleFeedback={handleFeedback} setHistoryId={setHistoryId} handleChatHistoryRetrieval={handleChatHistoryRetrieval} />

            <div className="mc-block">
                <Sidebar
                    histories={histories}
                    setHistories={setHistories}
                    handleFeedback={handleFeedback}
                    historyId={historyId}
                    setHistoryId={setHistoryId}
                    handleChatHistoryRetrieval={handleChatHistoryRetrieval}
                    setQuery={setQuery}
                    setAnswers={setAnswers}
                />

                {/* Conditional rendering of InputBox */}
                {historyId !== 'initialValue' && <InputBox handleAnswer={handleAnswer} templates={templates} handleTemplatesChanges={handleTemplatesChanges} handleFeedback={handleFeedback} />}

                <Chat historyId={historyId} userChoice={userChoice} setUserChoice={setUserChoice} query={query} setQuery={setQuery} answers={answers} setAnswers={setAnswers} />
            </div>
        </>
    )
}
