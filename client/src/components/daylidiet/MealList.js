import React from 'react'
import MealDaily from './MealDaily'
export default function MealList({ mealData }) {
  const nutrients = mealData.nutrients

  return (
    <main className='main__daily__diet'>
      <section className='meals__daily'>
        <section className='nutrients'>
          <h1>Macros</h1>
          <ul>
            <li>Calories: {nutrients.calories.toFixed(0)}</li>
            <li>Carbohydrates: {nutrients.carbohydrates.toFixed(0)}</li>
            <li>Fat: {nutrients.fat.toFixed(0)}</li>
            <li>Protein: {nutrients.protein.toFixed(0)}</li>
          </ul>
        </section>
        <section className='meal__list'>
          {mealData.meals.map((meal) => {
            return <MealDaily key={meal.id} meal={meal} />
          })}
        </section>
      </section>
    </main>
  )
}
