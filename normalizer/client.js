const axios = require('axios');
const Sentry = require("../sentry");

const FOOTBALL_API_BASE = process.env.FOOTBALL_API_BASE
const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY

const rapidApiClient = (endpoint) => {
  return axios.get(FOOTBALL_API_BASE + endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': FOOTBALL_API_KEY,
      }
    }
  )
    .then(response => {
      if (response.statusText !== 'OK') {
        throw new Error('Something went wrong');
      }

      return response.data.api;
    })
    .catch(error => {
      Sentry.captureException(error);
      console.log(error);
    })
}

module.exports = rapidApiClient;