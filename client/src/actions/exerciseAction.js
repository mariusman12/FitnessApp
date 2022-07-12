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
export const sortSerieList = () => (dispatch) => {
  dispatch({ action: ACTIONS.SERIELIST_SORT })
}

export const clearSerieListBeforeDayChanging = () => (dispatch) => {
  dispatch({ action: ACTIONS.SERIELIST_BEFORE_DAY_CHANGING_CLEAR })
}
export const dispatchThis = (action) => (dispatch) => {
  dispatch({ action })
}
export const updateLastTimeData = (props) => (dispatch) => {
  dispatch({ type: ACTIONS.LASTTIME_DATA_UPDATE, payload: props })
}
export const getPreviousTrainingDate = (previousDateIds) => {
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

export const handleExerciseOpening = () => (dispatch) => {
  dispatch({ type: ACTIONS.EXERCISE_OPEN_NEGATE })
}

export const handleAddWindow = () => (dispatch) => {
  dispatch({ type: ACTIONS.WINDOW_ADD_STATE_NEGATE })
}

export const handleRemoveWindow = () => (dispatch) => {
  dispatch({ type: ACTIONS.WINDOW_REMOVE_STATE_NEGATE })
}

export const handleMoreWindow = () => (dispatch) => {
  dispatch({ type: ACTIONS.WINDOW_MORE_STATE_NEGATE })
}

export const handleFormClearing = () => (dispatch) => {
  dispatch({
    type: ACTIONS.SERIE_NEW_DATA_CHANGE,
    payload: { key: 'weight', value: '' },
  })
  dispatch({
    type: ACTIONS.SERIE_NEW_DATA_CHANGE,
    payload: { key: 'reps', value: '' },
  })
}

export const handleOnChange = (e) => (dispatch) => {
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

export const handleSerieAdding = (e, state, props) => (dispatch) => {
  e.preventDefault()
  setTimeout(async () => {
    const updatedSeriesList = state.seriesList
    let serieCount = 1

    state.newSerie.id = Date.now()
    state.newSerie.dateIds = props.dateIds
    updatedSeriesList.push(state.newSerie)

    updatedSeriesList.forEach((serie) => {
      serie.serieCount = serieCount
      serieCount++
    })

    state.newSerie.exerciseId = props.exerciseId

    await axios.post('/api/item', {
      itemId: state.newSerie.id,
      item: JSON.stringify(state.newSerie),
    })

    dispatch({ type: ACTIONS.SERIE_ADD, payload: updatedSeriesList })
  }, 10)
  dispatch({ type: ACTIONS.WINDOW_ADD_STATE_NEGATE })
}

export const handleSerieRemoving = (checkedIdsList, state) => (dispatch) => {
  console.log(checkedIdsList)
  let updatedSeriesList = state.seriesList

  let serieCount = 1

  checkedIdsList.forEach((checkedId) => {
    updatedSeriesList.forEach((serie, index) => {
      axios.put('/api/item', { itemId: serie.id })
      if (Number(serie.id) === Number(checkedId))
        updatedSeriesList.splice(index, 1)
    })
    dispatch({ type: ACTIONS.SERIELIST_SORT })
  })

  updatedSeriesList.forEach((serie) => {
    axios
      .post('/api/item', {
        itemId: serie.id,
        item: JSON.stringify({ ...serie, serieCount }),
      })
      .then(() => {
        serieCount++
      })
  })

  dispatch({ type: ACTIONS.SERIE_REMOVE, payload: updatedSeriesList })

  dispatch({ type: ACTIONS.WINDOW_REMOVE_STATE_NEGATE })
}
