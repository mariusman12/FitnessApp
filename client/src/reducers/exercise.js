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

const warnings = {
  weight: 'Weight must be a positive number',
  reps: 'Reps must be a positive number',
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
    exerciseId: '',
    trainingId: 0,
    dateIds: { dayId: 0, monthId: 0, yearId: 0 },
    serieCount: '',
    weight: '',
    reps: '',
  },
}

export default function (state = initialState, action) {
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
          exerciseId: '',
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
        })

        serieCount++
      }

      return { ...state, seriesList: [...updatedSeriesList] }
    }

    case ACTIONS.SERIELIST_BEFORE_DAY_CHANGING_CLEAR: {
      return { ...state, seriesList: [] }
    }

    case ACTIONS.LASTTIME_DATA_UPDATE: {
      const props = action.payload
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
      return state
  }
}
