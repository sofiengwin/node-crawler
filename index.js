const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

const port = process.env.PORT || 3131
const screenshot = require('./screenshot')

const Crawler = require('./database/crawlerModel')
const ensure = require('./crawlers/ensure')

const MONGO_URL = process.env.MONGODB_URL

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to database!!!"))
.catch(err => console.log(err))

app.use(express.json())
app.use(logger("dev"))

app.get('/', async (req, res) => {
  let picks = await ensure()
  res.status(200).json(picks)
})

app.post('/bat', async (req, res) => {
  const data = {
    homeTeam: "Manchester United",
    awayTeam: "Chelsea FC",
    bet: "Man.u",
    fixtureId: 1
  }

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