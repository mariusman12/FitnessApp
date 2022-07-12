const mongoose = require('mongoose')
const validator = require('validator')
const catchAsync = require('../Utils/catchAsync')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please include a valid email'],
    unique: [true, 'This email is already taken, please provide another'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password with 6 or more character'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user account must have a passwordConfirm'],
    validate: {
      validator: function (val) {
        return val === this.password
      },
      message: 'Password in both fields must be same',
    },
    select: false,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  age: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
})
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = catchAsync(async function (
  JWTTimestamp
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }
  return false
})

module.exports = User = mongoose.model('User', userSchema)
