import React, { useState } from 'react'
import spinner from '../../img/spinner.gif'
import axios from 'axios'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alertAction'

function ContactForm(props) {
  const [showGif, setShowGif] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const { name, email, phone, message } = formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setShowGif(true)

    axios
      .post('/sendmail', {
        mail: { name, email, phone, message },
      })
      .then((response) => {
        props.setAlert(response.data.message, 'success')
        setShowGif(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      })
      .catch((err) => {
        console.log(err)
        setShowGif(false)
      })
  }

  return (
    <div
      className='signup-form'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '50px',
      }}
    >
      <div style={{ marginTop: '-60px' }} className='form'>
        <form className='myform' onSubmit={(e) => onSubmit(e)}>
          <p className='form-title'>
            Have some queries? <br /> You got us.
          </p>

          <div className='input-group'>
            <input
              id='name'
              type='text'
              placeholder='Your Name'
              name='name'
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className='input-group'>
            <input
              id='email'
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className='input-group'>
            <input
              id='phone'
              type='text'
              placeholder='Phone (optional)'
              name='phone'
              minLength='8'
              value={phone}
              onChange={onChange}
            />
          </div>
          <div className='input-group'>
            <textarea
              placeholder='Enter Message'
              value={message}
              onChange={onChange}
              name='message'
              id='message'
              cols='30'
              rows='10'
              required
            />
          </div>

          <button type='submit' className='btn btn-primary'>
            Send
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
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  alert: state.alert,
})
export default connect(mapStateToProps, { setAlert })(ContactForm)
