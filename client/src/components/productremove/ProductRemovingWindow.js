import { React, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import '../styles/window/window.css'

export default function RemoveWindow(props) {
  const [isRemovingAllButtonPressed, setRemovingAllButtonPressed] =
    useState(false)
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false)

  useEffect(() => {
    const removingWindow = document.querySelector('.window')

    if (isRemovingAllButtonPressed) {
      removingWindow.style.filter = 'blur(5px) opacity(40%) grayscale(100%)'
      removingWindow.style.pointerEvents = 'none'
    } else {
      removingWindow.style.filter = 'blur(0px) opacity(100%) grayscale(0%)'
      removingWindow.style.pointerEvents = 'auto'
    }
  }, [isRemovingAllButtonPressed])

  useEffect(() => {
    const wrapper = document.querySelector('#root')

    wrapper.style.filter = 'blur(5px) opacity(40%) grayscale(100%)'
    wrapper.style.pointerEvents = 'none'

    return () => {
      wrapper.style.filter = 'blur(0px) opacity(100%) grayscale(0%)'
      wrapper.style.pointerEvents = 'auto'
    }
  }, [])

  useEffect(() => {
    handleRemoveButtonDisabling()
  }, [])

  const handleSelected = (e) => {
    const item = document.getElementById(e.currentTarget.id)

    if (e.currentTarget.id) {
      const itemName = item.querySelector(
        '.window__main__section__large-list__item__name'
      )

      if (itemName.style.fontWeight === 'bold') {
        item.style.background = '#ffffff'
        itemName.style.fontWeight = 'normal'
      } else {
        item.style.background = '#60dbbf'
        itemName.style.fontWeight = 'bold'
      }

      handleRemoveButtonDisabling()
    }
  }

  const handleRemoveButton = () => {
    const selectedIds = []
    const items = document.querySelectorAll(
      '.window__main__section__large-list__item'
    )

    items.forEach((item) => {
      const name = item.querySelector(
        '.window__main__section__large-list__item__name'
      )
      if (name.style.fontWeight === 'bold') selectedIds.push(Number(item.id))
    })

    if (selectedIds.length !== 0) props.handleRemoving(selectedIds)
  }

  const handleRemoveButtonDisabling = () => {
    const items = document.querySelectorAll(
      '.window__main__section__large-list__item'
    )
    let returnedBoolean = false

    for (let i = 0; i < items.length; i++) {
      const name = items[i].querySelector(
        '.window__main__section__large-list__item__name'
      )
      if (name.style.fontWeight === 'bold') {
        returnedBoolean = false
        break
      } else returnedBoolean = true
    }
    setIsRemoveButtonDisabled(returnedBoolean)
  }

  const handleRemovingAllButton = () => {
    setRemovingAllButtonPressed(true)
  }

  const handleRemovingAllCancel = () => {
    setRemovingAllButtonPressed(false)
  }

  const handleRemovingAllConfirm = () => {
    const selectedIds = []
    const items = document.querySelectorAll(
      '.window__main__section__large-list__item'
    )

    items.forEach((item) => {
      selectedIds.push(Number(item.id))
    })

    props.handleRemoving(selectedIds)
  }

  return ReactDOM.createPortal(
    <>
      <section className='window'>
        <header className='window__header'>
          <h1 className='window__header__heading'>
            {props.type === 'exercises' ? 'Remove serie' : 'Remove aliment'}
          </h1>
        </header>

        <main className='window__main window__main--list'>
          <ul className='window__main__section__large-list window__main__section__large-list--heading'>
            <li className='window__main__section__large-list__item window__main__section__large-list__item--heading'>
              {props.type === 'exercises' ? (
                <div className='window__main__section__large-list__wrapper'>
                  <span
                    className='window__main__section__large-list__item__name'
                    style={{ color: 'white' }}
                  >
                    Serie
                  </span>
                  <span className='window__main__section__large-list__item__nutrition-facts'>
                    <p className='window__main__section__large-list__item__nutrition-facts__weight'>
                      Weight
                    </p>
                  </span>
                  <span className='window__main__section__large-list__item__calories'>
                    Number of repetitions
                  </span>
                </div>
              ) : (
                <div className='window__main__section__large-list__wrapper'>
                  <span
                    className='window__main__section__large-list__item__name'
                    style={{ color: 'white' }}
                  >
                    Aliment name
                  </span>
                  <span className='window__main__section__large-list__item__nutrition-facts'>
                    <p
                      className='window__main__section__large-list__item__nutrition-facts__proteins'
                      title='Proteins'
                    >
                      Protein
                    </p>
                    <p
                      className='window__main__section__large-list__item__nutrition-facts__fats'
                      title='Fats'
                    >
                      Fats
                    </p>
                    <p
                      className='window__main__section__large-list__item__nutrition-facts__carbs'
                      title='Carbohydrates'
                    >
                      Carbs
                    </p>
                  </span>
                  <span className='window__main__section__large-list__item__calories'>
                    Calories
                  </span>
                </div>
              )}
            </li>
          </ul>

          <ul className='window__main__section__large-list'>
            {props.list.map((item) => {
              return props.type === 'exercises' ? (
                <li
                  onClick={handleSelected}
                  id={item.id}
                  key={item.id}
                  className='window__main__section__large-list__item'
                >
                  <div className='window__main__section__large-list__wrapper'>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__name'
                    >
                      Serie {item.serieCount}
                    </span>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__nutrition-facts'
                    >
                      <p
                        id={item.id}
                        className='window__main__section__large-list__item__nutrition-facts__weight'
                        title='Weight'
                      >
                        {item.weight} kg
                      </p>
                    </span>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__calories'
                    >
                      {item.reps} reps
                    </span>
                  </div>
                </li>
              ) : (
                <li
                  onClick={handleSelected}
                  id={item.id}
                  key={item.id}
                  className='window__main__section__large-list__item'
                >
                  <div className='window__main__section__large-list__wrapper'>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__name'
                    >
                      {item.name}
                    </span>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__nutrition-facts'
                    >
                      <p
                        id={item.id}
                        className='window__main__section__large-list__item__nutrition-facts__proteins'
                        title='Proteins'
                      >
                        {item.proteins} g
                      </p>
                      <p
                        id={item.id}
                        className='window__main__section__large-list__item__nutrition-facts__fats'
                        title='Fats'
                      >
                        {item.fats} g
                      </p>
                      <p
                        id={item.id}
                        className='window__main__section__large-list__item__nutrition-facts__carbs'
                        title='Carbohydrates'
                      >
                        {item.carbs} g
                      </p>
                    </span>
                    <span
                      id={item.id}
                      className='window__main__section__large-list__item__calories'
                    >
                      {item.kcal} kcal
                    </span>
                  </div>
                  <span
                    id={item.id}
                    className='window__main__section__large-list__item__weight'
                  >
                    {item.weight} g
                  </span>
                </li>
              )
            })}
          </ul>
        </main>

        <section className='window__bottom'>
          <button
            className='window__bottom__tertiary-button'
            onClick={handleRemovingAllButton}
          >
            Remove all
          </button>
          <div>
            <button
              className='window__bottom__secondary-button'
              onClick={props.handleRemoveWindow}
            >
              Cancel
            </button>
            <button
              className={
                isRemoveButtonDisabled
                  ? 'window__bottom__primary-button window__bottom__primary-button--disabled'
                  : 'window__bottom__primary-button'
              }
              onClick={handleRemoveButton}
            >
              Remove
            </button>
          </div>
        </section>
      </section>

      {isRemovingAllButtonPressed ? (
        <section className='window window--login'>
          <header className='window__header'>
            <h2 className='window__header__heading'>Remove all?</h2>
          </header>

          <main className='window__main'>
            <h3 className='window__main__message'>
              {props.type === 'exercises'
                ? 'Are you sure you want to remove all series in current exercise?'
                : 'Are you sure you want to remove all products in current meal?'}
            </h3>
          </main>

          <section className='window__bottom'>
            <button
              className='window__bottom__secondary-button'
              onClick={handleRemovingAllCancel}
            >
              Cancel
            </button>
            <button
              className='window__bottom__primary-button'
              onClick={handleRemovingAllConfirm}
            >
              Remove
            </button>
          </section>
        </section>
      ) : null}
    </>,
    document.getElementById('portal')
  )
}
