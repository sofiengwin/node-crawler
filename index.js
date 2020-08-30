const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')
const {crawler} = require('./crawlers');
const log = console.log
const Crawler = require('./database/crawlerModel');
const normalizer = require('./normalizer');
const Sentry = require('./sentry');

dotenv.config()

const app = express()

const port = process.env.PORT || 3131

const MONGO_URL = process.env.MONGODB_URL

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to database!!!"))
.catch(err => Sentry.captureException(err))

app.use(express.json())
app.use(logger("dev"))

app.get('/', async (_req, res) => {
  const pick = await Crawler.find({normalisedAt: {$type: 9}, consumedAt: {$type: 10}}).sort({createdAt: -1});
  res.status(200).json(pick)
})

app.get('/crawl', async (req, res) => {
  try {
    crawler();

    res.json({message: 'Started Crawler service'})
  } catch (error) {
    Sentry.captureException(error);
    res.json({error})
  }
});

app.get('/normalizr', async (req, res) => {
  try {
    normalizer();

    res.json({message: 'Started Normalizr service'})
  } catch (error) {
    Sentry.captureException(error);
    res.json({error})
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`))