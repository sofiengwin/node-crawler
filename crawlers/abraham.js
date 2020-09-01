const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://www.abrahamtips.com/', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
   
        const abrahamTips = await page.evaluate(() => {
          let count = document.querySelectorAll('.entry-content tr').length;
          let picks = []
          for (let i = 1; i < count; i++) {
              let pick = {}
              pick.fixture = document.querySelectorAll('.entry-content tr')[i].children[1].innerText;
              pick.tip = document.querySelectorAll('.entry-content tr')[i].children[2].innerText;
              picks.push(pick);
          }
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(abrahamTips.map((pick) => normalizePick(pick)))
      } catch (error) {
        reject(error);
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/vs/);

  return {
    homeTeam,
    awayTeam,
    bet: pick.tip,
  }
}