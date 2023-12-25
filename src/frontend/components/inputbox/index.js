import React, { useState, useEffect } from 'react'

import { Button, Dropdown, Form } from 'react-bootstrap'
import { FaArrowUp } from 'react-icons/fa'
import { set } from 'mongoose'

import TemplateModal from '../template'
import './style.css'

const InputBox = ({ handleAnswer, templates, handleTemplatesChanges, handleFeedback }) => {
    const [template, setTemplate] = useState(null)
    const [query, setQuery] = useState(null)

    useEffect(() => {
        handleTemplatesChanges()
    }, [])

    const handleSelectTemplate = (eventKey, event) => {
        setTemplate(eventKey)
    }
    const handleLoadTemplate = () => {
        const selectedTemplate = templates.find((t) => t.title === template)
        if (selectedTemplate) {
            setQuery(selectedTemplate.content)
        }
    }

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleQuerySubmit()
        }
    }

    // click submit buttton
    const handleQuerySubmit = async () => {
        const tempQuery = query
        try {
            setQuery('')
            // Assuming llm_id is obtained or defined elsewhere
            await handleAnswer(query)
            console.log('User Query Value:', query)
        } catch (error) {
            set(tempQuery)
            console.error('Error:', error)
        }
    }

    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const handleShowTemplateModal = () => setShowTemplateModal(true)
    const handleCloseTemplateModal = () => setShowTemplateModal(false)
    const dropdownStyles = {
        dropdownMenu: {
            maxHeight: '200px',
            overflowY: 'auto',
        },
        dropdownManage: {
            color: 'purple',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
        },
    }
    return (
        <div className="fixed-bottom-container">
            <div className="card-container">
                <Dropdown onSelect={handleSelectTemplate}>
                    <Dropdown.Toggle variant="secondary" style={{height: '40px', width: '180px'}}>
                        {template || 'Saved Templates'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropdownStyles.dropdownMenu} className="templatecontainer">
                        {templates.map((template, index) => (
                            <Dropdown.Item eventKey={template.title} key={index}>
                                {template.title}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item onClick={handleShowTemplateModal} style={dropdownStyles.dropdownManage}>
                            Manage Templates
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant="dark" size="sm" className="load-button" style={{ height: '40px', fontSize: 16, width: '180px' }} onClick={handleLoadTemplate}>
                    Load
                </Button>
            </div>
            <div className="textarea-container">
                <Form.Group className="mc">
                    <Form.Control as="textarea" rows={3} placeholder="Ask a question..." value={query || ''} onChange={handleQueryChange} onKeyDown={handleKeyPress} className="input" />
                    <Button variant="dark" type="submit" className="submit-button" onClick={handleQuerySubmit}>
                        <FaArrowUp className="black-and-white-icon" />

                    </Button>
                </Form.Group>
            </div>

            <TemplateModal show={showTemplateModal} handleClose={handleCloseTemplateModal} templates={templates} handleTemplatesChanges={handleTemplatesChanges} handleFeedback={handleFeedback} />
        </div>
    )
}

export default InputBox
