import { Link } from 'wouter'

const Header = ({ path = 'home' }: { path: 'archieved' | 'home' }) => {
  function render () {
    switch (path) {
      case 'home':
        return (
          <>
            <h1 className='text-3xl'>My notes</h1>
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
    <div className='flex place-items-baseline gap-10 py-5'>
      {render()}
    </div>
  )
}

export default Header
