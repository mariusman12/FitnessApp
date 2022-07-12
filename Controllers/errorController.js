const AppError = require('../Utils/appError')

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}
const handleDuplicateFieldDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)
  console.log(err)
  const message = `The email: ${value[0]} is taken, please use another value`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data, ${errors.join('; ')}`
  return new AppError(message, 400)
}

const handleJWTError = (err) =>
  new AppError('Invalid Token,Please login again', 401)

const handleTokenExpireError = (err) =>
  new AppError('Session Expired, Please login again', 401)

const sendErrorDev = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
      stack: err.stack,
      error: err,
    })
  } else if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    })
  } else {
    console.log(err)

    return res.status(500).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    })
  }
}

const sendErrorProd = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message,
      })
    }

    console.log('Error: ', err)
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    })
  } else {
    let msg = undefined
    if (!err.isOperational) msg = 'Please try again later'
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: msg || err.message,
    })
  }
}
module.exports = (err, req, res, next) => {
  const { message } = err
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res, req)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message }
    if (err.name === 'CastError' || err.kind === 'ObjectId')
      error = handleCastErrorDB(err)

    if (err.code === 11000) error = handleDuplicateFieldDB(error)

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error)

    if (err.name === 'JsonWebTokenError') error = handleJWTError(error)

    if (err.name === 'TokenExpiredError') error = handleTokenExpireError(error)

    sendErrorProd(error, res, req)
  }

  next()
}
