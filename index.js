const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const dotenv = require('dotenv')
<<<<<<< HEAD
=======
const moment = require('moment');
const cron = require('node-cron');
const {crawler} = require('./crawlers');
const log = console.log

const today = moment().startOf('day')
>>>>>>> e1e4d44f19307d6eb4094b560c152ffe345033fe

dotenv.config()

const app = express()

const port = process.env.PORT || 3131
<<<<<<< HEAD
=======
const screenshot = require('./screenshot')

const Crawler = require('./database/crawlerModel')
const ensure = require('./crawlers/ensure')
const {save, find, update} = require('./testdb');
const normalizer = require('./normalizer');
>>>>>>> e1e4d44f19307d6eb4094b560c152ffe345033fe

const MONGO_URL = process.env.MONGODB_URL

mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to database!!!"))
.catch(err => console.log(err))

app.use(express.json())
app.use(logger("dev"))

<<<<<<< HEAD
=======
console.log({today}, today.toDate())
>>>>>>> e1e4d44f19307d6eb4094b560c152ffe345033fe
app.get('/', async (_req, res) => {
  const pick = await Crawler.find({normalisedAt: {$type: 9}}).sort({createdAt: -1});
  res.status(200).json(pick)
})

<<<<<<< HEAD
=======
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

>>>>>>> e1e4d44f19307d6eb4094b560c152ffe345033fe
app.listen(port, () => console.log(`app listening on port ${port}!`))