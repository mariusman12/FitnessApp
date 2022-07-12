const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  userId: String,
  itemId: { type: Number, unique: true },
  item: String,
  dateIds: String,
  parentId: String,
  itemType: String,
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
