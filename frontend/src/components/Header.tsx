import { Link } from 'wouter'
import Button from './Button'

const Header = ({ path = 'home' }: { path: 'archieved' | 'home' }) => {
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

  return (
    <div className='flex min-h-[80px] flex-col gap-2 py-5 md:flex-row md:items-center md:gap-10'>
      {render()}
    </div>
  )
}

export default Header
