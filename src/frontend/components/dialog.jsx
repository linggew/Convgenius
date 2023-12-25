import React from 'react'
import Modal from 'react-modal'

const SignoutConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Signout Confirmation">
      <div>
        <p>Are you sure you want to sign out?</p>
        <button onClick={onConfirm}>Yes, sign out</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  )
}
export default SignoutConfirmationModal
