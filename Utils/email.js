const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'yoursolutions404@gmail.com',
    pass: 'yoursolutions@123',
  },
})

module.exports = transporter
