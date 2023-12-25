import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'
import { BsCloudUpload, BsPlusLg, BsDownload, BsXLg } from 'react-icons/bs'
import { Navbar, Nav, Button, Modal, Form } from 'react-bootstrap'

import configpath from '../../configpath'
import './style.css'

const { uploadChatHistory, createHistory, downloadChatHistory, getChatHistory } = require('../../../middleware/llm/llm_module')
const transitionStyle = {
    transition: 'all 0.6s ease-out', // Adjust the duration and timing function as needed
};
const Sidebar = ({ handleFeedback, histories, setHistories, historyId, setHistoryId, handleChatHistoryRetrieval, setQuery, setAnswers }) => {
    const fileInputRef = useRef(null)
    const userid = localStorage.getItem('userId')
    const [isClicked, setIsClicked] = useState([])

    const handleSelectHistory = (index) => {
        setHistoryId(histories[index]._id)
        setQuery('')
        setAnswers([])

        let isClickedArr = Array.from({ length: histories.length }, () => false)
        isClickedArr[index] = true
        setIsClicked(isClickedArr)
    }

    const [showModal, setShowModal] = useState(false)
    const [newChatName, setNewChatName] = useState('')

    const handleNewChatHistory = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setNewChatName('')
    }

    const handleDelete = async (historyId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this history?')

        // if not confirmed, do nothing
        if (!isConfirmed) {
            return
        }

        try {
            await axios.delete(`${configpath.apiUrl}/api/history/${historyId}`)
            handleChatHistoryRetrieval()
            handleFeedback('success', 'Deleted history successfully!')
        } catch (error) {
            handleFeedback('error', 'Error deleting history...')
        }
    }

    const handleCreateNewChat = async () => {
        const userId = localStorage.getItem('userId')
        if (userId && newChatName) {
            try {
                await createHistory(userId, newChatName)

                handleFeedback('success', 'Create chat history successfully!')
                handleChatHistoryRetrieval()
            } catch (error) {
                handleFeedback('error', 'Error creating history...')
            }
        } else {
            handleFeedback('error', 'User ID or Chat Name is missing...')
        }
        // close the modal and clean
        setShowModal(false)
        setNewChatName('')
    }

    const handleDownload = async (historyid) => {
        try {
            const download_response = await downloadChatHistory(historyid)
            if (download_response.message === 'Download successful') {
                handleFeedback('success', 'Download successfully!')
            } else {
                handleFeedback('error', 'Fail to download...')
            }
        } catch (err) {
            handleFeedback('error', 'Fail to fetch history...')
        }
    }

    const handleUploadFile = async () => {
        if (fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0]
            const reader = new FileReader()

            reader.onload = async (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result)
                    // Handle your JSON data here
                    const result = await uploadChatHistory(jsonData, userid)
                    handleFeedback('success', 'Upload history successfully!')
                } catch (error) {
                    handleFeedback('error', 'Error parsing file...')
                } finally {
                    fileInputRef.current.value = ''
                }
                handleChatHistoryRetrieval()
            }

            reader.readAsText(file)
            handleChatHistoryRetrieval()
        } else {
            handleFeedback('error', 'No file selected...')
        }
        handleChatHistoryRetrieval()
    }

    useEffect(() => {
        getChatHistory(localStorage.getItem('userId'))
            .then((data) => {
                setHistories(data)
                setIsClicked(Array.from({ length: data.length }, () => false))
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }, [])

    return (
        <>
            <>
            <Navbar 
    variant="dark" 
    className="sidebar justify-content-center" 
    style={{ backgroundColor: 'rgba(22,22,22,1)', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.6)' }}
>
    {localStorage.getItem('userId') !== null && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', maxWidth: '100%' }}>
            <Nav className="flex-column sidebar-container" style={{ marginTop: "20px", maxWidth: '100%' }}>
                
                            <>
                                <div className="m-3 button-container" >
                                    <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadFile} />
                                    <Button variant="outline-light" size="m" onClick={handleNewChatHistory} className="m-2 flex-grow-0" key="create-history" style={{width: '200px'}}>
                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <BsPlusLg size={24} /><span style={{ marginLeft: '4px', marginRight: '8px'}}>New Chat</span>
                                        </div>
                                    </Button>

                                    <Button variant="outline-light" size="m" onClick={() => fileInputRef.current.click()} className="m-2 flex-grow-0" key="upload-history" style={{width: '200px'}}>
                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                        <BsCloudUpload size={20}/><span style={{ marginLeft: '6px' }}>Upload Chat</span>
                                        </div>
                                    </Button>
                                </div>
                            </>

                            <div style={{marginBottom: '40px'}}></div>

                            {histories.map((history, index) => (
    <div 
    className="button-container" 
    style={{ 
        maxWidth: '100%', 
        alignSelf: 'center', 
        borderRadius: '12px', 
        margin: '6px',
        backgroundColor: isClicked[index] ? 'grey' : 'transparent', 
        ':hover': { // Added hover pseudo-class
            backgroundColor: 'grey', // Background turns grey on hover
        },
    }}
>
        <Button
    variant="outline-light"
    size="sm"
    className={`m-2 flex-grow-0 history-button no-hover-effect`}
    key={`history-${index}-title`}
    onClick={() => handleSelectHistory(index)} 
    style={{ 
        border: 'none',
        ...transitionStyle, // Apply the transition style
        transform: isClicked[index] ? 'translateX(-10px)' : 'translateX(0)' // Move to the left when clicked
    }}
>
    {history.title}
</Button>
        {isClicked[index] && (
        <>
        <Button
            onClick={() => handleDownload(history._id)}
            variant="outline-light"
            size="sm"
            className="m-2 flex-grow-0"
            key={`history-${index}-download`}
        >
            <BsDownload />
        </Button>

        <Button
            variant="outline-light"
            size="sm"
            className="m-2 flex-grow-0"
            key={`history-${index}-delete`}
            onClick={() => handleDelete(history._id)}
        >
            <BsXLg />
        </Button>
        </>
    )}
    </div>
))}

                            </Nav>

<div className="sidebar-text" style={{ margin: '20px', backgroundColor: '#212529', borderRadius: '10px', width: '150px',padding:'10px', alignSelf: 'center' }}>
    Saved chats: {histories.length}
</div>
</div>
)}
</Navbar>
            </>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>New Chat History Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter chat name" value={newChatName} onChange={(e) => setNewChatName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateNewChat}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Sidebar
