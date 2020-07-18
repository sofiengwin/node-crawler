const screenshot = require('./screenshot')
const fs = require('fs');

(async () => {
  const buffer = await screenshot('https://www.betshoot.com')
  fs.writeFileSync('screenshot.png', buffer.toString('binary'), 'binary')
})()