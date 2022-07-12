import React, { useState } from 'react'
import './beginnerPlan.css'
import ContactForm from './ContactForm'
import Diet1 from './Diet1'
import Diet2 from './Diet2'
import Diet3 from './Diet3'
import Diet4 from './Diet4'
import Diet5 from './Diet5'
import Work1 from './Work1'
import Work2 from './Work2'
export default function BeginnerPlan() {
  const [diet, setDiet] = useState(0)
  const handleButton = (diet) => {
    setDiet(diet)
  }

  return (
    <>
      <div className='all__buttons'>
        <div className='button' onClick={() => handleButton(0)}>
          Diet 1
        </div>
        <div className='button' onClick={() => handleButton(1)}>
          Diet2
        </div>
        <div className='button' onClick={() => handleButton(2)}>
          Diet3
        </div>
        <div className='button' onClick={() => handleButton(3)}>
          Diet4
        </div>
        <div className='button' onClick={() => handleButton(4)}>
          Diet 5
        </div>
        <div className='button' onClick={() => handleButton(5)}>
          Work1
        </div>
        <div className='button' onClick={() => handleButton(6)}>
          Work2
        </div>
        <div className='button' onClick={() => handleButton(7)}>
          Contact
        </div>
      </div>
      <>
        {diet === 0 && <Diet1 />}
        {diet === 1 && <Diet2 />}
        {diet === 2 && <Diet3 />}
        {diet === 3 && <Diet4 />}
        {diet === 4 && <Diet5 />}
        {diet === 5 && <Work1 />}
        {diet === 6 && <Work2 />}
        {diet === 7 && <ContactForm />}
      </>
    </>
  )
}
