import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { logout } from '../../actions/authAction'
import './navbar.css'

function Navbar({ auth: { isAuthenticated, loading, user }, logout }) {
  const authLinks = (
    <ul className='nav-collection'>
      <li className='nav-item'>
        <a className='nav-link' href='/'>
          Home
        </a>
      </li>

      <li className='nav-item'>
        <a className='nav-link' href='/beginnerPlan'>
          Beginner Plans
        </a>
      </li>
      <li className='nav-item'>
        <a className='nav-link' href='/dailydiet'>
          Daily Diet
        </a>
      </li>
      <li className='nav-item'>
        <a className='nav-link' href='/login' onClick={logout}>
          LogOut
        </a>
      </li>
    </ul>
  )
  const guestLinks = (
    <ul className='nav-collection'>
      <li className='nav-item'>
        <a className='nav-link' href='/'>
          Home
        </a>
      </li>

      <li className='nav-item'>
        <a className='nav-link' href='/beginnerPlan'>
          Beginner Plans
        </a>
      </li>
      <li className='nav-item'>
        <a className='nav-link' href='/login'>
          Login
        </a>
      </li>
      <li className='nav-item signup'>
        <a className='nav-link signup' href='/signup'>
          Signup
        </a>
      </li>
    </ul>
  )
  return (
    <div className='container'>
      <nav>
        <h2
          style={{ fontSize: '22px', fontWeight: 'bold' }}
          className='brand-logo'
        >
          Your
          <span
            style={{ fontSize: '22px', fontWeight: 'bold' }}
            className='next-color'
          >
            Solution
          </span>
        </h2>

        {!loading && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
      </nav>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)
