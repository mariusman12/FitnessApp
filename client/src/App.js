import React, { Fragment, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Signup from './components/Auth/Signup'
import { Provider } from 'react-redux'
import store from './store'
import Navbar from './components/navigationbar/Navbar'
import Login from './components/Auth/Login'
import Alert from './components/alert/Alert'
import setAuthToken from './Utils/setAuthToken'
import { loaduser } from './actions/authAction'
import BeginnerPlan from './components/beginnerPlans/BeginnerPlan'
import Dailydiet from './components/daylidiet/DailyDiet'
if (localStorage.token) setAuthToken(localStorage.token)

function App() {
  useEffect(() => {
    store.dispatch(loaduser())
  })
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Alert />
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />

          <Route exact path='/signup' component={Signup} />
          <Route exact path='/beginnerPlan' component={BeginnerPlan} />
          <Route exact path='/dailydiet' component={Dailydiet} />
        </Fragment>
      </BrowserRouter>
    </Provider>
  )
}

export default App
