import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { login } from '../../actions/authAction'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import spinner from '../../img/spinner.gif'

import './auth.css'

const Login = ({ login, isAuthenticated }) => {
  const [showGif, setShowGif] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setShowGif(true)
    login(email, password, setShowGif)
  }

  if (isAuthenticated) return <Redirect to='/' />
  return (
    <div className='login-form'>
      <div className='form'>
        <form className='myform' onSubmit={(e) => onSubmit(e)}>
          <p className='form-title'>Sign Into Your Account</p>

          <div className='input-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='input-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              minLength='6'
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>

          <button type='submit' className='btn btn-primary'>
            Log In
            {}
            <img
              src={spinner}
              style={{
                display: showGif ? 'inline-block' : 'none',

                marginLeft: '7px',
                width: '35px',
                height: '35px',
              }}
            />
          </button>
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/signup'>SIGN UP</Link>
        </p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})
Login.prototypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

export default connect(mapStateToProps, { login })(Login)
