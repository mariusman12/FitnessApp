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

const initialState = {
  isCategoryOpenedTraining: false,
  isCategoryOpenedNutrition: false,
  settingsData: {
    account: {},

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
    case ACTIONS.CATEGORY_OPENED_NEGATE: {
      switch (action.payload) {
        case 'Training':
          return {
            ...state,
            isCategoryOpenedTraining: !state.isCategoryOpenedTraining,
          }
        case 'Nutrition':
          return {
            ...state,
            isCategoryOpenedNutrition: !state.isCategoryOpenedNutrition,
          }
        default:
          return state
      }
    }

    case ACTIONS.TRAINING_LIST_UPDATE:
      return {
        ...state,
        settingsData: {
          ...state.settingsData,
          training: { selectedExercises: action.payload },
        },
      }
    case ACTIONS.SETTINGS_DATA_CHANGE: {
      switch (action.payload.key) {
        case 'editMealName': {
          return {
            ...state,
            settingsData: {
              ...state.settingsData,
              nutrition: {
                ...state.settingsData.nutrition,
                namesOfMeals: {
                  ...state.settingsData.nutrition.namesOfMeals,
                  [action.payload.index]: action.payload.value,
                },
              },
            },
          }
        }

        case 'setMealsNumber': {
          return {
            ...state,
            settingsData: {
              ...state.settingsData,
              nutrition: {
                ...state.settingsData.nutrition,
                numberOfMeals: action.payload.value,
              },
            },
          }
        }

        default:
          return {
            ...state,
            settingsData: {
              ...state.settingsData,
              nutrition: {
                ...state.settingsData.nutrition,
                dailyDemand: {
                  ...state.settingsData.nutrition.dailyDemand,
                  [action.payload.key]: action.payload.value,
                },
              },
            },
          }
      }
    }

    case ACTIONS.SETTINGS_LOAD: {
      return { ...state, settingsData: action.payload }
    }

    case ACTIONS.CLEAR_ALL_PRODUCTS_SET: {
      return { ...state, clearAllProducts: action.payload }
    }

    case ACTIONS.CLEAR_ALL_SERIES_SET: {
      return { ...state, clearAllSeries: action.payload }
    }

    case ACTIONS.EXERCISE_TO_SELECTED_EXERCISES_ADD: {
      const updatedSelectedExercises =
        state.settingsData.training.selectedExercises
      updatedSelectedExercises.push(action.payload)

      return {
        ...state,
        settingsData: {
          ...state.settingsData,
          training: {
            ...state.settingsData.training,
            selectedExercises: updatedSelectedExercises,
          },
        },
      }
    }

    case ACTIONS.EXERCISE_FROM_SELECTED_EXERCISES_REMOVE: {
      const updatedSelectedExercises =
        state.settingsData.training.selectedExercises
      const indexOfExerciseToRemoving = updatedSelectedExercises.indexOf(
        action.payload
      )
      updatedSelectedExercises.splice(indexOfExerciseToRemoving, 1)

      return {
        ...state,
        settingsData: {
          ...state.settingsData,
          training: {
            ...state.settingsData.training,
            selectedExercises: updatedSelectedExercises,
          },
        },
      }
    }

    case ACTIONS.SETTINGS_CHANGED_STATE_SET: {
      return { ...state, isSettingsChanged: action.payload }
    }

    case ACTIONS.NUTRITION_SETTINGS_TO_INITIAL_RESET: {
      const props = action.payload
      return {
        ...state,
        settingsData: { ...state.settingsData, nutrition: props.initialData },
      }
    }

    case ACTIONS.TRAINING_SETTINGS_TO_INITTIAL_RESET: {
      const props = action.payload
      return {
        ...state,
        settingsData: { ...state.settingsData, training: props.initialData },
      }
    }

    default:
      return state
  }
}
