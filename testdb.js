const Tip = require('./models').Tip;
const body = {
  homeTeam: 'Manchester United',
  awayTeam: 'Chelsea',
  fixtureId: '1',
  bet: '1X'
};
console.log({Tip})
//create a user
const newUser = Tip.create(body);

//find the user
let user = Tip.findOne({where: {awayTeam: 'Chelsea'}});
console.log({user})
//destroy the user with the object, this will call DELETE where id = our_user_id automatically.
user.destroy();