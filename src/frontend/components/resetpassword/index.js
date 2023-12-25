import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import './style.css'
import configpath from '../../configpath'

const Reset = ({ show, handleClose, handleFeedback }) => {
    const [username, setUsername] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const tempUsername = username
        const tempOldPassword = oldPassword
        const tempPewPassword = newPassword
        try {
            const response = await axios.post(configpath.apiUrl + '/api/reset', {
                username,
                oldPassword,
                newPassword,
            })

            // Set the success message
            handleFeedback('success', response.data.message)
            setUsername('')
            setOldPassword('')
            setNewPassword('')
            handleClose()
        } catch (error) {
            // Set the error message
            handleFeedback('error', 'Failed to reset')
            setUsername(tempUsername)
            setOldPassword(tempOldPassword)
            setNewPassword(tempPewPassword)
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Reset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* required fields */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" onClick={handleSubmit}>
                        Reset
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default Reset
