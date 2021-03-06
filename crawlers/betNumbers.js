const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://betnumbers.gr/free-betting-tips', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
   
        const betNumbers = await page.evaluate(() => {
          let count = document.querySelectorAll('.item-featured table tbody')[1].children.length;
          let picks = []
          for (let i = 1; i < count; i++) {
              let pick = {}
              pick.fixture = document.querySelectorAll('.item-featured table tbody')[1].children[i].children[2].textContent.trim()
              let tipAndOdd = document.querySelectorAll('.item-featured table tbody')[1].children[i].children[3].textContent.trim().split(' ')
              pick.tip = tipAndOdd[0]

              //add odd
              pick.odd = tipAndOdd[tipAndOdd.length - 1]

              picks.push(pick);
          }
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(betNumbers.map((pick) => normalizePick(pick)))
      } catch (error) {
        reject(error);
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/-/);

  return {
    odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}