import axios from 'axios'

const ACTIONS = {
  PRODUCT_SEND_FOR_EDIT_SET: 'PRODUCT_SEND_FOR_EDIT_SET',
  EDIT_WINDOW_STATE_NEGATE: 'EDIT_WINDOW_STATE_NEGATE',
  SAVED_PRODUCTS_LIST_UPDATE: 'SAVED_PRODUCTS_LIST_UPDATE',
  PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD:
    'PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD',
  IS_ADD_BUTTON_DISABLED_SET: 'IS_ADD_BUTTON_DISABLED_SET',
}

export const loadPredefined = (productList) => (dispatch) => {
  dispatch({
    type: ACTIONS.PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD,
    payload: productList,
  })
}

export const handleSelected = (e, state) => (dispatch) => {
  const product = document.getElementById(e.currentTarget.id)
  if (e.currentTarget.id) {
    const productName = product.querySelector(
      '.window__main__section__large-list__item__name'
    )

    if (productName.style.fontWeight === 'bold') {
      product.style.background = '#ffffff'
      productName.style.fontWeight = 'normal'
      dispatch(handleAddButtonDisabling())
    } else {
      product.style.background = '#4fddbc'
      productName.style.fontWeight = 'bold'
      dispatch(
        updateProductSendForEdit(
          state.savedProductList[getIndexOfProduct(e.currentTarget.id, state)]
        )
      )
      dispatch(handleEditingWindow())
    }
  }
}

export const updateProductSendForEdit = (selectedProduct) => (dispatch) => {
  console.log(selectedProduct)
  dispatch({
    type: ACTIONS.PRODUCT_SEND_FOR_EDIT_SET,
    payload: selectedProduct,
  })
}

export const getIndexOfProduct = (targetId, state) => {
  const productList = state.savedProductList
  let returnedIndex = 0

  productList.forEach((product, index) => {
    if (product.id === Number(targetId)) returnedIndex = index
  })
  return returnedIndex
}

export const handleProductEditing = (editedProduct, state) => (dispatch) => {
  const indexOfEditedProduct = getIndexOfProduct(editedProduct.id, state)
  dispatch({
    type: ACTIONS.SAVED_PRODUCTS_LIST_UPDATE,
    payload: { index: indexOfEditedProduct, newProduct: editedProduct },
  })

  const predefinedProductsList = state.savedProductList

  axios.post('/api/predefined', {
    predefined: JSON.stringify(predefinedProductsList),
  })

  dispatch(handleEditingWindow())
}

export const handleEditingWindow =
  (idOfSelectedProduct = false) =>
  (dispatch) => {
    if (Number.isInteger(idOfSelectedProduct)) {
      const product = document.getElementById(idOfSelectedProduct)
      const productName = product.querySelector(
        '.window__main__section__large-list__item__name'
      )
      product.style.background = '#ffffff'
      productName.style.fontWeight = 'normal'
    }

    dispatch({ type: ACTIONS.EDIT_WINDOW_STATE_NEGATE })
    dispatch(handleAddButtonDisabling())
  }

export const handleAddButtonDisabling = () => (dispatch) => {
  const products = document.querySelectorAll(
    '.window__main__section__large-list__item'
  )
  let returnedBoolean = false

  for (let i = 0; i < products.length; i++) {
    const name = products[i].querySelector(
      '.window__main__section__large-list__item__name'
    )
    if (name.style.fontWeight === 'bold') {
      returnedBoolean = false
      break
    } else returnedBoolean = true
  }

  dispatch({
    type: ACTIONS.IS_ADD_BUTTON_DISABLED_SET,
    payload: returnedBoolean,
  })
}
