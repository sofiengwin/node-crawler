const ensure = require('./ensure');
const Crawler = require('../database/crawlerModel')
const moment = require('moment');
const log = console.log

const today = moment().startOf('day')

const sites = [
    {
      provider: 'Betensured',
      crawlerImplementation: ensure,
    },
]
log({ensure})
const crawler = () => {
  sites.forEach(async ({provider, crawlerImplementation}) => {
    log({provider, crawlerImplementation, ensure})
    const todayTipsByProvider = Crawler.find({provider: provider, createdAt: {$gte: today.toDate()}});

    if (todayTipsByProvider.length ) {
      return;
    }

    const tips = await crawlerImplementation();
    await saveTips(tips);
  })
}

const saveTips = async (tips) => {
  tips.forEach(async (tip) => {
    const newTip = new Crawler(tip);
    await newTip.save()
  })
}

module.exports = {
  crawler
}