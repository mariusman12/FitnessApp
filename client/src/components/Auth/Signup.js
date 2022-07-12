import React, { Fragment, useState } from 'react'

import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { setAlert } from '../../actions/alertAction'
import { register } from '../../actions/authAction'

import spinner from '../../img/spinner.gif'

import PropTypes from 'prop-types'

const Signup = ({ setAlert, register, isAuthenticated }) => {
  const [showGif, setShowGif] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    age: '',
    height: '',
    weight: '',
  })
  const { name, email, password, passwordConfirm, age, height, weight } =
    formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      setAlert('Password donot match', 'danger')
    } else {
      setShowGif(true)

      register(
        name,
        email,
        password,
        passwordConfirm,
        age,
        height,
        weight,
        setShowGif
      )
    }
  }

  if (isAuthenticated) return <Redirect to='/' />
  return (
    <div className='signup-form'>
      <div className='form'>
        <form className='myform' onSubmit={(e) => onSubmit(e)}>
          <p className='form-title'>Register your account</p>

          <div className='input-group'>
            <input
              type='text'
              placeholder='Your Name'
              name='name'
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
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
          <div className='input-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='passwordConfirm'
              minLength='6'
              value={passwordConfirm}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='hwdatas'>
            <div className='input-group'>
              <input
                type='number'
                placeholder='Your age'
                name='age'
                value={age}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='number'
                placeholder='Your height (in feet)'
                name='height'
                value={height}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='input-group'>
              <input
                type='number'
                placeholder='Your weight (in kgs)'
                name='weight'
                minLength='6'
                value={weight}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
          </div>

          <button type='submit' className='btn btn-primary'>
            Sign Up
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
          Already have an account? <Link to='/login'>LOG IN</Link>
        </p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

Signup.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
export default connect(mapStateToProps, { setAlert, register })(Signup)
