import React from 'react'

type Props = {
  children: React.ReactNode
  onClose: () => void
}

const Modal = ({ children, onClose }: Props) => {
  return (
    <div className='absolute inset-0 z-[100] pt-[20vh]'>
      <div className='absolute inset-0 -z-10 bg-black/50' onClick={onClose} />
      <div className='mx-auto w-full max-w-xl overflow-hidden rounded-lg border bg-white shadow-lg'>
        {children}
      </div>
    </div>
  )
}

export default Modal
