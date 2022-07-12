const express = require('express');

const catchAsync = require('../Utils/catchAsync');

const AppError = require('../Utils/appError');
const Settings = require('../Model/Settings');
const authProtect = require('../MiddleWares/authProtect');

const router = express.Router();

router.get(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    const setting = await Settings.findOne({ userId: req.user._id });
    res.status(200).json({
      setting,
    });
  })
);

router.put(
  '/',
  authProtect,
  catchAsync(async (req, res, next) => {
    const setting = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { setting: req.body.setting }
    );
    res.status(200).json({
      setting,
    });
  })
);

module.exports = router;
