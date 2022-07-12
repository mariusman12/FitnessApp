import axios from 'axios'
import { React, useState, useEffect, useReducer, memo } from 'react'
import { connect } from 'react-redux'
import AddWindow from '../productadd/ProductAddingWindow'
import RemoveWindow from '../productremove/ProductRemovingWindow'
import './styles/meal.css'

export const warnings = {
  name: 'Name must be a string of letters only',
  weight: 'Weight must be a positive number',
  macros: 'Macronutrient must be a number',
}

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
  LOADING_STATE_NEGATE: 'LOADING_STATE_NEGATE',
}

const Meal = (props) => {
  const initialState = {
    loadingProducts: true,
    isMealOpened: false,
    isAddingWindowOpened: false,
    isRemovingWindowOpened: false,
    countIngredients: false,
    productList: [],
    newProduct: {
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
    warning: ['', ''],
    summary: {
      proteins: 0,
      fats: 0,
      carbs: 0,
      kcal: 0,
    },
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.LOADING_STATE_NEGATE:
        return { ...state, loadingProducts: !state.loadingProducts }
      case ACTIONS.NEW_LIST_ADD:
        return {
          ...state,
          productList: [...action.payload],
        }
      case ACTIONS.MEAL_STATE_NEGATE:
        return { ...state, isMealOpened: !state.isMealOpened }

      case ACTIONS.ADD_WINDOW_STATE_NEGATE:
        return { ...state, isAddingWindowOpened: !state.isAddingWindowOpened }

      case ACTIONS.REMOVE_WINDOW_STATE_NEGATE:
        return {
          ...state,
          isRemovingWindowOpened: !state.isRemovingWindowOpened,
        }

      case ACTIONS.CHANGE_NEW_PRODUCT_DATA: {
        switch (action.payload.key) {
          case 'name':
            return {
              ...state,
              newProduct: { ...state.newProduct, name: action.payload.value },
            }
          case 'weight':
            return {
              ...state,
              newProduct: { ...state.newProduct, weight: action.payload.value },
            }
          case 'proteins':
            return {
              ...state,
              newProduct: {
                ...state.newProduct,
                proteins: action.payload.value,
              },
            }
          case 'fats':
            return {
              ...state,
              newProduct: { ...state.newProduct, fats: action.payload.value },
            }
          case 'carbs':
            return {
              ...state,
              newProduct: { ...state.newProduct, carbs: action.payload.value },
            }
          case 'kcal':
            return {
              ...state,
              newProduct: { ...state.newProduct, kcal: action.payload.value },
            }
        }
      }

      case ACTIONS.PRODUCT_ADD: {
        return {
          ...state,
          newProduct: {
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
        }
      }

      case ACTIONS.SET_WARNING: {
        switch (action.payload) {
          case 'name':
            return { ...state, warning: [warnings.name, action.payload] }
          case 'weight':
            return { ...state, warning: [warnings.weight, action.payload] }
          default:
            return { ...state, warning: [warnings.macros, action.payload] }
        }
      }

      case ACTIONS.CLEAR_WARNING: {
        return { ...state, warning: ['', action.payload] }
      }

      case ACTIONS.PRODUCT_REMOVE: {
        let newProductList = state.productList
        let checkedIdList = action.payload

        checkedIdList.forEach((checkedId) => {
          newProductList.forEach(async (product, index) => {
            if (Number(product.id) === Number(checkedId)) {
              newProductList.splice(index, 1)
              const response = await axios.put('/api/item', {
                itemId: product.id,
              })
            }
          })
        })
        return { ...state, productList: newProductList }
      }

      case ACTIONS.SUMMARY_ADD: {
        switch (action.payload.ingredient) {
          case 'proteins':
            return {
              ...state,
              summary: {
                ...state.summary,
                proteins: state.summary.proteins + Number(action.payload.value),
              },
            }
          case 'fats':
            return {
              ...state,
              summary: {
                ...state.summary,
                fats: state.summary.fats + Number(action.payload.value),
              },
            }
          case 'carbs':
            return {
              ...state,
              summary: {
                ...state.summary,
                carbs: state.summary.carbs + Number(action.payload.value),
              },
            }
          case 'kcal':
            return {
              ...state,
              summary: {
                ...state.summary,
                kcal: state.summary.kcal + Number(action.payload.value),
              },
            }
        }
      }

      case ACTIONS.SUMMARY_SUB: {
        switch (action.payload.ingredient) {
          case 'proteins':
            return {
              ...state,
              summary: {
                ...state.summary,
                proteins: state.summary.proteins - Number(action.payload.value),
              },
            }
          case 'fats':
            return {
              ...state,
              summary: {
                ...state.summary,
                fats: state.summary.fats - Number(action.payload.value),
              },
            }
          case 'carbs':
            return {
              ...state,
              summary: {
                ...state.summary,
                carbs: state.summary.carbs - Number(action.payload.value),
              },
            }
          case 'kcal':
            return {
              ...state,
              summary: {
                ...state.summary,
                kcal: state.summary.kcal - Number(action.payload.value),
              },
            }
        }
      }

      case ACTIONS.PRODUCT_TO_PRODUCT_LIST_ADD: {
        return {
          ...state,
          productList: [...state.productList, action.payload],
        }
      }

      case ACTIONS.BEFORE_DAY_CHANGING_PRODUCTLIST_CLEAR: {
        return { ...state, productList: [] }
      }

      default:
        return console.error(`Unknown action type: ${action.type}`)
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [isPlaceholderEnabled, setPlaceholderState] = useState(false)

  useEffect(async () => {
    const response = await axios.put('/api/item/getItems', {
      parentId: props.mealId,
      dateIds: JSON.stringify(props.dateIds),
      itemType: 'product',
    })

    const items = response.data.items

    console.log(items)

    items.forEach((item) => {
      let value = JSON.parse(item.item)

      dispatch({
        type: ACTIONS.PRODUCT_TO_PRODUCT_LIST_ADD,
        payload: value,
      })
    })
  }, [props.dateIds])

  useEffect(() => {
    return () =>
      dispatch({ type: ACTIONS.BEFORE_DAY_CHANGING_PRODUCTLIST_CLEAR })
  }, [props.dateIds])

  useEffect(() => {
    const disableVisibilityIfEnabled = (state, action) => {
      if (state) dispatch({ type: action })
    }

    disableVisibilityIfEnabled(state.isMealOpened, ACTIONS.MEAL_STATE_NEGATE)
    disableVisibilityIfEnabled(
      state.isAddingWindowOpened,
      ACTIONS.ADD_WINDOW_STATE_NEGATE
    )
    disableVisibilityIfEnabled(
      state.isRemovingWindowOpened,
      ACTIONS.REMOVE_WINDOW_STATE_NEGATE
    )
  }, [props.dateIds])

  useEffect(() => {
    props.updateGauges(state.summary, props.mealId, props.home)
  }, [state.summary, props.home.dateIds])

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

    state.isAddingWindowOpened || state.isRemovingWindowOpened
      ? changePointerEvents('none')
      : changePointerEvents('auto')
  }, [state.isAddingWindowOpened, state.isRemovingWindowOpened])

  const handleMealOpening = () => {
    dispatch({ type: ACTIONS.MEAL_STATE_NEGATE })
  }

  const handleAddingToSummary = (object) => {
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

  const handleSubstractingFromSummary = (object) => {
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

  const handleAddWindow = () => {
    dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
  }

  const handleRemoveWindow = () => {
    dispatch({ type: ACTIONS.REMOVE_WINDOW_STATE_NEGATE })
  }

  const handleProductAdding = async (e) => {
    e.preventDefault()

    state.newProduct.id = Date.now() * Math.random() * 100
    state.newProduct.dateIds = props.home.dateIds
    state.productList.push(state.newProduct)

    await axios.post('/api/item', {
      itemId: state.newProduct.id,
      dateIds: JSON.stringify(props.dateIds),
      item: JSON.stringify(state.newProduct),
      mealId: state.newProduct.mealId,
      parentId: props.mealId,
      type: 'product',
    })
    dispatch({ type: ACTIONS.PRODUCT_ADD })

    const uniqueListIds = []
    const uniqueList = []
    state.productList.map(async (product) => {
      if (!uniqueListIds.includes(product.id)) {
        uniqueListIds.push(product.id)
        uniqueList.push(product)
      }
      dispatch({ type: ACTIONS.NEW_LIST_ADD, payload: uniqueList })
    })

    dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
  }

  const handlePredefinedProductsAdding = (selectedProducts) => {
    selectedProducts.forEach(async (product) => {
      Object.keys(product).forEach((key) => {
        dispatch({
          type: ACTIONS.CHANGE_NEW_PRODUCT_DATA,
          payload: { key: key, value: product[key] },
        })
      })

      let id = Date.now() * Math.random() * 100

      const newProduct = {
        ...product,
        id,
        dateIds: props.dateIds,
        mealId: props.mealId,
      }

      axios.post('/api/item', {
        itemId: id,
        parentId: props.mealId,

        dateIds: JSON.stringify(props.dateIds),
        item: JSON.stringify(newProduct),
        itemType: 'product',
      })
      state.productList.push(newProduct)

      dispatch({ type: ACTIONS.PRODUCT_ADD })
    })

    dispatch({ type: ACTIONS.ADD_WINDOW_STATE_NEGATE })
  }

  const handleProductRemoving = (checkedIdsList) => {
    dispatch({ type: ACTIONS.PRODUCT_REMOVE, payload: checkedIdsList })
    dispatch({ type: ACTIONS.REMOVE_WINDOW_STATE_NEGATE })
  }

  const handleFormClearing = () => {
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

  const handleOnChange = (e) => {
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

  return (
    <div
      className='meal'
      style={state.isMealOpened ? { left: '-10px' } : { left: '0px' }}
    >
      <section className='meal__top-section' onClick={handleMealOpening}>
        <h2 className='meal__top-section__meal-title'>{props.name}</h2>

        <ul className='meal__top-section__meal-stats-list'>
          <li className='meal__top-section__meal-stats-list__item'>
            {state.summary.proteins} g
          </li>
          <li className='meal__top-section__meal-stats-list__item'>
            {state.summary.fats} g
          </li>
          <li className='meal__top-section__meal-stats-list__item'>
            {state.summary.carbs} g
          </li>
          <li className='meal__top-section__meal-stats-list__item'>
            {state.summary.kcal} kcal
          </li>
        </ul>
      </section>
      {state.productList.length !== 0 ? (
        <section
          className='meal__products-section'
          style={state.isMealOpened ? { display: 'flex' } : { display: 'none' }}
        >
          {state.productList.map((product) => {
            return (
              <Product
                key={product.id}
                name={product.name}
                weight={product.weight}
                proteins={product.proteins}
                fats={product.fats}
                carbs={product.carbs}
                kcal={product.kcal}
                addIngredientsFunction={handleAddingToSummary}
                subIngredientsFunction={handleSubstractingFromSummary}
              ></Product>
            )
          })}
        </section>
      ) : null}

      <section
        className='meal__buttons-section'
        style={state.isMealOpened ? { display: 'flex' } : { display: 'none' }}
      >
        <div>
          <button
            className={
              state.productList.length
                ? 'meal__buttons-section__remove-button'
                : 'meal__buttons-section__remove-button--disabled'
            }
            onClick={state.productList.length ? handleRemoveWindow : null}
            disabled={
              state.isAddingWindowOpened || state.isRemovingWindowOpened
                ? true
                : false
            }
          >
            Remove
          </button>

          <button
            className='meal__buttons-section__add-button'
            onClick={handleAddWindow}
            disabled={
              state.isAddingWindowOpened || state.isRemovingWindowOpened
                ? true
                : false
            }
          >
            Add
          </button>
        </div>
      </section>

      {state.isAddingWindowOpened ? (
        <AddWindow
          data={{
            isPlaceholderEnabled: isPlaceholderEnabled,
            name: state.newProduct.name,
            weight: state.newProduct.weight,
            proteins: state.newProduct.proteins,
            fats: state.newProduct.fats,
            carbs: state.newProduct.carbs,
            kcal: state.newProduct.kcal,
          }}
          warning={state.warning}
          handleOnChange={handleOnChange}
          handleFormClearing={handleFormClearing}
          handleProductAdding={handleProductAdding}
          handleAddWindow={handleAddWindow}
          handlePredefinedProductsAdding={handlePredefinedProductsAdding}
        />
      ) : null}

      {state.isRemovingWindowOpened ? (
        <RemoveWindow
          list={state.productList}
          handleRemoving={handleProductRemoving}
          handleRemoveWindow={handleRemoveWindow}
        />
      ) : null}
    </div>
  )
}
const mapStateToProps = (state) => ({
  home: state.home,
})

export default connect(mapStateToProps)(memo(Meal))

function Product(props) {
  useEffect(() => {
    let ingredients = {
      proteins: props.proteins,
      fats: props.fats,
      carbs: props.carbs,
      kcal: props.kcal,
    }
    props.addIngredientsFunction(ingredients)

    return () => {
      props.subIngredientsFunction(ingredients)
    }
  }, [])

  return (
    <div className='meal__products-section__product'>
      <div className='meal__products-section__product__info'>
        <h2 className='meal__products-section__product__title'>{props.name}</h2>
        <p className='meal__products-section__product__weight'>
          {props.weight} g
        </p>
      </div>

      <ul className='meal__products-section__product__stats-list'>
        <li className='meal__products-section__product__stats-list__item'>
          {props.proteins} g
        </li>
        <li className='meal__products-section__product__stats-list__item'>
          {props.fats} g
        </li>
        <li className='meal__products-section__product__stats-list__item'>
          {props.carbs} g
        </li>
        <li className='meal__products-section__product__stats-list__item meal__products-section__product__stats-list__item--kcal'>
          {props.kcal} kcal
        </li>
      </ul>
    </div>
  )
}
