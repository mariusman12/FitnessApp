const mongoose = require('mongoose')

const predefinedSchema = new mongoose.Schema({
  predefined: {
    type: String,
    default:
      '[{"id":0,"name":"Cheese","weight":100,"proteins":20,"fats":10,"carbs":15,"kcal":250},{"id":1,"name":"Skyr Yogurt","weight":100,"proteins":200,"fats":0,"carbs":120,"kcal":1000},{"id":2,"name":"Coocked patatos","weight":100,"proteins":9,"fats":2,"carbs":80,"kcal":126},{"id":3,"name":"Protein Sake","weight":100,"proteins":30,"fats":3,"carbs":20,"kcal":400},{"id":4,"name":"Banana","weight":100,"proteins":5,"fats":3,"carbs":52,"kcal":173},"id":6,"name":"Mango","weight":100,"proteins":90,"fats":0.6,"carbs":24.7,"kcal":99},{"id":7,"name":"Beans","weight":125,"proteins":1,"fats":0,"carbs":12,"kcal":17},{"id":8,"name":"Peas","weight":100,"proteins":3,"fats":2,"carbs":13,"kcal":66},{"id":9,"name":"Chicken breast","weight":100,"proteins":53,"fats":6,"carbs":0,"kcal":284},{"id":10,"Rice":"Banana","weight":100,"proteins":2,"fats":0,"carbs":29,"kcal":133}]',
  },
  userId: { type: String },
})

module.exports = Predefined = mongoose.model('Predefined', predefinedSchema)
