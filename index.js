const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const port = process.env.PORT || 3131

const MONGO_URL = process.env.MONGODB_URL

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to database!!!"))
.catch(err => console.log(err))

app.use(express.json())
app.use(logger("dev"))

app.get('/', async (_req, res) => {
  const pick = await Crawler.find({normalisedAt: {$type: 9}}).sort({createdAt: -1});
  res.status(200).json(pick)
})

app.listen(port, () => console.log(`app listening on port ${port}!`))