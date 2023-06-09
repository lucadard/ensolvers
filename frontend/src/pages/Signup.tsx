import { useData } from '../context/DataContext'
import { sendLogin, sendSignup } from '../api'
import { useState } from 'react'
import { Link, useLocation } from 'wouter'

const Signup = () => {
  const { setUserToken } = useData()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [,setLocation] = useLocation()

  async function handleFormSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const token = await sendSignup(formData.email, formData.password)
    if (!token) return setErrorMessage('There was an error signing up. Try again')
    setUserToken(token)
    setLocation('/')
  }
  return (
    <div className='pt-[20vh]'>
      <form onSubmit={handleFormSubmit} className='mx-auto max-w-xl px-5'>
        <Link href='/' className='text-gray-500 underline'>{'<'} Back to home</Link>
        <h3 className='mt-5 text-3xl'>Sign up</h3>
        <input
          type='email' placeholder='Email'
          value={formData.email}
          onChange={(e) => {
            setErrorMessage('')
            setFormData(prev => ({ ...prev, email: e.target.value }))
          }}
          className='my-1 w-full p-2'
        />
        <input
          type='password' placeholder='Password'
          value={formData.password}
          onChange={(e) => {
            setErrorMessage('')
            setFormData(prev => ({ ...prev, password: e.target.value }))
          }}
          className='my-1 w-full p-2'
        />
        {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
        <button className='my-1 w-min whitespace-nowrap rounded-full border bg-white/40 px-4 py-2'>Send</button>
        <Link href='/login' className='ml-4 text-blue-600 underline'>or login</Link>
      </form>
    </div>
  )
}

export default Signup
