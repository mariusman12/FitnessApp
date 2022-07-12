import React, { useState } from 'react'
import MealList from './MealList'
import './dailydiet.css'
import '../date/styles/center.css'
function DailyDiet() {
  const [mealData, setMealData] = useState(null)
  const [calories, setCalories] = useState(2000)

  function getMealData() {
    fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=cb1c464d94f142c08b156c5beddade8b&timeFrame=day&targetCalories=${calories}`
    )
      .then((response) => response.json())
      .then((data) => {
        setMealData(data)
      })
      .catch(() => {
        console.log('error')
      })
  }

  function handleChange(e) {
    setCalories(e.target.value)
  }

  return (
    <div className='Daily'>
      <div className='div1'>
        <section className='controls'>
          <input
            className='input__details'
            type='number'
            placeholder='Calories (e.g. 2000)'
            onChange={handleChange}
          />
          <button onClick={getMealData}>Get Daily Meal Plan</button>
        </section>
        {mealData && <MealList mealData={mealData} />}
      </div>
    </div>
  )
}

export default DailyDiet
