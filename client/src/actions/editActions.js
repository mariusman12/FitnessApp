const ACTIONS = {
  PRODUCT_DATA_UPDATE: 'PRODUCT_DATA_UPDATE',
  FORM_RESET: 'reset-form',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
}

export const handleResetingForm =
  (e, setIsStateEqualToProps, props) => (dispatch) => {
    e.preventDefault()
    dispatch({ type: ACTIONS.FORM_RESET, payload: props })
    dispatch({ type: ACTIONS.CLEAR_WARNING })
    setIsStateEqualToProps(true)
  }

export const initializeForm = (props) => (dispatch) => {
  console.log('Initializing form')
  dispatch({ type: ACTIONS.FORM_RESET, payload: props })
}

export const calculateNutritionFacts = (e, props) => (dispatch) => {
  const isNumber = /[0-9]/
  const isZero = /^[0]{1}/

  const nutritionPerOneGram = {
    proteins: Number(props.data.proteins) / Number(props.data.weight),
    fats: Number(props.data.fats) / Number(props.data.weight),
    carbs: Number(props.data.carbs) / Number(props.data.weight),
    kcal: Number(props.data.kcal) / Number(props.data.weight),
  }

  const setValueAsNull = () => {
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'weight', value: '' },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'proteins', value: 0 },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'fats', value: 0 },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'carbs', value: 0 },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'kcal', value: 0 },
    })
    dispatch({ type: ACTIONS.SET_WARNING, payload: 'weight' })
  }

  const setValueAsCorrect = () => {
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'weight', value: Number(e.target.value) },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: {
        key: 'proteins',
        value: Math.round(e.target.value * nutritionPerOneGram.proteins),
      },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: {
        key: 'fats',
        value: Math.round(e.target.value * nutritionPerOneGram.fats),
      },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: {
        key: 'carbs',
        value: Math.round(e.target.value * nutritionPerOneGram.carbs),
      },
    })
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: {
        key: 'kcal',
        value: Math.round(e.target.value * nutritionPerOneGram.kcal),
      },
    })
    dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'weight' })
  }

  if (isNumber.test(e.target.value[e.target.value.length - 1])) {
    isZero.test(e.target.value) ? setValueAsNull() : setValueAsCorrect()
  } else {
    setValueAsNull()
  }
}

export const handleNameChanging = (e) => (dispatch) => {
  const isWord = /[a-z\s]/i
  e.preventDefault()
  if (isWord.test(e.target.value[e.target.value.length - 1])) {
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'name', value: e.target.value },
    })
    dispatch({ type: ACTIONS.CLEAR_WARNING, payload: 'name' })
  } else {
    dispatch({
      type: ACTIONS.PRODUCT_DATA_UPDATE,
      payload: { key: 'name', value: '' },
    })
    dispatch({ type: ACTIONS.SET_WARNING, payload: 'name' })
  }
}
