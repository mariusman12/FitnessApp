import { memo, React, useEffect, useReducer } from 'react'
import './style/exercise.css'
import './../meal/styles/meal.css'
import '../productadd/styles/productAddingWindow.css'
import AddWindow from '../productadd/ProductAddingWindow'
import RemoveWindow from '../productremove/ProductRemovingWindow'
import MoreWindow from '../MoreWindowComponent/MoreWindow'
import { connect } from 'react-redux'
import axios from 'axios'

const ACTIONS = {
  EXERCISE_OPEN_NEGATE: 'EXERCISE_OPEN_NEGATE',
  WINDOW_ADD_STATE_NEGATE: 'WINDOW_ADD_STATE_NEGATE',
  WINDOW_REMOVE_STATE_NEGATE: 'WINDOW_REMOVE_STATE_NEGATE',
  WINDOW_MORE_STATE_NEGATE: 'WINDOW_MORE_STATE_NEGATE',
  SERIELIST_SORT: 'SERIELIST_SORT',
  SERIE_NEW_DATA_CHANGE: 'SERIE_NEW_DATA_CHANGE',
  LASTTIME_DATA_UPDATE: 'LASTTIME_DATA_UPDATE',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
  SERIE_ADD: 'SERIE_ADD',
  SERIE_REMOVE: 'SERIE_REMOVE',
  SERIE_TO_SERIELIST_ADD: 'SERIE_TO_SERIELIST_ADD',
  SERIELIST_BEFORE_DAY_CHANGING_CLEAR: 'SERIELIST_BEFORE_DAY_CHANGING_CLEAR',
  NEW_SERIE_LIST_ADD: 'NEW_SERIE_LIST_ADD',
}

export const warnings = {
  weight: 'Weight must be a positive number',
  reps: 'Reps must be a positive number',
}

function Exercise(props) {
  const { home } = props
  const initialState = {
    isExerciseOpened: false,
    isAddWindowOpened: false,
    isRemoveWindowOpened: false,
    isMoreWindowOpened: false,
    lastTimeData: {
      training: { weight: 'First time', reps: 'First time' },
      serie: { weight: 'First time', reps: 'First time' },
    },
    seriesList: [],
    warning: ['', ''],
    newSerie: {
      id: 0,
      exerciseId: props.exerciseId,
      trainingId: 0,
      dateIds: { dayId: 0, monthId: 0, yearId: 0 },
      serieCount: '',
      weight: '',
      reps: '',
    },
  }

  const getPreviousTrainingDate = (previousDateIds) => {
    const isLeapYear = () => {
      if (
        (previousDateIds.yearId % 4 === 0 &&
          previousDateIds.yearId % 100 !== 0) ||
        previousDateIds.yearId % 400 === 0
      )
        return true
      else return false
    }
    const isDayFirstInMonth = () => {
      if (previousDateIds.dayId === 1) return true
      else return false
    }
    const isDayFirstInJanuary = () => {
      if (previousDateIds.dayId === 1 && previousDateIds.monthId === 1)
        return true
      else return false
    }
    const isDayFirstInMarch = () => {
      if (previousDateIds.dayId === 1 && previousDateIds.monthId === 3)
        return true
      else return false
    }
    const isDayFirstIn30DayMonths = () => {
      if (
        previousDateIds.dayId === 1 &&
        (previousDateIds.monthId === 4 ||
          previousDateIds.monthId === 6 ||
          previousDateIds.monthId === 8 ||
          previousDateIds.monthId === 9 ||
          previousDateIds.monthId === 11)
      )
        return true
      else return false
    }

    let potentialPreviousDateIds = { dayId: 0, monthId: 0, yearId: 0 }

    if (isDayFirstInJanuary()) {
      potentialPreviousDateIds.dayId = 31
      potentialPreviousDateIds.monthId = 12
      potentialPreviousDateIds.yearId = previousDateIds.yearId - 1
    } else if (isDayFirstInMarch()) {
      if (isLeapYear()) potentialPreviousDateIds.dayId = 29
      else potentialPreviousDateIds.dayId = 28

      potentialPreviousDateIds.monthId = 2
      potentialPreviousDateIds.yearId = previousDateIds.yearId
    } else if (isDayFirstIn30DayMonths()) {
      potentialPreviousDateIds.dayId = 31
      potentialPreviousDateIds.monthId = previousDateIds.monthId - 1
      potentialPreviousDateIds.yearId = previousDateIds.yearId
    } else if (isDayFirstInMonth()) {
      potentialPreviousDateIds.dayId = 30
      potentialPreviousDateIds.monthId = previousDateIds.monthId - 1
      potentialPreviousDateIds.yearId = previousDateIds.yearId
    } else {
      potentialPreviousDateIds.dayId = previousDateIds.dayId - 1
      potentialPreviousDateIds.monthId = previousDateIds.monthId
      potentialPreviousDateIds.yearId = previousDateIds.yearId
    }

    return potentialPreviousDateIds
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.NEW_SERIE_LIST_ADD:
        return { ...state, seriesList: action.payload }
      case ACTIONS.EXERCISE_OPEN_NEGATE: {
        return { ...state, isExerciseOpened: !state.isExerciseOpened }
      }

      case ACTIONS.WINDOW_ADD_STATE_NEGATE: {
        return { ...state, isAddWindowOpened: !state.isAddWindowOpened }
      }

      case ACTIONS.WINDOW_REMOVE_STATE_NEGATE: {
        return { ...state, isRemoveWindowOpened: !state.isRemoveWindowOpened }
      }

      case ACTIONS.WINDOW_MORE_STATE_NEGATE: {
        return { ...state, isMoreWindowOpened: !state.isMoreWindowOpened }
      }

      case ACTIONS.SERIE_NEW_DATA_CHANGE: {
        switch (action.payload.key) {
          case 'weight':
            return {
              ...state,
              newSerie: { ...state.newSerie, weight: action.payload.value },
            }
          case 'reps':
            return {
              ...state,
              newSerie: { ...state.newSerie, reps: action.payload.value },
            }
        }
      }

      case ACTIONS.SERIE_ADD: {
        return {
          ...state,
          newSerie: {
            id: 0,
            exerciseId: props.exerciseId,
            dateIds: { dayId: 0, monthId: 0, yearId: 0 },
            serieCount: '',
            weight: '',
            reps: '',
          },
          seriesList: [...action.payload],
        }
      }

      case ACTIONS.SERIE_REMOVE: {
        return { ...state, seriesList: action.payload }
      }

      case ACTIONS.SET_WARNING: {
        switch (action.payload) {
          case 'weight':
            return { ...state, warning: [warnings.weight, action.payload] }
          case 'reps':
            return { ...state, warning: [warnings.reps, action.payload] }
        }
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload] }
      }

      case ACTIONS.SERIE_TO_SERIELIST_ADD: {
        return { ...state, seriesList: [...state.seriesList, action.payload] }
      }

      case ACTIONS.SERIELIST_SORT: {
        let serieCount = 1
        const updatedSeriesList = []

        while (updatedSeriesList.length !== state.seriesList.length) {
          state.seriesList.forEach((serie) => {
            serie.serieCount = serieCount
            updatedSeriesList.push(serie)
            serieCount = serieCount + 1
          })
        }

        return { ...state, seriesList: [...updatedSeriesList] }
      }

      case ACTIONS.SERIELIST_BEFORE_DAY_CHANGING_CLEAR: {
        return { ...state, seriesList: [] }
      }

      case ACTIONS.LASTTIME_DATA_UPDATE: {
        let currentlyAddingSerieNumber = 0
        let indexOfLastSerie = 0
        let updatedLastSerieData = {
          weight: 'First serie',
          reps: 'First serie',
        }
        let updatedLastTrainingData = {
          weight: 'First Workout',
          reps: 'First Workout',
        }

        if (state.seriesList.length !== 0) {
          state.seriesList.forEach((serie, index) => {
            if (serie.serieCount > currentlyAddingSerieNumber) {
              currentlyAddingSerieNumber = serie.serieCount
              indexOfLastSerie = index
            }
          })

          updatedLastSerieData = {
            weight: state.seriesList[indexOfLastSerie].weight,
            reps: state.seriesList[indexOfLastSerie].reps,
          }
        }

        const potentialSeries = []
        let previousTrainingSerie = {}
        let previousDateIds = props.dateIds

        setTimeout(async () => {
          const response = await axios.get('/api/item')

          const items = response.data.items
          items.forEach((item) => {
            let value = JSON.parse(item.item)

            if (value.exerciseId === props.exerciseId) {
              if (value.serieCount === currentlyAddingSerieNumber + 1) {
                if (
                  (value.dateIds.dayId < props.dateIds.dayId &&
                    value.dateIds.monthId < props.dateIds.monthId &&
                    value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId < props.dateIds.dayId &&
                    value.dateIds.monthId === props.dateIds.monthId &&
                    value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId >= props.dateIds.dayId &&
                    value.dateIds.monthId < props.dateIds.monthId &&
                    value.dateIds.yearId === props.dateIds.yearId) ||
                  (value.dateIds.dayId >= props.dateIds.dayId &&
                    value.dateIds.monthId >= props.dateIds.monthId &&
                    value.dateIds.yearId < props.dateIds.yearId)
                )
                  potentialSeries.push(value)
              }
            }
          })

          if (potentialSeries.length !== 0) {
            while (true) {
              previousDateIds = getPreviousTrainingDate(previousDateIds)

              potentialSeries.forEach((serie) => {
                if (
                  JSON.stringify(previousDateIds) ===
                  JSON.stringify(serie.dateIds)
                )
                  previousTrainingSerie = serie
              })

              if (previousTrainingSerie.weight !== undefined) {
                updatedLastTrainingData = {
                  weight: previousTrainingSerie.weight,
                  reps: previousTrainingSerie.reps,
                }
                break
              }
            }
          }
        })

        return {
          ...state,
          lastTimeData: {
            training: updatedLastTrainingData,
            serie: updatedLastSerieData,
          },
        }
      }

      default:
        return console.error(`Unknown action type: ${action.type}`)
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(async () => {
    const response = await axios.put('/api/item/getItems', {
      parentId: props.exerciseId,
      dateIds: JSON.stringify(props.dateIds),
      itemType: 'exercise',
    })

    const items = response.data.items

    items.forEach((item) => {
      let value = JSON.parse(item.item)

      dispatch({ type: ACTIONS.SERIE_TO_SERIELIST_ADD, payload: value })
      dispatch({ type: ACTIONS.SERIELIST_SORT })
    })
  }, [props.dateIds])

  useEffect(() => {
    return () => dispatch({ type: ACTIONS.SERIELIST_BEFORE_DAY_CHANGING_CLEAR })
  }, [props.dateIds])

  useEffect(() => {
    const uniqueListIds = []
    const uniqueList = []
    state.seriesList.map((serie) => {
      if (!uniqueListIds.includes(serie.id)) {
        uniqueListIds.push(serie.id)

        uniqueList.push(serie)
      } else {
        serie.serieCount--
      }
      dispatch({ type: ACTIONS.NEW_SERIE_LIST_ADD, payload: uniqueList })
    })
  }, [state.seriesList.length])

  useEffect(() => {
    props.updateGauges(home)
  }, [home.dateIds])

  useEffect(() => {
    const disableVisibilityIfEnabled = (state, action) => {
      if (state) dispatch({ type: action })
    }

    disableVisibilityIfEnabled(
      state.isExerciseOpened,
      ACTIONS.EXERCISE_OPEN_NEGATE
    )
    disableVisibilityIfEnabled(
      state.isAddWindowOpened,
      ACTIONS.WINDOW_ADD_STATE_NEGATE
    )
    disableVisibilityIfEnabled(
      state.isRemoveWindowOpened,
      ACTIONS.WINDOW_REMOVE_STATE_NEGATE
    )
    disableVisibilityIfEnabled(
      state.isMoreWindowOpened,
      ACTIONS.WINDOW_MORE_STATE_NEGATE
    )
  }, [props.dateIds])

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

    state.isAddWindowOpened ||
    state.isRemoveWindowOpened ||
    state.isMoreWindowOpened
      ? changePointerEvents('none')
      : changePointerEvents('auto')
  }, [
    state.isAddWindowOpened,
    state.isRemoveWindowOpened,
    state.isMoreWindowOpened,
  ])

  useEffect(() => {
    if (state.isAddWindowOpened)
      dispatch({ type: ACTIONS.LASTTIME_DATA_UPDATE })
    countProgress()
  }, [state.isAddWindowOpened])

  const handleExerciseOpening = () => {
    dispatch({ type: ACTIONS.EXERCISE_OPEN_NEGATE })
  }

  const handleAddWindow = () => {
    dispatch({ type: ACTIONS.WINDOW_ADD_STATE_NEGATE })
  }

  const handleRemoveWindow = () => {
    dispatch({ type: ACTIONS.WINDOW_REMOVE_STATE_NEGATE })
  }

  const handleMoreWindow = () => {
    dispatch({ type: ACTIONS.WINDOW_MORE_STATE_NEGATE })
  }

  const countProgress = async () => {
    const potentialTrainings = []
    const lastTrainingData = []
    let message = {}
    let percentValue = 0
    let progressValue = 0
    let previousDateIds = props.dateIds

    const response = await axios.get('/api/item')

    const items = response.data.items
    items.forEach((item) => {
      let value = JSON.parse(item.item)

      if (value.exerciseId === props.exerciseId) {
        if (
          (value.dateIds.dayId < props.dateIds.dayId &&
            value.dateIds.monthId < props.dateIds.monthId &&
            value.dateIds.yearId === props.dateIds.yearId) ||
          (value.dateIds.dayId < props.dateIds.dayId &&
            value.dateIds.monthId === props.dateIds.monthId &&
            value.dateIds.yearId === props.dateIds.yearId) ||
          (value.dateIds.dayId >= props.dateIds.dayId &&
            value.dateIds.monthId < props.dateIds.monthId &&
            value.dateIds.yearId === props.dateIds.yearId) ||
          (value.dateIds.dayId >= props.dateIds.dayId &&
            value.dateIds.monthId >= props.dateIds.monthId &&
            value.dateIds.yearId < props.dateIds.yearId)
        )
          potentialTrainings.push(value)
      }
    })

    if (potentialTrainings.length !== 0) {
      while (true) {
        previousDateIds = getPreviousTrainingDate(previousDateIds)

        potentialTrainings.forEach((training) => {
          if (
            JSON.stringify(previousDateIds) === JSON.stringify(training.dateIds)
          )
            lastTrainingData.push(training)
        })

        if (lastTrainingData.length !== 0) break
      }
    }

    const lastTrainingTotal = countTotalWeight(lastTrainingData)
    const currentTrainingTotal = countTotalWeight(state.seriesList)

    progressValue = currentTrainingTotal - lastTrainingTotal

    if (lastTrainingTotal)
      percentValue = ((progressValue / lastTrainingTotal) * 100).toFixed(2)
    else percentValue = ''

    if (lastTrainingTotal > 0) {
      if (progressValue > 0) {
        message.top = `${progressValue.toFixed(2)} kg more`
        message.bottom = `${percentValue}% more than last time`
      } else if (progressValue === 0) {
        message.top = 'The same result as last time'
        message.bottom = ''
      } else {
        progressValue *= -1
        percentValue *= -1
        message.top = `${progressValue.toFixed(2)} kg less`
        message.bottom = `${percentValue}% less than last time`
      }
    } else {
      message.top = "First Workout, don't give up!"
      message.bottom = ''
    }

    return message
  }

  const handleFormClearing = () => {
    dispatch({
      type: ACTIONS.SERIE_NEW_DATA_CHANGE,
      payload: { key: 'weight', value: '' },
    })
    dispatch({
      type: ACTIONS.SERIE_NEW_DATA_CHANGE,
      payload: { key: 'reps', value: '' },
    })
  }

  const handleOnChange = (e) => {
    const isNumber = /[0-9]/
    const isZero = /^[0]{1}/

    const setValueAsNull = () => {
      dispatch({
        type: ACTIONS.SERIE_NEW_DATA_CHANGE,
        payload: { key: e.target.id, value: '' },
      })
      dispatch({ type: ACTIONS.SET_WARNING, payload: e.target.id })
    }

    const setValueAsCorrect = () => {
      dispatch({
        type: ACTIONS.SERIE_NEW_DATA_CHANGE,
        payload: { key: e.target.id, value: e.target.value },
      })
      dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id })
    }

    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      if (isZero.test(e.target.value)) setValueAsNull()
      else setValueAsCorrect()
    } else {
      setValueAsNull()
    }
  }

  const countTotalWeight = (seriesList) => {
    let totalWeight = 0

    seriesList.forEach((serie) => {
      totalWeight += Number(serie.weight) * Number(serie.reps)
    })

    return totalWeight
  }

  const countTotalReps = (seriesList) => {
    let totalReps = 0

    seriesList.forEach((serie) => {
      totalReps += Number(serie.reps)
    })

    return totalReps
  }

  const handleSerieAdding = (e) => {
    e.preventDefault()
    setTimeout(() => {
      const updatedSeriesList = state.seriesList
      let serieCount = 1

      state.newSerie.id = Date.now()
      state.newSerie.dateIds = props.dateIds
      updatedSeriesList.push(state.newSerie)

      updatedSeriesList.forEach((serie) => {
        serie.serieCount = serieCount
        serieCount++
        console.log(serieCount)
      })

      axios.post('/api/item', {
        itemId: state.newSerie.id,
        item: JSON.stringify(state.newSerie),
        parentId: props.exerciseId,
        dateIds: JSON.stringify(props.dateIds),
        itemType: 'exercise',
      })

      dispatch({ type: ACTIONS.SERIE_ADD, payload: updatedSeriesList })
    }, 10)
    dispatch({ type: ACTIONS.WINDOW_ADD_STATE_NEGATE })
  }

  const handleSerieRemoving = (checkedIdsList) => {
    let updatedSeriesList = state.seriesList

    let serieCount = 1

    checkedIdsList.forEach((checkedId) => {
      updatedSeriesList.forEach((serie, index) => {
        axios.put('/api/item', { itemId: serie.id })
        if (Number(serie.id) === Number(checkedId))
          updatedSeriesList.splice(index, 1)
      })
    })

    updatedSeriesList.forEach((serie) => {
      axios.post('/api/item', {
        itemId: serie.id,
        item: JSON.stringify({ ...serie, serieCount }),
        parentId: props.exerciseId,
        dateIds: JSON.stringify(props.dateIds),
        itemType: 'exercise',
      })
      serieCount += 1
    })

    dispatch({ type: ACTIONS.SERIELIST_SORT })

    dispatch({ type: ACTIONS.SERIE_REMOVE, payload: updatedSeriesList })

    dispatch({ type: ACTIONS.WINDOW_REMOVE_STATE_NEGATE })
  }

  return (
    <div
      className='meal exercise'
      style={state.isExerciseOpened ? { left: '-10px' } : { left: '0px' }}
    >
      <section
        className='meal__top-section exercise__top-section'
        onClick={handleExerciseOpening}
      >
        <h2 className='meal__top-section__meal-title'>{props.name}</h2>

        <div
          className='exercise__top-section__grade-container'
          title='Exercise difficulty'
        ></div>
      </section>

      {state.seriesList.length !== 0 ? (
        <section
          className='meal__products-section exercise__series-section'
          style={
            state.isExerciseOpened ? { display: 'flex' } : { display: 'none' }
          }
        >
          <ul className='exercise__series-section__list'>
            {state.seriesList.map((serie) => {
              return (
                <li
                  key={serie.id}
                  className='exercise__series-section__list__item'
                >
                  <p className='exercise__series-section__list__item__count'>
                    Serie {serie.serieCount}
                  </p>
                  <p className='exercise__series-section__list__item__weight'>
                    {serie.weight} kg
                  </p>
                  <p className='exercise__series-section__list__item__reps'>
                    {serie.reps} reps
                  </p>
                </li>
              )
            })}
          </ul>

          {}
        </section>
      ) : null}

      <section
        className='meal__buttons-section exercise__buttons-section'
        style={
          state.isExerciseOpened ? { display: 'flex' } : { display: 'none' }
        }
      >
        <button
          className='adding-window__main__form__tertiary'
          onClick={handleMoreWindow}
        >
          More
        </button>

        <div>
          <button
            className={
              state.seriesList.length
                ? 'meal__buttons-section__remove-button'
                : 'meal__buttons-section__remove-button--disabled'
            }
            onClick={state.seriesList.length ? handleRemoveWindow : null}
            disabled={
              state.isAddWindowOpened || state.isRemoveWindowOpened
                ? true
                : false
            }
          >
            Remove
          </button>

          <button
            className='adding-window__main__form__primary'
            onClick={handleAddWindow}
            disabled={
              state.isAddWindowOpened || state.isRemoveWindowOpened
                ? true
                : false
            }
          >
            Add
          </button>
        </div>
      </section>

      {state.isAddWindowOpened ? (
        <AddWindow
          type='exercises'
          handleAddWindow={handleAddWindow}
          data={{
            weight: state.newSerie.weight,
            reps: state.newSerie.reps,
          }}
          warning={state.warning}
          handleOnChange={handleOnChange}
          handleFormClearing={handleFormClearing}
          handleSerieAdding={handleSerieAdding}
          lastTimeData={state.lastTimeData}
        />
      ) : null}

      {state.isRemoveWindowOpened ? (
        <RemoveWindow
          type='exercises'
          list={state.seriesList}
          handleRemoving={handleSerieRemoving}
          handleRemoveWindow={handleRemoveWindow}
        />
      ) : null}

      {state.isMoreWindowOpened ? (
        <MoreWindow
          type='exercises'
          title={props.name}
          description={props.description}
          difficulty={props.difficulty}
          typeOfExercise={props.typeOfExercise}
          muscles={props.muscles}
          properFormLink={props.properFormLink}
          handleMoreWindow={handleMoreWindow}
        />
      ) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  home: state.home,
})

export default connect(mapStateToProps)(Exercise)
