const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')
const moment = require('moment');
const cron = require('node-cron');
const {crawler} = require('./crawlers')
const log = console.log

const today = moment().startOf('day')

dotenv.config()

const app = express()

const port = process.env.PORT || 3131
const screenshot = require('./screenshot')

const Crawler = require('./database/crawlerModel')
const ensure = require('./crawlers/ensure')
const {save, find, update} = require('./testdb')

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
  const pick = await Crawler.find({normalisedAt: {$type: 9}});
  res.status(200).json(pick)
})

app.post('/bat', async (req, res) => {
  try {
    let crawler = new Crawler(req.body)
    await crawler.save()

    res.json(crawler)
  } catch (error) {
    res.json({error})
  }

})

app.get('/screenshot', (req, res) => {
  const url = req.query.url;
  (async () => {
    const buffer = await screenshot(url)
    res.setHeader('Content-Disposition', 'attachment; filename="screenshot.png"')
    res.setHeader('Content-Type', 'image/png')
    res.send(buffer)
  })()
})

app.listen(port, () => console.log(`app listening on port ${port}!`))