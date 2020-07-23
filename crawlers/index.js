const ensure = require('./ensure');
const betAdvice = require('./betAdvice');
const stats24 = require('./stats24');
const abraham = require('./abraham');
const footballReport = require('./footballReport');
const betNumbers = require('./betNumbers');
const soccerVista = require('./soccerVista');
const olbg = require('./olbg');
const confirmBets = require('./confirmBets')
const Crawler = require('../database/crawlerModel')
const moment = require('moment');
const log = console.log
const {postFailure, postStartedCrawling, postSuccess} = require('../slack');

const today = moment().startOf('day')

const sites = [
    {
      provider: 'Betensured',
      crawlerImplementation: ensure,
    },
    {
      provider: 'BetAdvice',
      crawlerImplementation: betAdvice,
    },
    {
      provider: 'Stats24',
      crawlerImplementation: stats24,
    },
    {
      provider: 'AbrahamTips',
      crawlerImplementation: abraham,
    },
    {
      provider: 'AFootballReport',
      crawlerImplementation: footballReport,
    },
    {
      provider: 'SoccerVista',
      crawlerImplementation: soccerVista,
    },
    {
      provider: 'olbg',
      crawlerImplementation: olbg,
    },
    {
      provider: 'ConfirmBets',
      crawlerImplementation: confirmBets,
    },
]
log({ensure})
const crawler = () => {
  sites.forEach(async ({provider, crawlerImplementation}) => {
    await postStartedCrawling(provider)

    log({provider, crawlerImplementation, ensure})
    const todayTipsByProvider = await Crawler.find({provider: provider, createdAt: {$gte: today.toDate()}});
    console.log({todayTipsByProvider})
    if (todayTipsByProvider.length) {
      console.log('already fetched today')
      return;
    }

    // const tips = await crawlerImplementation();
    // // console.log({tips})
    // await saveTips(tips, provider);
    await postSuccess(provider, 10);
  })
}

const saveTips = async (tips, provider) => {
  tips.forEach(async (tip) => {
    console.log({provider})
    const newTip = new Crawler({provider: provider, ...tip});
    await newTip.save()
  })
}


module.exports = {
  crawler
}