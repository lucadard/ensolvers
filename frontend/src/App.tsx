import { Route, Switch } from 'wouter'
import Login from './pages/Login'
import Home from './pages/Home'
import Signup from './pages/Signup'

function App () {
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
