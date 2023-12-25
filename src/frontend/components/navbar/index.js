import React, { useState, useEffect,Component } from 'react'
import Typical from 'react-typical'

import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import logo from '../../assets/logo.ico'
import SignIn from '../signin'
import Register from '../register'
import Reset from '../resetpassword'
import './style.css'

function AppNavbar({ setUserId, handleFeedback, setHistoryId, handleChatHistoryRetrieval }) {
    const [hasSignedIn, setHasSignedIn] = useState(false)
    const [showSignInModal, setShowSignInModal] = useState(false)
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)

    useEffect(() => {
        const userId = localStorage.getItem('userId')

        if (userId) {
            setHasSignedIn(true)
        }
    }, [])

    const handleShowModal = (modalType) => {
        switch (modalType) {
            case 'signIn':
                setShowSignInModal(true)
                break
            case 'register':
                setShowRegisterModal(true)
                break
            case 'reset':
                setShowResetModal(true)
                break
            default:
                break
        }
    }

    const handleCloseModal = (modalType) => {
        switch (modalType) {
            case 'signIn':
                setShowSignInModal(false)
                break
            case 'register':
                setShowRegisterModal(false)
                break
            case 'reset':
                setShowResetModal(false)
                break
            default:
                break
        }
    }

    const handleSignout = () => {
        setHasSignedIn(false)
        localStorage.clear()
        setHistoryId('initialValue')
        // handleChatHistoryRetrieval(
        window.location.reload()
        navigation('/')
        handleFeedback('success', 'Signed out successfully!')
    }

    const navigation = useNavigate()
    const username = localStorage.getItem('userName')

    return (
        <Navbar bg="dark" variant="dark" className="top-navbar">
            <Container>
                {/* logo */}
                <Navbar.Brand href="/" className="mx-auto">
                    <img alt="Logo" src={logo} width="30" height="30" className="d-inline-block align-top" />
                    <Typical
                        steps={['Convo', 1000, 'ConvoGenius Hub', 5000]}
                        loop={Infinity}
                        wrapper="p"
                        className='typical'
                    />
                </Navbar.Brand>

                {/* dropdown */}
                <Nav>
                    <NavDropdown title={<span className="user-dropdown">Welcome!&nbsp;&nbsp;{username}</span>} id="basic-nav-dropdown">
                        {!hasSignedIn && <NavDropdown.Item onClick={() => handleShowModal('signIn')}>Sign In</NavDropdown.Item>}
                        {!hasSignedIn && <NavDropdown.Item onClick={() => handleShowModal('register')}>Register</NavDropdown.Item>}
                        {hasSignedIn && <NavDropdown.Item onClick={() => handleShowModal('reset')}>Reset Password</NavDropdown.Item>}

                        <NavDropdown.Divider />

                        {hasSignedIn && <NavDropdown.Item onClick={handleSignout}>Sign Out</NavDropdown.Item>}
                    </NavDropdown>
                </Nav>
            </Container>

            <SignIn show={showSignInModal} handleClose={() => handleCloseModal('signIn')} setUserId={setUserId} setHasSignedIn={setHasSignedIn} handleFeedback={handleFeedback} />
            <Reset show={showResetModal} handleClose={() => handleCloseModal('reset')} handleFeedback={handleFeedback} />
            <Register show={showRegisterModal} handleClose={() => handleCloseModal('register')} setUserId={setUserId} setHasSignedIn={setHasSignedIn} handleFeedback={handleFeedback} />
        </Navbar>
    )
}

export default AppNavbar
