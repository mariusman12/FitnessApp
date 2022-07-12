import axios from 'axios'

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

export const updateTrainingList = (uniqueList) => (dispatch) => {
  dispatch({ type: ACTIONS.TRAINING_LIST_UPDATE, payload: uniqueList })
}

export const setSettingsChangedState = (cState) => (dispatch) => {
  dispatch({ type: ACTIONS.SETTINGS_CHANGED_STATE_SET, payload: cState })
}

export const handleOpening = (category) => (dispatch) => {
  console.log(category)
  dispatch({ type: ACTIONS.CATEGORY_OPENED_NEGATE, payload: category })
}

export const resetOptionsStates = (optionsStates) => {
  Object.keys(optionsStates).forEach((key) => {
    optionsStates[key] = false
  })
}

export const saveSettingsToDatabase = (state) => async (dispatch) => {
  const response = await axios.put('/api/setting', {
    setting: JSON.stringify(state.settingsData),
  })
  console.log(response)
}

export const restoreSettingFromDatabase = () => async (dispatch) => {
  const response = await axios.get('/api/setting')
  console.log(response.data)

  const newSettings = JSON.parse(response.data.setting.setting)
  dispatch({ type: ACTIONS.SETTINGS_LOAD, payload: newSettings })
}

export const confirmClearAllProducts = (props) => async (dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_ALL_PRODUCTS_SET, payload: false })

  props.updateGauges(props.home)

  const response = await axios.get('/api/item')

  const items = response.data.items

  items.forEach((item) => {
    let value = JSON.parse(item.item)
    if (value.mealId >= 0) axios.put('/api/item', { itemId: value.id })
  })
}

export const cancelClearAllProducts = () => (dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_ALL_PRODUCTS_SET, payload: false })
}

export const confirmClearAllSeries = () => async (dispatch) => {
  const response = await axios.get('/api/item')

  const items = response.data.items

  items.forEach((item) => {
    let value = JSON.parse(item.item)
    if (value.exerciseId >= 0) axios.put('/api/item', { itemId: value.id })
  })

  dispatch({ type: ACTIONS.CLEAR_ALL_SERIES_SET, payload: false })
}

export const cancelClearAllSeries = () => (dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_ALL_SERIES_SET, payload: false })
}

export const handleSettingsSaved =
  (e, optionsStates, props, state) => (dispatch) => {
    e.preventDefault()

    if (optionsStates['clear-all-products'])
      dispatch({ type: ACTIONS.CLEAR_ALL_PRODUCTS_SET, payload: true })
    if (optionsStates['reset-nutrition-to-initial'])
      dispatch({
        type: ACTIONS.NUTRITION_SETTINGS_TO_INITIAL_RESET,
        payload: props,
      })
    if (optionsStates['clear-all-series'])
      dispatch({ type: ACTIONS.CLEAR_ALL_SERIES_SET, payload: true })
    if (optionsStates['reset-training-to-initial'])
      dispatch({
        type: ACTIONS.TRAINING_SETTINGS_TO_INITTIAL_RESET,
        payload: props,
      })

    dispatch({ type: ACTIONS.SETTINGS_CHANGED_STATE_SET, payload: false })
    dispatch(saveSettingsToDatabase(state))
    resetOptionsStates(optionsStates)
    props.updateGauges(props.home)
    props.updateHome(state.settingsData)
  }

export const handleSettingsCanceled =
  (e, props, optionsStates) => (dispatch) => {
    e.preventDefault()
    dispatch(restoreSettingFromDatabase())
    resetOptionsStates(optionsStates)
    props.updateGauges(props.home)
  }

export const handleExerciseChoosing = (e) => (dispatch) => {
  if (e.target.style.backgroundColor) {
    if (e.target.style.backgroundColor === 'transparent')
      dispatch({
        type: ACTIONS.EXERCISE_TO_SELECTED_EXERCISES_ADD,
        payload: Number(e.target.id[e.target.id.length - 1]),
      })
    else
      dispatch({
        type: ACTIONS.EXERCISE_FROM_SELECTED_EXERCISES_REMOVE,
        payload: Number(e.target.id[e.target.id.length - 1]),
      })
  } else {
    if (e.target.children[0].style.backgroundColor === 'transparent')
      dispatch({
        type: ACTIONS.EXERCISE_TO_SELECTED_EXERCISES_ADD,
        payload: Number(e.target.id[e.target.id.length - 1]),
      })
    else
      dispatch({
        type: ACTIONS.EXERCISE_FROM_SELECTED_EXERCISES_REMOVE,
        payload: Number(e.target.id[e.target.id.length - 1]),
      })
  }
}

export const handleSettingOnChange = (e, props) => (dispatch) => {
  const isNumber = /[0-9]/
  const isZero = /^[0]{1}/

  e.preventDefault()

  if (e.target.id === 'editMealName') {
    dispatch({
      type: ACTIONS.SETTINGS_DATA_CHANGE,
      payload: {
        key: e.target.id,
        index: Number(e.target.attributes['data-key'].value),
        value: e.target.value,
      },
    })
  }

  if (isNumber.test(e.target.value[e.target.value.length - 1])) {
    if (isZero.test(e.target.value))
      dispatch({
        type: ACTIONS.SETTINGS_DATA_CHANGE,
        payload: { key: e.target.id, value: 1 },
      })
    else
      dispatch({
        type: ACTIONS.SETTINGS_DATA_CHANGE,
        payload: { key: e.target.id, value: e.target.value },
      })
  } else
    dispatch({
      type: ACTIONS.SETTINGS_DATA_CHANGE,
      payload: { key: e.target.id, value: '' },
    })

  props.updateGauges(props.home)
}
