import { warnings } from '../components/meal/meal'
const ACTIONS = {
  PRODUCT_DATA_UPDATE: 'PRODUCT_DATA_UPDATE',
  FORM_RESET: 'reset-form',
  SET_WARNING: 'set-warning',
  CLEAR_WARNING: 'clear-warning',
}

const initialState = {
  productData: {
    id: '',
    name: '',
    weight: '',
    proteins: '',
    fats: '',
    carbs: '',
    kcal: '',
  },
  warning: ['', ''],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ACTIONS.PRODUCT_DATA_UPDATE: {
      switch (action.payload.key) {
        case 'name': {
          return {
            ...state,
            productData: { ...state.productData, name: action.payload.value },
          }
        }
        case 'weight': {
          return {
            ...state,
            productData: {
              ...state.productData,
              weight: action.payload.value,
            },
          }
        }
        case 'proteins': {
          return {
            ...state,
            productData: {
              ...state.productData,
              proteins: action.payload.value,
            },
          }
        }
        case 'fats': {
          return {
            ...state,
            productData: { ...state.productData, fats: action.payload.value },
          }
        }
        case 'carbs': {
          return {
            ...state,
            productData: {
              ...state.productData,
              carbs: action.payload.value,
            },
          }
        }
        case 'kcal': {
          return {
            ...state,
            productData: { ...state.productData, kcal: action.payload.value },
          }
        }
        default:
          return state
      }
    }

    case ACTIONS.FORM_RESET: {
      const props = action.payload

      return {
        ...state,
        productData: {
          id: props.data.id,
          name: props.data.name,
          weight: props.data.weight,
          proteins: props.data.proteins,
          fats: props.data.fats,
          carbs: props.data.carbs,
          kcal: props.data.kcal,
        },
      }
    }

    case ACTIONS.SET_WARNING: {
      if (action.payload === 'name')
        return { ...state, warning: [warnings.name, action.payload] }
      else return { ...state, warning: [warnings.weight, action.payload] }
    }

    case ACTIONS.CLEAR_WARNING: {
      return { ...state, warning: ['', action.payload] }
    }

    default:
      return state
  }
}
