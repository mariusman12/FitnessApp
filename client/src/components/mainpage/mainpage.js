import React from 'react'
import { connect } from 'react-redux'
import { handleMenu } from '../../actions/homeActions'
import './styles/mainpage.css'

const MenuItem = (props) => {
  const handleClick = (e) => {
    e.preventDefault()
    props.handleMenu(e.target.title, props.home)
  }

  return (
    <li className='left-section__menu-container__list-item'>
      <a
        className={
          props.isActive
            ? 'left-section__menu-container__list-item__content left-section__menu-container__list-item__content--active'
            : 'left-section__menu-container__list-item__content'
        }
        onClick={handleClick}
        href={props.href}
        title={props.value}
      >
        {props.value}
      </a>
    </li>
  )
}

const mapStateToProps = (state) => ({
  home: state.home,
})

export default connect(mapStateToProps, { handleMenu })(MenuItem)
