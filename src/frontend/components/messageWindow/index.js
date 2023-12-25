import React, { useState, useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const MessageWindow = ({ message, messageType, onClose }) => {
    const DELAY = 3000
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (message) {
            setShow(true)

            const timeout = setTimeout(() => {
                setShow(false)
                onClose()
            }, DELAY)

            return () => clearTimeout(timeout)
        }
    }, [message, onClose])

    return (
        <ToastContainer className="p-3 toast-container" position="top-start">
            <Toast onClose={() => setShow(false)} show={show} delay={DELAY} autohide>
                <Toast.Header>
                    <strong className={`mr-auto ${messageType === 'error' ? 'text-danger' : 'text-success'}`}>{messageType === 'error' ? 'Error' : 'Success'}</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default MessageWindow
