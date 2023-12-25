import React, { useState, useEffect } from 'react'
import { Container, Carousel, Button } from 'react-bootstrap'
import userIcon from '../../assets/user.png'
import chatgpt from '../../assets/chatgpt.png'
import llama2 from '../../assets/llama2.png'
import axios from 'axios'
import './style.css'
import { chooseAnswer } from '../../../middleware/llm/llm_module'
import configpath from '../../configpath'

const Chat = ({ historyId, userChoice, setUserChoice, query, answers, setQuery, setAnswers }) => {
    const [history, setHistory] = useState({ chats: [] })
    const [index, setIndex] = useState(0)
    const [showCarousel, setShowCarousel] = useState(true) // State to control Carousel display

    const fetchData = async () => {
        try {
            const response = await axios.get(`${configpath.apiUrl}/api/chat?history_id=${historyId}`)
            const chats = response.data.chats || []
            console.log('fetchData Chats: ', chats)
            console.log('fetchData HistoryId: ', historyId)
            console.log('fetchData query: ', query)
            setHistory({ chats })
            setShowCarousel(true)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [historyId])

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex)
    }

    const handleChooseAnswer = async () => {
        console.log('User choice:', index)
        setUserChoice(index)
        setShowCarousel(false)
        const llm_answers = [answers.ChatGPT_response, answers.Llama2_response, null]
        await chooseAnswer(query, llm_answers, index, historyId)
        setQuery('')
        setAnswers([])
        // reshow
        fetchData()
    }

    return (
        <Container className="mc-container">
            {history.chats.map((chat, chatIndex) => (
                <div key={chatIndex}>
                    {/* Query */}
                    <div className={'message-row query-row'}>
                        <div className="icon-container">
                            <img className="icon" src={userIcon} alt="User Icon" />
                        </div>
                        <div className={'message'}>{chat.query}</div>
                    </div>

                    {/* Answers */}
                    <div className={'message-row answer-row'}>
                        <div className={'message'}>{chat.answer[chat.userChoice]}</div>
                        <div className="icon-container">
                            <img className="icon" src={chat.userChoice === 0 ? chatgpt : llama2} alt="LLM Icon" />
                        </div>
                    </div>
                </div>
            ))}

            {/* For the chat before choosing llm */}
            {query ? (
                <div key={history.chats.length + 1}>
                    {/* Query */}
                    <div className={'message-row query-row'}>
                        <div className="icon-container">
                            <img className="icon" src={userIcon} alt="User Icon" />
                        </div>
                        <div className={'message'}>{query}</div>
                    </div>

                    {/* Answers */}
                    <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" interval={null}>
                        <Carousel.Item>
                            <div className="llm_message-icon-container">
                                <div className="ca-container">
                                    <Button variant="primary" type="submit" className="submit-button" onClick={handleChooseAnswer}>
                                        Select
                                    </Button>
                                </div>
                                <div className={'message'}>{answers.ChatGPT_response}</div>
                                <div className="icon-container">
                                    <img className="icon" src={chatgpt} alt="LLM Icon" />
                                </div>
                            </div>
                        </Carousel.Item>
                        <Carousel.Item>
                            <div className="llm_message-icon-container">
                                <div className="ca-container">
                                    <Button variant="primary" type="submit" className="submit-button" onClick={handleChooseAnswer}>
                                        Select
                                    </Button>
                                </div>
                                <div className={'message'}>{answers.Llama2_response}</div>
                                <div className="icon-container">
                                    <img className="icon" src={llama2} alt="LLM Icon" />
                                </div>
                            </div>
                        </Carousel.Item>
                    </Carousel>
                </div>
            ) : (
                <div></div>
            )}

            {/* PlaceHolder for viewing the last message */}
            {/* <div className={'message-row answer-row'}>
                <div className="icon-container"></div>
                <div className={'message'}> </div>
            </div>
            <div className={'message-row answer-row'}>
                <div className="icon-container"></div>
                <div className={'message'}> </div>
            </div> */}
        </Container>
    )
}

export default Chat
