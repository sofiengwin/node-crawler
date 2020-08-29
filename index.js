const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')
const moment = require('moment');
const cron = require('node-cron');
const {crawler} = require('./crawlers');
const log = console.log

const today = moment().startOf('day')

dotenv.config()

const app = express()

const port = process.env.PORT || 3131
const screenshot = require('./screenshot')

const Crawler = require('./database/crawlerModel')
const ensure = require('./crawlers/ensure')
const {save, find, update} = require('./testdb');
const normalizer = require('./normalizer');

const MONGO_URL = process.env.MONGODB_URL

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to database!!!"))
.catch(err => console.log(err))

app.use(express.json())
app.use(logger("dev"))

console.log({today}, today.toDate())
app.get('/', async (_req, res) => {
  // let pick = await ensure()
  // const pick = await Crawler.find()
  const pick = await Crawler.find({createdAt: {$gte: today.toDate()}});
  res.status(200).json(pick)
})

app.get('/crawl', async (req, res) => {
  try {
    crawler();

    res.json({message: 'Started Crawler service'})
  } catch (error) {
    res.json({error})
  }
});

app.get('/normalizr', async (req, res) => {
  try {
    normalizer();

    res.json({message: 'Started Normalizr service'})
  } catch (error) {
    res.json({error})
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`))