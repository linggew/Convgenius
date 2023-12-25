import React, { useState } from 'react'

import axios from 'axios'
import { Modal, Button, Form } from 'react-bootstrap'

import configpath from '../../configpath'
import './style.css'

const SignIn = ({ show, handleClose, setUserId, setHasSignedIn, handleFeedback }) => {
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleLogin = async () => {
        try {
            const response = await axios.get(configpath.apiUrl + '/api/user', {
                params: { username: username, password: password },
            })

            if (response.data && response.data.message === 'Login successfully') {
                handleFeedback('success', 'Login successful!')

                localStorage.setItem('userId', response.data.user.userid)
                localStorage.setItem('userName', response.data.user.username)
                setUserId(response.data.user.userid)
                setHasSignedIn(true)
                handleClose()
            } else {
                handleFeedback('error', 'Invalid username or password...')
            }
        } catch (error) {
            handleFeedback('error', 'Login failed. Please try again...')
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* required fields */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Button variant="primary" onClick={handleLogin}>
                        Sign In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default SignIn
