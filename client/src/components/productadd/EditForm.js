import { React, useReducer, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import '../styles/window/window.css'
import { connect } from 'react-redux'

import {
  handleResetingForm,
  calculateNutritionFacts,
  handleNameChanging,
  initializeForm,
} from '../../actions/editActions'

function EditForm(props) {
  const {
    handleResetingForm,
    calculateNutritionFacts,
    handleNameChanging,
    initializeForm,
  } = props
  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [isStateEqualToProps, setIsStateEqualToProps] = useState(true)

  useEffect(() => {})

  useEffect(() => {
    const addingWindow = document.querySelector('.window--add')
    addingWindow.style.filter = 'blur(5px) opacity(40%) grayscale(100%)'
    addingWindow.style.pointerEvents = 'none'

    return () => {
      addingWindow.style.filter = 'blur(0px) opacity(100%) grayscale(0%)'
      addingWindow.style.pointerEvents = 'auto'
    }
  }, [])

  let state = props.edit
  let addList = props.addList

  useEffect(() => {
    checkIfFormCompleted()
    checkIfStateIsEqualToProps()
  }, [state.productData])

  useEffect(() => {
    console.log('initializing')
    initializeForm(props)
  }, [])
  const checkIfFormCompleted = () => {
    const name = document.querySelector('#name').value
    const weight = document.querySelector('#weight').value

    if (name && weight) setIsFormCompleted(true)
    else setIsFormCompleted(false)
  }

  const checkIfStateIsEqualToProps = () => {
    Object.keys(props.data).forEach((key) => {
      if (props.data[key] !== state.productData[key])
        setIsStateEqualToProps(false)
    })
  }

  const handleCancelButton = () => {
    const idOfSelectedProduct = props.data.id

    props.handleEditingWindow(idOfSelectedProduct)
  }

  const handleSavingChanges = (e) => {
    e.preventDefault()
    props.handleProductEditing(state.productData, addList)
  }

  return ReactDOM.createPortal(
    <form className='window window--edit' onSubmit={handleSavingChanges}>
      <header className='window__header'>
        <h3 className='window__header__heading'>Edit aliment</h3>
      </header>

      <main className='window__form'>
        <section className='window__main__section window__main__section--form'>
          <h3 className='window__main__section__title'>Aliment info</h3>

          <div className='window__main__input-line'>
            <label className='window__main__input-line__label' htmlFor='name'>
              Aliment name:{' '}
            </label>
            <input
              className='window__main__input-line__input'
              type='text'
              id='name'
              value={state.productData.name}
              onChange={handleNameChanging}
              placeholder={
                state.warning[1] === 'name' ? state.warning[0] : null
              }
              maxLength='32'
            ></input>
          </div>

          <div className='window__main__input-line'>
            <label className='window__main__input-line__label' htmlFor='weight'>
              Aliment weight:{' '}
            </label>
            <input
              className='window__main__input-line__input'
              type='text'
              id='weight'
              value={state.productData.weight}
              onChange={(e) => {
                calculateNutritionFacts(e, props)
              }}
              placeholder={
                state.warning[1] === 'weight' ? state.warning[0] : null
              }
              maxLength='32'
            ></input>
            <span className='window__main__input-line__unit'>g</span>
          </div>
        </section>

        <section className='window__main__section window__main__section--form'>
          <h3 className='window__main__section__title'>Nutrition facts</h3>

          <div className='window__main__input-line'>
            <label
              className='window__main__input-line__label'
              htmlFor='proteins'
            >
              Proteins:{' '}
            </label>
            <p className='window__main__input-line__input' id='proteins'>
              {state.productData.proteins}
            </p>
            <span className='window__main__input-line__unit'>g</span>
          </div>

          <div className='window__main__input-line'>
            <label className='window__main__input-line__label' htmlFor='fats'>
              Fats:{' '}
            </label>
            <p className='window__main__input-line__input' id='fats'>
              {state.productData.fats}
            </p>
            <span className='window__main__input-line__unit'>g</span>
          </div>

          <div className='window__main__input-line'>
            <label className='window__main__input-line__label' htmlFor='carbs'>
              Carbs:{' '}
            </label>
            <p className='window__main__input-line__input' id='carbs'>
              {state.productData.carbs}
            </p>
            <span className='window__main__input-line__unit'>g</span>
          </div>

          <div className='window__main__input-line'>
            <label className='window__main__input-line__label' htmlFor='kcal'>
              Calories:{' '}
            </label>
            <p className='window__main__input-line__input' id='kcal'>
              {state.productData.kcal}
            </p>
            <span className='window__main__input-line__unit'>kcal</span>
          </div>
        </section>
      </main>

      <section className='window__bottom'>
        <button
          className={
            isStateEqualToProps
              ? 'window__bottom__tertiary-button window__bottom__tertiary-button--disabled'
              : 'window__bottom__tertiary-button'
          }
          disabled={isStateEqualToProps ? true : false}
          type='button'
          onClick={(e) => {
            handleResetingForm(e, setIsStateEqualToProps, props)
          }}
        >
          Reset
        </button>

        <div>
          <button
            className='window__bottom__secondary-button'
            type='button'
            onClick={handleCancelButton}
          >
            Cancel
          </button>
          <button
            className={
              isFormCompleted
                ? 'window__bottom__primary-button'
                : 'window__bottom__primary-button window__bottom__primary-button--disabled'
            }
            type='submit'
            disabled={isFormCompleted ? false : true}
          >
            Save
          </button>
        </div>
      </section>
    </form>,
    document.getElementById('portal')
  )
}

const mapStateToProps = (state) => ({
  edit: state.edit,
  addList: state.addList,
})

export default connect(mapStateToProps, {
  handleResetingForm,
  calculateNutritionFacts,
  handleNameChanging,
  initializeForm,
})(EditForm)
