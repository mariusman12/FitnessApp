const express = require('express')
const authProtect = require('../MiddleWares/authProtect')
const Item = require('../Model/Item')
const catchAsync = require('../Utils/catchAsync')
const router = express.Router()

router.put(
  '/getItems',
  authProtect,
  catchAsync(async (req, res, next) => {
    const items = await Item.find({
      userId: req.user._id,
      parentId: req.body.parentId,
      dateIds: req.body.dateIds,
      itemType: req.body.itemType,
    })
    res.status(200).json({
      items,
    })
    next()
  })
)

router.get(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    const items = await Item.find({ userId: req.user._id })
    res.status(200).json({
      items,
    })
  })
)
router.put('/', async (req, res, next) => {
  try {
    const item = await Item.findOneAndDelete({
      itemId: req.body.itemId,
    })
  } catch (err) {
    console.log(err)
  }
  next()
})

router.post(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    const item = await Item.create({
      userId: req.user._id,
      itemId: req.body.itemId,
      item: req.body.item,
      dateIds: req.body.dateIds,
      parentId: req.body.parentId,
      itemType: req.body.itemType,
    })
    res.status(204).json({
      item,
    })
    next()
  })
)

module.exports = router
