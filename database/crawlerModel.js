const mongoose = require('mongoose')

const CrawlerSchema = mongoose.Schema({
    homeTeam: String,
    awayTeam: String,
    bet: String,
    fixtureId: String,
    consumedAt: {
      type: Date,
      default: Date.now()
    }
})

module.exports = mongoose.model("crawler", CrawlerSchema)