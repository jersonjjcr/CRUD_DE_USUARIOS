import './Modal.css'

function Modal ({ open, setOpen, title = 'Modal', children }) {

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <div className={`modal ${open ? 'show-modal' : ''}`}>
      <div className='modal-overlay' onClick={closeModal} />
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title'>{title}</h2>
          <button onClick={closeModal}>close</button>
        </div>
        <div className='modal-body'>
          {children}
        </div>
      </div>

    </div>
  )
}
export default Modal