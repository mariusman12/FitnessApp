const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app = require('./app')

dotenv.config({ path: './config.env' })

const db = process.env.DATABASE
process.on('uncaughtException', (err) => {
  console.log('Uncaught exception: shutting down the app')
  console.log(err.name, err.message)
  process.exit(1)
})

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
    })
    console.log('Connected to the database')
  } catch (err) {
    console.error(err.message)

    process.exit(1)
  }
}

connectDB()

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION: Shutting down the app')
  server.close(() => {
    process.exit(1)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`LISTENING TO REQUESTS IN PORT ${PORT}`))
