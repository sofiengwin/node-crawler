const puppeteer = require('puppeteer');
const Sentry = require("../sentry");

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
          headless: true, // debug only
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://betadvice.me/1_5_betting-picks.html', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });

      const betadvicePicks = await page.evaluate(() => {
          let betAdvicePickCount = document.querySelectorAll('#t5 tbody tr td#n1');
          const picks = []
          for (let i = 1; i <= betAdvicePickCount.length; i++) {
              let pick = {}
              pick.fixture = document.querySelector(`#t5 tbody tr.row${i} td#n2`).textContent;
              pick.tip = document.querySelector(`#t5 tbody tr.row${i} td#n3`).textContent;
              pick.accuracy = document.querySelector(`#t5 tbody tr.row${i} td#n5`).textContent;
              picks.push(pick);
          }
          return picks;
        });
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(betadvicePicks.map((pick) => normalizePick(pick)))
      } catch (error) {
        Sentry.captureException(error);
        console.log({error});
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/-/);

  return {
    homeTeam,
    awayTeam,
    bet: pick.tip,
    accuracy: pick.accuracy
  }
}