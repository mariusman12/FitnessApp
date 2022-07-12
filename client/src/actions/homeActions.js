import axios from 'axios'

const ACTIONS = {
  MEALS_INGREDIENTS_SUMMARY_UPDATE: 'MEALS_INGREDIENTS_SUMMARY_UPDATE',
  DAILY_INGREDIENTS_SUMMARY_UPDATE: 'DAILY_INGREDIENTS_SUMMARY_UPDATE',
  GAUGE_DATA_COUNT: 'GAUGE_DATA_COUNT',
  DATE_CHANGE: 'DATE_CHANGE',
  PAGE_TITLE_CHANGE: 'PAGE_TITLE_CHANGE',
  SETTINGS_LOAD: 'SETTINGS_LOAD',
  CLEAR_ALL_PRODUCTS: 'clear-all-products',
}

export const clearAllProducts = () => (dispatch) => {
  dispatch({
    type: ACTIONS.CLEAR_ALL_PRODUCTS,
  })
}

export const updateMealSummary = (object, mealId, state) => (dispatch) => {
  dispatch({
    type: ACTIONS.MEALS_INGREDIENTS_SUMMARY_UPDATE,
    payload: { data: object, mealId: mealId },
  })
  dispatch(updateDailySummary(state))
}

export const updateDailySummary = (state) => (dispatch) => {
  dispatch({ type: ACTIONS.DAILY_INGREDIENTS_SUMMARY_UPDATE })
  dispatch(updateGauges(state))
}

export const updateGauges = (state) => (dispatch) => {
  Object.keys(state.settingsData.nutrition.dailyDemand).forEach(
    (ingredient) => {
      dispatch({
        type: ACTIONS.GAUGE_DATA_COUNT,
        payload: { typeOfIngredient: ingredient },
      })
    }
  )
}

export const updateHomeSettingData = (setting) => (dispatch) => {
  dispatch({ type: ACTIONS.SETTINGS_LOAD, payload: setting })
}

export const updateDateIds = (newDateIds) => (dispatch) => {
  dispatch({ type: ACTIONS.DATE_CHANGE, payload: newDateIds })
}

export const changePageTitle = (categoryTitle, state) => (dispatch) => {
  let newPageTitle = ''

  if (categoryTitle === 'Nutrition') newPageTitle = 'YourSolution'
  else newPageTitle = categoryTitle

  dispatch({ type: ACTIONS.PAGE_TITLE_CHANGE, payload: newPageTitle })
  dispatch(loadSettings(state))
  dispatch(updateGauges(state))
}

export const handleMenu = (categoryTitle, state) => (dispatch) => {
  dispatch(changePageTitle(categoryTitle, state))
}

export const loadSettings = (state) => async (dispatch) => {
  const response = await axios.get('/api/setting')

  const newSettings = JSON.parse(response.data.setting.setting)
  dispatch({ type: ACTIONS.SETTINGS_LOAD, payload: newSettings })

  dispatch(updateGauges(state))
}
