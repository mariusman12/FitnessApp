const ACTIONS = {
  PRODUCT_SEND_FOR_EDIT_SET: 'PRODUCT_SEND_FOR_EDIT_SET',
  EDIT_WINDOW_STATE_NEGATE: 'EDIT_WINDOW_STATE_NEGATE',
  SAVED_PRODUCTS_LIST_UPDATE: 'SAVED_PRODUCTS_LIST_UPDATE',
  PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD:
    'PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD',
  IS_ADD_BUTTON_DISABLED_SET: 'IS_ADD_BUTTON_DISABLED_SET',
}

const initialState = {
  savedProductList: [
    {
      id: 0,
      name: 'Chicken Breast',
      weight: 100,
      proteins: 53,
      fats: 6,
      carbs: 8,
      kcal: 284,
    },
    {
      id: 1,
      name: 'Skyr',
      weight: 100,
      proteins: 20,
      fats: 0,
      carbs: 12,
      kcal: 100,
    },
    {
      id: 2,
      name: 'Coocked Potatos',
      weight: 100,
      proteins: 9,
      fats: 2,
      carbs: 80,
      kcal: 126,
    },
    {
      id: 3,
      name: 'Skyr Yogurt',
      weight: 100,
      proteins: 20,
      fats: 10,
      carbs: 15,
      kcal: 240,
    },
    {
      id: 4,
      name: 'Protein Shake',
      weight: 100,
      proteins: 23,
      fats: 0,
      carbs: 0,
      kcal: 10,
    },
    {
      id: 5,
      name: 'Mango',
      weight: 100,
      proteins: 90,
      fats: 1,
      carbs: 24,
      kcal: 99,
    },
    {
      id: 6,
      name: 'Mango',
      weight: 100,
      proteins: 90,
      fats: 1,
      carbs: 24,
      kcal: 99,
    },
    {
      id: 7,
      name: 'Beans',
      weight: 100,
      proteins: 21,
      fats: 0,
      carbs: 12,
      kcal: 17,
    },
    {
      id: 8,
      name: 'Oat bran',
      weight: 179,
      proteins: 3,
      fats: 1,
      carbs: 12,
      kcal: 73,
    },
    {
      id: 9,
      name: 'Bannock',
      weight: 37,
      proteins: 2,
      fats: 0,
      carbs: 19,
      kcal: 84,
    },
    {
      id: 10,
      name: 'Bread',
      weight: 35,
      proteins: 3,
      fats: 1,
      carbs: 19,
      kcal: 95,
    },
    {
      id: 11,
      name: 'Rice',
      weight: 100,
      proteins: 21,
      fats: 0,
      carbs: 12,
      kcal: 17,
    },
    {
      id: 12,
      name: 'Pasta',
      weight: 169,
      proteins: 9,
      fats: 3,
      carbs: 40,
      kcal: 220,
    },
    {
      id: 13,
      name: 'Pancake',
      weight: 50,
      proteins: 3,
      fats: 3,
      carbs: 20,
      kcal: 112,
    },
    {
      id: 14,
      name: 'Quinoa',
      weight: 70,
      proteins: 2,
      fats: 1,
      carbs: 13,
      kcal: 73,
    },
  ],

  productSendForEdit: {
    id: 0,
    name: '',
    weight: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
    kcal: 0,
  },
  isEditWindowOpened: false,
  isAddButtonDisabled: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ACTIONS.PREDEFINED_PRODUCTS_LIST_FROM_DB_LOAD: {
      return { ...state, savedProductList: action.payload }
    }

    case ACTIONS.EDIT_WINDOW_STATE_NEGATE: {
      return { ...state, isEditWindowOpened: !state.isEditWindowOpened }
    }

    case ACTIONS.PRODUCT_SEND_FOR_EDIT_SET: {
      return {
        ...state,
        productSendForEdit: {
          id: action.payload.id,
          name: action.payload.name,
          weight: action.payload.weight,
          proteins: action.payload.proteins,
          fats: action.payload.fats,
          carbs: action.payload.carbs,
          kcal: action.payload.kcal,
        },
      }
    }

    case ACTIONS.SAVED_PRODUCTS_LIST_UPDATE: {
      const newSavedProductList = state.savedProductList
      newSavedProductList[action.payload.index] = action.payload.newProduct
      return { ...state, savedProductList: newSavedProductList }
    }

    case ACTIONS.IS_ADD_BUTTON_DISABLED_SET: {
      return { ...state, isAddButtonDisabled: action.payload }
    }

    default:
      return state
  }
}
