const express = require('express');
const authProtect = require('../MiddleWares/authProtect');
const Predefined = require('../Model/Predefined');
const catchAsync = require('../Utils/catchAsync');

const router = express.Router();

router.get(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    const data = await Predefined.findOne({ userId: req.user._id });
    res.status(200).json({
      predefined: data.predefined,
    });
  })
);

router.post(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    await Predefined.findOneAndDelete({ userId: req.user._id });
    const predefined = await Predefined.create({
      userId: req.user._id,
      predefined: req.body.predefined,
    });
    res.status(201).json({
      predefined: predefined,
    });
  })
);

module.exports = router;
