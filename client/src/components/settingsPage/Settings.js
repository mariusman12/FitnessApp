import { React, useReducer, useEffect, useState } from 'react'
import { exercises } from '../../infoexercises'
import '../productremove/styles/productRemovingWindow.css'
import '../productadd/styles/productAddingWindow.css'
import { connect } from 'react-redux'

import axios from 'axios'

import {
  handleOpening,
  resetOptionsStates,
  saveSettingsToDatabase,
  restoreSettingFromDatabase,
  confirmClearAllProducts,
  cancelClearAllProducts,
  confirmClearAllSeries,
  cancelClearAllSeries,
  handleSettingsSaved,
  handleSettingsCanceled,
  handleExerciseChoosing,
  handleSettingOnChange,
  updateTrainingList,
  setSettingsChangedState,
} from '../../actions/settingsAction'

const ACTIONS = {
  CATEGORY_OPENED_NEGATE: 'CATEGORY_OPENED_NEGATE',
  SETTINGS_DATA_CHANGE: 'SETTINGS_DATA_CHANGE',
  SETTINGS_LOAD: 'SETTINGS_LOAD',
  CLEAR_ALL_PRODUCTS_SET: 'CLEAR_ALL_PRODUCTS_SET',
  CLEAR_ALL_SERIES_SET: 'CLEAR_ALL_SERIES_SET',
  EXERCISE_TO_SELECTED_EXERCISES_ADD: 'EXERCISE_TO_SELECTED_EXERCISES_ADD',
  EXERCISE_FROM_SELECTED_EXERCISES_REMOVE:
    'EXERCISE_FROM_SELECTED_EXERCISES_REMOVE',
  SETTINGS_CHANGED_STATE_SET: 'SETTINGS_CHANGED_STATE_SET',
  NUTRITION_SETTINGS_TO_INITIAL_RESET: 'NUTRITION_SETTINGS_TO_INITIAL_RESET',
  TRAINING_SETTINGS_TO_INITTIAL_RESET: 'TRAINING_SETTINGS_TO_INITTIAL_RESET',
  TRAINING_LIST_UPDATE: 'TRAINING_LIST_UPDATE',
}

function Settings(props) {
  let state = props.settings

  const {
    handleOpening,
    resetOptionsStates,
    saveSettingsToDatabase,
    restoreSettingFromDatabase,
    confirmClearAllProducts,
    cancelClearAllProducts,
    confirmClearAllSeries,
    cancelClearAllSeries,
    handleSettingsSaved,
    handleSettingsCanceled,
    handleExerciseChoosing,
    handleSettingOnChange,
    updateTrainingList,
    setSettingsChangedState,
  } = props
  const initialOptionsStates = {
    'clear-all-products': false,
    'reset-nutrition-to-initial': false,
    'clear-all-series': false,
    'reset-training-to-initial': false,
  }

  const [optionsStates, setOptionsStates] = useState(initialOptionsStates)

  useEffect(() => {
    restoreSettingFromDatabase()
  }, [])

  useEffect(() => {
    const uniqueList = []
    state.settingsData.training.selectedExercises.forEach((id) => {
      if (id == 3 || id == 4 || !uniqueList.includes(id)) {
        uniqueList.push(id)
      }
    })
    updateTrainingList(uniqueList)
  }, [state.settingsData.training.selectedExercises.length])

  useEffect(() => {
    if (state.clearAllProducts || state.clearAllSeries) {
      const confirmWindow = document.querySelector('.removing-window__confirm')
      confirmWindow.style.pointerEvents = 'auto'
    }
  }, [state.clearAllProducts, state.clearAllSeries])

  useEffect(() => {
    const changePointerEvents = (value) => {
      const meals = document.querySelectorAll('.meal')
      const wrapper = document.querySelector('.wrapper')
      const center = document.querySelector('.center-section')

      meals.forEach((meal) => {
        let buttons = meal.querySelector('.meal__buttons-section')
        buttons.style.pointerEvents = value
        wrapper.style.pointerEvents = value

        value === 'none'
          ? (center.style.overflowY = 'hidden')
          : (center.style.overflowY = 'auto')
      })
    }

    state.clearAllProducts || state.clearAllSeries
      ? changePointerEvents('none')
      : changePointerEvents('auto')
  }, [state.clearAllProducts, state.clearAllSeries])

  useEffect(() => {
    props.updateGauges(props.home)
  }, [state.settingsData])

  useEffect(async () => {
    const response = await axios.get('/api/setting')

    const databaseSettings = response.data.setting.setting

    const currentSettings = JSON.stringify(state.settingsData)

    if (databaseSettings === currentSettings) setSettingsChangedState(false)
    else setSettingsChangedState(true)
  }, [state.settingsData])

  const handleCheckboxOnClick = (e) => {
    setOptionsStates((prevOptions) => {
      return { ...prevOptions, [e.target.id]: !optionsStates[e.target.id] }
    })
  }

  return (
    <>
      <div
        className='meal'
        style={
          ((state.category == 'Nutrition') & state.isCategoryOpenedNutrition) |
          ((state.category == 'Training') & state.isCategoryOpenedTraining)
            ? { left: '-10px' }
            : { left: '0px' }
        }
      >
        <section
          className='meal__top-section'
          onClick={() => {
            handleOpening(props.category)
          }}
        >
          <h2 className='meal__top-section__meal-title'>{props.category}</h2>
        </section>

        <section
          className='meal__products-section meal__products-section--settings'
          style={
            (state.isCategoryOpenedNutrition &
              (props.category === 'Nutrition')) |
            (state.isCategoryOpenedTraining & (props.category === 'Training'))
              ? { display: 'flex' }
              : { display: 'none' }
          }
        >
          {props.category === 'Nutrition' && (
            <section className='center-section__main__settings'>
              {state.clearAllProducts && (
                <section className='removing-window__confirm'>
                  <h1 className='removing-window__title'>Clear all?</h1>

                  <h3 className='removing-window__confirm__subtitle'>
                    Are you sure you want to clear all products?
                  </h3>

                  <section
                    className='removing-window__main__list__buttons-section'
                    style={{ justifyContent: 'flex-end' }}
                  >
                    <div>
                      <button
                        className='removing-window__main__list__buttons-section__secondary'
                        onClick={cancelClearAllProducts}
                      >
                        Cancel
                      </button>
                      <button
                        className='removing-window__main__list__buttons-section__primary'
                        onClick={() => {
                          confirmClearAllProducts(props)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </section>
                </section>
              )}

              <form
                className='adding-window__main__form'
                onSubmit={(e) => {
                  handleSettingsSaved(e, optionsStates, props, state)
                }}
              >
                <section className='adding-window__main__form adding-window__main__form--daily-demand'>
                  <h3 className='adding-window__main__form__title'>
                    Daily demand
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className='adding-window__main__form__line adding-window__main__form__line--short'>
                      <label
                        className='adding-window__main__form__line__label'
                        htmlFor='proteins'
                      >
                        Proteins
                      </label>
                      <input
                        className='adding-window__main__form__line__input'
                        type='text'
                        id='proteins'
                        value={
                          state.settingsData.nutrition.dailyDemand.proteins
                        }
                        onChange={(e) => {
                          handleSettingOnChange(e, props)
                        }}
                        placeholder='Proteins'
                        maxLength='4'
                      ></input>
                      <span className='adding-window__main__form__line__decoration'>
                        g
                      </span>
                      {}
                    </div>

                    <div className='adding-window__main__form__line adding-window__main__form__line--short'>
                      <label
                        className='adding-window__main__form__line__label'
                        htmlFor='fats'
                      >
                        Fats
                      </label>
                      <input
                        className='adding-window__main__form__line__input'
                        type='text'
                        id='fats'
                        value={state.settingsData.nutrition.dailyDemand.fats}
                        onChange={(e) => {
                          handleSettingOnChange(e, props)
                        }}
                        placeholder='Fats'
                        maxLength='4'
                      ></input>
                      <span className='adding-window__main__form__line__decoration'>
                        g
                      </span>
                      {}
                    </div>

                    <div className='adding-window__main__form__line adding-window__main__form__line--short'>
                      <label
                        className='adding-window__main__form__line__label'
                        htmlFor='Carbs'
                      >
                        Carbs
                      </label>
                      <input
                        className='adding-window__main__form__line__input'
                        type='text'
                        id='Carbs'
                        onChange={(e) => {
                          handleSettingOnChange(e, props)
                        }}
                        value={state.settingsData.nutrition.dailyDemand.carbs}
                        placeholder='Carbs'
                        maxLength='4'
                      ></input>
                      <span className='adding-window__main__form__line__decoration'>
                        g
                      </span>
                    </div>

                    <div className='adding-window__main__form__line adding-window__main__form__line--short'>
                      <label
                        className='adding-window__main__form__line__label'
                        htmlFor='kcal'
                      >
                        Calories
                      </label>
                      <input
                        className='adding-window__main__form__line__input'
                        type='text'
                        id='kcal'
                        value={state.settingsData.nutrition.dailyDemand.kcal}
                        onChange={(e) => {
                          handleSettingOnChange(e, props)
                        }}
                        placeholder='Calories'
                        maxLength='4'
                      ></input>
                      <span className='adding-window__main__form__line__decoration'>
                        kcal
                      </span>
                      {}
                    </div>
                  </div>
                </section>

                <section className='adding-window__main__form adding-window__main__form--meals'>
                  <h3 className='adding-window__main__form__title'>Meals</h3>

                  <div className='adding-window__main__form__line adding-window__main__form__line--short'>
                    <label
                      className='adding-window__main__form__line__label'
                      htmlFor='setMealsNumber'
                    >
                      Number of meals
                    </label>

                    <input
                      className='adding-window__main__form__line__input'
                      type='text'
                      id='setMealsNumber'
                      value={state.settingsData.nutrition.numberOfMeals}
                      onChange={(e) => {
                        handleSettingOnChange(e, props)
                      }}
                      maxLength='1'
                    ></input>
                    <span className='adding-window__main__form__line__decoration'>
                      meals
                    </span>
                    {}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}
                  >
                    {Object.values(
                      state.settingsData.nutrition.namesOfMeals
                    ).map((meal, index) => {
                      if (state.settingsData.nutrition.numberOfMeals > index) {
                        return (
                          <div
                            key={index}
                            className='adding-window__main__form__line adding-window__main__form__line--normal'
                          >
                            <label
                              className='adding-window__main__form__line__label'
                              htmlFor='editMealName'
                            >{`Meal no. ${index + 1} name: `}</label>
                            <input
                              className='adding-window__main__form__line__input'
                              data-key={index}
                              type='text'
                              id='editMealName'
                              value={
                                state.settingsData.nutrition.namesOfMeals[index]
                              }
                              onChange={(e) => {
                                handleSettingOnChange(e, props)
                              }}
                              required
                            ></input>
                            {}
                          </div>
                        )
                      } else {
                        return null
                      }
                    })}
                  </div>
                </section>

                <section className='adding-window__main__form adding-window__main__form--options'>
                  <h3 className='adding-window__main__form__title'>Options</h3>

                  <div className='adding-window__main__form__line adding-window__main__form__line--checkbox'>
                    <label
                      className='adding-window__main__form__line__label adding-window__main__form__line__label--options'
                      htmlFor='clearAllProducts'
                    >
                      Clear all products
                    </label>
                    <button
                      className='adding-window__main__form__background'
                      id='clear-all-products'
                      type='button'
                      onClick={handleCheckboxOnClick}
                    >
                      <div
                        className='adding-window__main__form__background__checked'
                        id='clear-all-products'
                        style={
                          optionsStates['clear-all-products']
                            ? { backgroundColor: '#08c096' }
                            : { backgroundColor: 'transparent' }
                        }
                      ></div>
                    </button>
                  </div>
                </section>

                <section
                  className='meal__buttons-section meal__buttons-section--settings'
                  style={
                    (state.isCategoryOpenedNutrition &
                      (props.category === 'Nutrition')) |
                    (state.isCategoryOpenedTraining &
                      (props.category === 'Training'))
                      ? { display: 'flex' }
                      : { display: 'none' }
                  }
                >
                  <div>
                    <button
                      className={
                        state.isSettingsChanged
                          ? 'meal__buttons-section__remove-button'
                          : 'meal__buttons-section__remove-button meal__buttons-section__remove-button--disabled'
                      }
                      onClick={(e) => {
                        handleSettingOnChange(e, props)
                      }}
                      type='button'
                      disabled={state.isSettingsChanged ? false : true}
                    >
                      Cancel
                    </button>

                    <button
                      className='meal__buttons-section__add-button'
                      type='submit'
                      value='Save'
                      id='saveSettings'
                    >
                      Save
                    </button>
                  </div>
                </section>
              </form>
            </section>
          )}

          {props.category === 'Training' && (
            <section className='center-section__main__settings'>
              {state.clearAllSeries && (
                <section className='removing-window__confirm'>
                  <h1 className='removing-window__title'>Clear all?</h1>

                  <h3 className='removing-window__confirm__subtitle'>
                    Are you sure you want to clear all series?
                  </h3>

                  <section
                    className='removing-window__main__list__buttons-section'
                    style={{ justifyContent: 'flex-end' }}
                  >
                    <div>
                      <button
                        className='removing-window__main__list__buttons-section__secondary'
                        onClick={cancelClearAllSeries}
                      >
                        Cancel
                      </button>
                      <button
                        className='removing-window__main__list__buttons-section__primary'
                        onClick={confirmClearAllSeries}
                      >
                        Remove
                      </button>
                    </div>
                  </section>
                </section>
              )}

              <form
                className='center-section__main__settings__form'
                onSubmit={(e) => {
                  handleSettingsSaved(e, optionsStates, props, state)
                }}
              >
                <section className='adding-window__main__form adding-window__main__form--exercises'>
                  <h3 className='adding-window__main__form__title'>
                    Choose exercises
                  </h3>
                  {exercises.map((exercise) => {
                    return (
                      <div
                        key={exercise.id}
                        className='adding-window__main__form__line adding-window__main__form__line--checkbox'
                      >
                        <label
                          className='adding-window__main__form__line__label adding-window__main__form__line__label--options'
                          htmlFor={'exercise' + exercise.id}
                        >
                          {exercise.name}:
                        </label>
                        <button
                          className='adding-window__main__form__background'
                          id={'exercise' + exercise.id}
                          type='button'
                          onClick={handleExerciseChoosing}
                        >
                          <div
                            className='adding-window__main__form__background__checked'
                            id={'exercise' + exercise.id}
                            style={
                              state.settingsData.training.selectedExercises.includes(
                                exercise.id
                              )
                                ? { backgroundColor: '#08c096' }
                                : { backgroundColor: 'transparent' }
                            }
                          ></div>
                        </button>
                      </div>
                    )
                  })}
                </section>

                <section className='adding-window__main__form adding-window__main__form--options'>
                  <h3 className='adding-window__main__form__title'>Options</h3>

                  <div className='adding-window__main__form__line adding-window__main__form__line--checkbox'>
                    <label
                      className='adding-window__main__form__line__label adding-window__main__form__line__label--options'
                      htmlFor='clear-all-series'
                    >
                      Clear all series
                    </label>
                    <button
                      className='adding-window__main__form__background'
                      id='clear-all-series'
                      type='button'
                      onClick={handleCheckboxOnClick}
                    >
                      <div
                        className='adding-window__main__form__background__checked'
                        id='clear-all-series'
                        style={
                          optionsStates['clear-all-series']
                            ? { backgroundColor: '#08c096' }
                            : { backgroundColor: 'transparent' }
                        }
                      ></div>
                    </button>
                  </div>
                </section>

                <section
                  className='meal__buttons-section meal__buttons-section--settings'
                  style={
                    (state.isCategoryOpenedNutrition &
                      (props.category === 'Nutrition')) |
                    (state.isCategoryOpenedTraining &
                      (props.category === 'Training'))
                      ? { display: 'flex' }
                      : { display: 'none' }
                  }
                >
                  <div>
                    <button
                      className={
                        state.isSettingsChanged
                          ? 'meal__buttons-section__remove-button'
                          : 'meal__buttons-section__remove-button meal__buttons-section__remove-button--disabled'
                      }
                      onClick={(e) => {
                        handleSettingsCanceled(e, props, optionsStates)
                      }}
                      type='button'
                      disabled={state.isSettingsChanged ? false : true}
                    >
                      Cancel
                    </button>

                    <button
                      className='meal__buttons-section__add-button'
                      type='submit'
                      value='Save'
                      id='saveSettings'
                    >
                      Save
                    </button>
                  </div>
                </section>
              </form>
            </section>
          )}
        </section>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  home: state.home,
  settings: state.settings,
})

export default connect(mapStateToProps, {
  handleOpening,
  resetOptionsStates,
  saveSettingsToDatabase,
  restoreSettingFromDatabase,
  confirmClearAllProducts,
  cancelClearAllProducts,
  confirmClearAllSeries,
  cancelClearAllSeries,
  handleSettingsSaved,
  handleSettingsCanceled,
  handleExerciseChoosing,
  handleSettingOnChange,
  updateTrainingList,
  setSettingsChangedState,
})(Settings)
