const ensure = require('./ensure');
const betAdvice = require('./betAdvice');
const stats24 = require('./stats24');
const abraham = require('./abraham');
const footballReport = require('./footballReport');
const betNumbers = require('./betNumbers');
const soccerVista = require('./soccerVista');
const olbg = require('./olbg');
const confirmBets = require('./confirmBets')
const tips180 = require('./tips180')
const tips1960 = require('./1960tips')
const sportyTrader = require('./sportyTrader')
const betblazers = require('./betBlazers')
const betGurus = require('./betGurus')
const wizPredict = require('./wizPredict')

const Crawler = require('../database/crawlerModel')
const moment = require('moment');
const log = console.log
const {addFailureMessage, addStartedCrawlingMessage, addSuccessMessage, postMessage} = require('../slack');
const Sentry = require("../sentry");
const {normalize} = require('../normalizer');

const today = moment().startOf('day')
const slackMessages = []

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
    {
      provider: 'Tips180',
      crawlerImplementation: tips180,
    },
    {
      provider: 'tips1960',
      crawlerImplementation: tips1960,
    },
    {
      provider: 'SportyTrader',
      crawlerImplementation: betblazers,
    },
    {
      provider: 'BetBlazers',
      crawlerImplementation: sportyTrader,
    },
    {
      provider: 'BetGurus',
      crawlerImplementation: betGurus,
    },
    {
      provider: 'WizPredict',
      crawlerImplementation: wizPredict,
    },
]

console.log({today}, today.toDate())
const crawler = async () => {
  for(const providerImplemtation of sites) {
    const {provider, crawlerImplementation} = providerImplemtation;
    slackMessages.push(addStartedCrawlingMessage(provider))
  
    log({provider, crawlerImplementation, ensure})
    const todayTipsByProvider = await Crawler.find({provider: provider, createdAt: {$gte: today.toDate()}});
    if (todayTipsByProvider.length) {
      console.log('already fetched today')
      continue;
    }
    
    let tips = [];
    try { 
      tips = await crawlerImplementation();
    } catch (error) {
      slackMessages.push(addFailureMessage(provider));
      Sentry.captureException(error);
      continue;
    }
  
    await saveTips(tips, provider);
    slackMessages.push(addSuccessMessage(provider, tips));
  }

  await postMessage(slackMessages);
}

const saveTips = async (tips, provider) => {
  for(const tip of tips) {
    const newTip = new Crawler({provider: provider, ...tip});
    const result = await newTip.save();

    // normalize(result);
  }
}


module.exports = {
  crawler
}