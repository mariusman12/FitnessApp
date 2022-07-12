const AppError = require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync')
const jwt = require('jsonwebtoken')
const util = require('util')
const User = require('../Model/User')

module.exports = authProtect = catchAsync(async (req, res, next) => {
  const token = req.header('x-auth-token')

  if (!token) return next(new AppError('No token, authorization denied', 401))

  const decodedPayload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  )

  const currentUser = await User.findById(decodedPayload.id)
  if (!currentUser) return next(new AppError('The user doesnot exists', 401))

  req.user = currentUser
  next()
})
