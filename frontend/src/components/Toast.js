import { createContext, useContext, useState } from 'react'
import { Toast } from 'react-bootstrap'

const ToastContext = createContext()

export const useToastContext = () => useContext(ToastContext)

export default function ToastProvider({children}) {
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')
  return (
    <ToastContext.Provider value={{ show, setShow, text, setText }}>
      <Toast onClose={() => setShow(false)} show={show} delay={2500} autohide variant="success">
        <Toast.Body>{text || 'Something went wrong, please try again.'}</Toast.Body>
      </Toast>
      {children}
    </ToastContext.Provider>
  )
}
