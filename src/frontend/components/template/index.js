import React, { useState, useEffect } from 'react'

import { Modal, Button, Form, Accordion, Card, Alert } from 'react-bootstrap'

import { createTemplate, updateTemplate, deleteTemplate } from '../../../middleware/template'
import './style.css'

const TemplateModal = ({ show, handleClose, templates, handleTemplatesChanges, handleFeedback }) => {
    const [text, setText] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [templateTitle, setTemplateTitle] = useState('')
    const [templateContent, setTemplateContent] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        if (show) {
            handleTemplatesChanges()
        }
    }, [show])

    const handleCreate = () => {
        setTemplateTitle('')
        setTemplateContent('')
        setIsCreating(true)
        handleTemplatesChanges()
    }

    const handleSaveNewTemplate = async () => {
        const existingTemplate = templates.find((t) => t.title === templateTitle)
        if (existingTemplate) {
            alert('Template with the same title already exists. Please choose a different title.')
            return
        }
        await createTemplate({ title: templateTitle, content: templateContent, user_id: userId })

        setIsCreating(false)
        handleTemplatesChanges()
        handleFeedback('success', 'Created new template successfully!')
    }

    const handleSave = async (template) => {
        await updateTemplate({ _id: template._id, title: template.title, content: text })
        handleTemplatesChanges()
        handleFeedback('success', 'Saved template successfully!')
    }

    const handleDelete = async (templateId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this template?')

        if (isConfirmed) {
            await deleteTemplate({ _id: templateId })
            handleTemplatesChanges()
            handleFeedback('success', 'Deleted template successfully!')
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>My Templates of Prompts</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        execution succeed
                    </Alert>
                )}
                {isCreating ? (
                    <div>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="title" placeholder="Enter title" value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control type="content" placeholder="Enter content" value={templateContent} onChange={(e) => setTemplateContent(e.target.value)} />
                        </Form.Group>
                        <div className="buttonstyle">
                            <Button variant="primary" onClick={handleSaveNewTemplate}>
                                Save
                            </Button>
                            <Button variant="primary" onClick={() => { setIsCreating(false) }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='template-list'>
                        {templates.map((template) => (
                            <Card>
                                <Card.Body>
                                    <div className="title-row">
                                        <Card.Title>{template.title}</Card.Title>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => {
                                                handleDelete(template._id)
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Contents</Accordion.Header>
                                            <Accordion.Body>
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    <Form.Control as="textarea" rows={3} value={text || template.content} onChange={(e) => setText(e.target.value)} />
                                                </Form.Group>
                                                <Button
                                                    variant="success"
                                                    onClick={() => {
                                                        handleSave(template)
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        ))}
                        <Card bg="dark">
                            <Card.Body>
                                <Button variant="outline-light" onClick={handleCreate}>
                                    Create New Template
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default TemplateModal
