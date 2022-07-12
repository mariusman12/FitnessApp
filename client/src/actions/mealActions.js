const ACTIONS = {
  NEW_LIST_ADD: 'NEW_LIST_ADD',
  MEAL_STATE_NEGATE: 'MEAL_STATE_NEGATE',
  ADD_WINDOW_STATE_NEGATE: 'ADD_WINDOW_STATE_NEGATE',
  REMOVE_WINDOW_STATE_NEGATE: 'REMOVE_WINDOW_STATE_NEGATE',
  PRODUCT_ADD: 'PRODUCT_ADD',
  PLACEHOLDER_ENABLE: 'PLACEHOLDER_ENABLE',
  PLACEHOLDER_DISABLE: 'PLACEHOLDER_DISABLE',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
  PRODUCT_REMOVE: 'PRODUCT_REMOVE',
  SUMMARY_ADD: 'SUMMARY_ADD',
  SUMMARY_SUB: 'SUMMARY_SUB',
  BEFORE_DAY_CHANGING_PRODUCTLIST_CLEAR:
    'BEFORE_DAY_CHANGING_PRODUCTLIST_CLEAR',
  PRODUCT_TO_PRODUCT_LIST_ADD: 'PRODUCT_TO_PRODUCT_LIST_ADD',
  ADD_NEW_PRODUCT: 'add-new-product',
  CHANGE_NEW_PRODUCT_DATA: 'change-new-product-data',
}

export const dispatchThis = (action) => (dispatch) => {
  dispatch({ type: action })
}
export const addProductToProductList = (value) => (dispatch) => {
  dispatch({
    type: ACTIONS.PRODUCT_TO_PRODUCT_LIST_ADD,
    payload: value,
  })
}
export const clear_product_list = () => (dispatch) => {
  dispatch({ type: ACTIONS.BEFORE_DAY_CHANGING_PRODUCTLIST_CLEAR })
}

export const add_new_list = (uniqueList) => (dispatch) => {
  dispatch({ type: ACTIONS.NEW_LIST_ADD, payload: uniqueList })
}
export const handleMealOpening = () => (dispatch) => {
  dispatch({ type: ACTIONS.MEAL_STATE_NEGATE })
}

export const handleAddingToSummary = (object) => (dispatch) => {
  Object.keys(object).forEach((key) => {
    dispatch({
      type: ACTIONS.SUMMARY_ADD,
      payload: {
        ingredient: key,
        value: object[key],
      },
    })
  })
}

export const handleSubstractingFromSummary = (object) => (dispatch) => {
  Object.keys(object).forEach((key) => {
    dispatch({
      type: ACTIONS.SUMMARY_SUB,
      payload: {
        ingredient: key,
        value: object[key],
      },
    })
  })
}

export const handleAddWindow = () => (dispatch) => {
  dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
}

export const handleRemoveWindow = () => (dispatch) => {
  dispatch({ type: ACTIONS.REMOVE_WINDOW_STATE_NEGATE })
}

export const handleProductAdding = (e, props) => (dispatch) => {
  e.preventDefault()
  setTimeout(() => {
    dispatch({ type: ACTIONS.PRODUCT_ADD, payload: props })
  }, 10)
  dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
}

export const addNewProduct = (props) => (dispatch) => {
  dispatch({
    type: ACTIONS.ADD_NEW_PRODUCT,
    payload: {
      id: 0,
      mealId: props.mealId,
      dateIds: { dayId: 0, monthId: 0, yearId: 0 },
      name: '',
      weight: '',
      proteins: '',
      fats: '',
      carbs: '',
      kcal: '',
    },
  })
}

export const handlePredefinedProductsAdding =
  (selectedProducts, props) => (dispatch) => {
    selectedProducts.forEach((product) => {
      setTimeout(() => {
        Object.keys(product).forEach((key) => {
          dispatch({
            type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
            payload: { key: key, value: product[key] },
          })
        })

        dispatch({ type: ACTIONS.PRODUCT_ADD, payload: props })
      }, 10)
    })

    dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
  }

export const handleProductRemoving = (checkedIdsList) => (dispatch) => {
  dispatch({ type: ACTIONS.PRODUCT_REMOVE, payload: checkedIdsList })
  dispatch({ type: ACTIONS.REMOVE_WINDOW_STATE_NEGATE })
}

export const handleFormClearing = (setPlaceholderState) => (dispatch) => {
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'name', value: '' },
  })
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'weight', value: '' },
  })
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'proteins', value: '' },
  })
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'fats', value: '' },
  })
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'carbs', value: '' },
  })
  dispatch({
    type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
    payload: { key: 'kcal', value: '' },
  })
  setPlaceholderState(false)
}

export const handleOnChange = (e) => (dispatch) => {
  const isNumber = /[0-9]/
  const isWord = /[a-z\s]/i
  const isZero = /^[0]{1}/

  const setValueAsZero = () => {
    dispatch({
      type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
      payload: { key: e.target.id, value: '0' },
    })
    dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id })
  }

  const setValueAsNull = () => {
    dispatch({
      type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
      payload: { key: e.target.id, value: '' },
    })
    dispatch({ type: ACTIONS.SET_WARNING, payload: e.target.id })
  }

  const setValueAsCorrect = () => {
    dispatch({
      type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
      payload: { key: e.target.id, value: e.target.value },
    })
    dispatch({ type: ACTIONS.CLEAR_WARNING, payload: e.target.id })
  }

  if (e.target.id === 'name') {
    isWord.test(e.target.value[e.target.value.length - 1])
      ? setValueAsCorrect()
      : setValueAsNull()
  } else {
    if (isNumber.test(e.target.value[e.target.value.length - 1])) {
      if (isZero.test(e.target.value))
        e.target.id === 'weight' ? setValueAsNull() : setValueAsZero()
      else setValueAsCorrect()
    } else {
      setValueAsNull()
    }
  }
}
