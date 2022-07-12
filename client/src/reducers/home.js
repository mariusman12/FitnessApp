const countPercentOfEatenIngredient = (eatenAmount, maxAmount) => {
  if (Number.isNaN(Math.round((eatenAmount / maxAmount) * 100))) return 0
  else return Math.round((eatenAmount / maxAmount) * 100)
}

const countAmountOfIngredientLeft = (eatenAmount, maxAmount) => {
  if (eatenAmount >= maxAmount) return 0
  else return maxAmount - eatenAmount
}

const ACTIONS = {
  MEALS_INGREDIENTS_SUMMARY_UPDATE: 'MEALS_INGREDIENTS_SUMMARY_UPDATE',
  DAILY_INGREDIENTS_SUMMARY_UPDATE: 'DAILY_INGREDIENTS_SUMMARY_UPDATE',
  GAUGE_DATA_COUNT: 'GAUGE_DATA_COUNT',
  DATE_CHANGE: 'DATE_CHANGE',
  PAGE_TITLE_CHANGE: 'PAGE_TITLE_CHANGE',
  SETTINGS_LOAD: 'SETTINGS_LOAD',

  SET_USER_STATUS: 'set-user-status',
  CLEAR_ALL_PRODUCTS: 'clear-all-products',
}

const initialState = {
  dateIds: { dayId: 0, monthId: 0, yearId: 0 },
  pageTitle: 'YourSolution',
  loadingSetting: true,

  isAddWindowsEnabled: false,
  isRemoveWindowsEnabled: false,
  isMoreWindowsEnabled: false,

  mealsIngredientsSummary: [],
  dailyIngredientsSummary: { kcal: 0, proteins: 0, fats: 0, carbs: 0 },
  gaugesData: {
    kcal: { eaten: 0, left: 0, max: 0, percent: 0 },
    proteins: { eaten: 0, left: 0, max: 0, percent: 0 },
    fats: { eaten: 0, left: 0, max: 0, percent: 0 },
    carbs: { eaten: 0, left: 0, max: 0, percent: 0 },
  },

  settingsData: {
    main: {},

    nutrition: {
      dailyDemand: { kcal: 2000, proteins: 120, fats: 55, carbs: 240 },
      namesOfMeals: {
        0: 'Breakfast',
        1: 'Shake',
        2: 'Lunch',
        3: 'Protein Snack',
        4: 'Dinner',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
      },
      numberOfMeals: 5,
    },

    training: {
      selectedExercises: [3, 4, 5],
    },
  },
  clearAllProducts: false,
  clearAllSeries: false,
  isSettingsChanged: false,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ACTIONS.MEALS_INGREDIENTS_SUMMARY_UPDATE: {
      const newMealsIngredientsSummary = [...state.mealsIngredientsSummary]

      newMealsIngredientsSummary[action.payload.mealId] = {
        proteins: action.payload.data.proteins,
        fats: action.payload.data.fats,
        carbs: action.payload.data.carbs,
        kcal: action.payload.data.kcal,
      }

      return {
        ...state,
        mealsIngredientsSummary: newMealsIngredientsSummary,
      }
    }

    case ACTIONS.DAILY_INGREDIENTS_SUMMARY_UPDATE: {
      let dailyIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 }
      let mealsIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcal: 0 }

      state.mealsIngredientsSummary.forEach((meal) => {
        mealsIngredientsSum = {
          proteins: meal.proteins,
          fats: meal.fats,
          carbs: meal.carbs,
          kcal: meal.kcal,
        }

        dailyIngredientsSum = {
          proteins: dailyIngredientsSum.proteins + mealsIngredientsSum.proteins,
          fats: dailyIngredientsSum.fats + mealsIngredientsSum.fats,
          carbs: dailyIngredientsSum.carbs + mealsIngredientsSum.carbs,
          kcal: dailyIngredientsSum.kcal + mealsIngredientsSum.kcal,
        }

        mealsIngredientsSum = { proteins: 0, fats: 0, carbs: 0, kcalS: 0 }
      })

      return { ...state, dailyIngredientsSummary: dailyIngredientsSum }
    }

    case ACTIONS.GAUGE_DATA_COUNT: {
      const ingredient = action.payload.typeOfIngredient

      return {
        ...state,
        gaugesData: {
          ...state.gaugesData,
          [ingredient]: {
            eaten: state.dailyIngredientsSummary[ingredient],
            left: countAmountOfIngredientLeft(
              state.dailyIngredientsSummary[ingredient],
              state.settingsData.nutrition.dailyDemand[ingredient]
            ),
            max: state.settingsData.nutrition.dailyDemand[ingredient],
            percent: countPercentOfEatenIngredient(
              state.dailyIngredientsSummary[ingredient],
              state.settingsData.nutrition.dailyDemand[ingredient]
            ),
          },
        },
      }
    }

    case ACTIONS.DATE_CHANGE: {
      return {
        ...state,
        dateIds: {
          dayId: action.payload.currentDay,
          monthId: action.payload.currentMonth,
          yearId: action.payload.currentYear,
        },
      }
    }

    case ACTIONS.PAGE_TITLE_CHANGE: {
      return { ...state, pageTitle: action.payload }
    }

    case ACTIONS.SETTINGS_LOAD: {
      return {
        ...state,
        settingsData: { ...action.payload },
        loadingSetting: false,
      }
    }

    case ACTIONS.SET_USER_STATUS: {
      return { ...state, userStatus: action.payload }
    }

    case ACTIONS.CLEAR_ALL_PRODUCTS: {
      return { ...state, mealsIngredientsSummary: [] }
    }

    default:
      return state
  }
}
