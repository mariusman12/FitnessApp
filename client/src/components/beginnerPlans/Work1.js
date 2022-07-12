import React from 'react'
import './beginnerPlan.css'

const Work1 = () => {
    return (
  <div className="beginner">
      <div className="wrapper__beginnerPlan">

            <div className="plans">
              <div className="workoutPlan">
                <h2>WorkOut</h2>
                <div className=" meal workout_day">
                  <h3 className="day">Day 1: Monday</h3>
                  <ul className="exerciseList">
                    <li className="exercise">Chest</li>
                    <li className="exercise">Shoulders</li>
                    <li className="exercise">Triceps</li>
                  </ul>
                </div>
                <div className=" meal workout_day">
                  <h3 className="day">Day 2: Tuesday</h3>
                  <ul className="exerciseList">
                    <li className="exercise">Back</li>
                    <li className="exercise">Biceps</li>
                  </ul>
                </div>
                <div className=" meal workout_day">
                  <h3 className="day">Day 3: Wednesday</h3>
                  <ul className="exerciseList">
                    <li className="exercise">Legs</li>
                  </ul>
                </div>
                <div className=" meal workout_day">
                  <h3 className="day">Day 4: Thursday</h3>
                  <ul className="exerciseList">
                    <li className="exercise">Shouders</li>
                    <li className="exercise">Chest</li>
                    <li className="exercise">Triceps</li>
                  </ul>
                </div>
                <div className=" meal workout_day">
                  <h3 className="day">Day 5: Friday</h3>
                  <ul className="exerciseList">
                    <li className="exercise">Back</li>
                    <li className="exercise">Bis</li>
                  </ul>
                </div>
              </div>
        </div>
        </div>
        </div>
    )
}

export default Work1
