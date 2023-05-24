import { Route, Switch, useLocation } from 'wouter'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'
import { useEffect } from 'react'
import { useData } from './context/DataContext'

function App () {
  const { user } = useData()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (user) setLocation('/')
  }, [user])

  return (
    <>
      <Switch>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Home />
      </Switch>
    </>
  )
}

export default App
