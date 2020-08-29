const axios = require('axios');

const RAPID_API_BASE = 'https://api-football-v1.p.rapidapi.com/v2'

const rapidApiClient = (endpoint) => {
  return axios.get(RAPID_API_BASE + endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '7850c93c7amshce44d177e4d57e3p18c434jsn758783b07818',
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
        console.log(error);
    })
}

module.exports = rapidApiClient;