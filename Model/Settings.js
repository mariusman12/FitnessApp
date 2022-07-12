const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  setting: {
    type: String,

    default:
      '{"main":{},"nutrition":{"dailyDemand":{"kcal":3000,"proteins":220,"fats":75,"carbs":240},"namesOfMeals":{"0":"BreakFast","1":"Shake","2":"Lunch","3":"Protein Snack","4":"Dinner","5":"","6":"","7":"","8":"","9":""},"numberOfMeals":5},"training":{"selectedExercises":[3,4,5]}}',
  },
  userId: { type: String },
})

module.exports = Setting = mongoose.model('Setting', settingSchema)
