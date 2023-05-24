/* eslint-disable react/jsx-closing-tag-location */
import { Link, useLocation } from 'wouter'
import Button from './Button'
import { useData } from '../context/DataContext'

const Header = ({ path = 'home' }: { path: 'archieved' | 'home' }) => {
  const { user, setUserToken } = useData()
  const [, setLocation] = useLocation()
  function render () {
    switch (path) {
      case 'home':
        return (
          <>
            <h1 className='text-3xl'>My notes</h1>
            <Link href='/new' className=''>
              <Button>
                Create Note
              </Button>
            </Link>
            <Link href='/archieved' className='text-blue-500 underline'>
              Archieved notes
            </Link>
          </>
        )
      case 'archieved':
        return (
          <>
            <h1 className='text-3xl'>Archieved notes</h1>
            <Link href='/' className='text-blue-500 underline'>
              {'<'} Go back to unarchieved notes
            </Link>
          </>
        )
    }
  }

  function logout () {
    setUserToken(undefined)
  }

  console.log(user)

  return (
    <div className='flex justify-between'>
      <div className='flex min-h-[80px] flex-col gap-2 py-5 md:flex-row md:items-center md:gap-10'>
        {render()}
      </div>
      <div className='flex items-center gap-4'>
        {!user
          ? <Button className='cursor-pointer' onClick={() => setLocation('/login')}>Login</Button>
          : <>
            <p className='cursor-pointer text-3xl' title='logout' onClick={logout}>🚪🚶‍♂️</p>
            <img
              src={`https://api.dicebear.com/5.x/initials/jpg?seed=${user.email}`} alt='User profile picture'
              className='aspect-square w-10 rounded-full'
            />
          </>}
      </div>
    </div>
  )
}

export default Header
