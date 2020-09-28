const mongoose = require('mongoose')

const CrawlerSchema = mongoose.Schema({
    homeTeam: String,
    awayTeam: String,
    homeTeamId: Number,
    awayTeamId: Number,
    league: String,
    country: String,
    score: String,
    bet: String,
    fixtureId: String,
    consumedAt: {
      type: Date,
      default: null,

    },
    normalisedAt: {
      type: Date,
      default: null,

    },
    eventTimestamp: Date,
    provider: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    accuracy: String,
    outcome: String,
    odd: String
})

module.exports = mongoose.model("crawler", CrawlerSchema)