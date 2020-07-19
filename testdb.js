const mongoose = require('mongoose')
const Crawler = require('./database/crawlerModel')
const body = {
  homeTeam: 'Manchester United',
  awayTeam: 'Chelsea',
  fixtureId: '1',
  bet: '1X'
};

//create a user
const newUser = new Crawler(body);

const save = async () => {
  await newUser.save()
}

//find the user
let user;
const find = async () => {
  user = await Crawler.find();
  return user;
}

const update = async (id) => {
  user = await Crawler.updateOne({_id: id}, {
    homeTeamId: 111,
    awayTeamId: 383933,
  })

  return user
}


module.exports = {
  save,
  find,
  update
}

//destroy the user with the object, this will call DELETE where id = our_user_id automatically.
// user.destroy();