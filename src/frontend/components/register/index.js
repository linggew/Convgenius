import React, { useState } from 'react'

import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

import './style.css'
import configpath from '../../configpath'

const Register = ({ show, handleClose, setUserId, setHasSignedIn, handleFeedback }) => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post(configpath.apiUrl + '/api/user', {
                email,
                username,
                password,
            })

            // Set the success message
            handleFeedback('success', response.data.message)

            // Sign in users
            localStorage.setItem('userId', response.data.userWithoutPassword._id)
            localStorage.setItem('userName', response.data.userWithoutPassword.username)
            setUserId(response.data.userWithoutPassword._id)
            setHasSignedIn(true)

            handleClose()
        } catch (error) {
            // Set the error message
            if (error.response && error.response.data && error.response.data.message) {
                handleFeedback('error', error.response.data.message)
            } else {
                handleFeedback('error', 'Failed to sign up. Please try again...')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Required fields */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        Register
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default Register
