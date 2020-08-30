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
      
        await page.goto('https://afootballreport.com/predictions/1X2-football-tips', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
   
        const aFootballReportPicks = await page.evaluate(() => {
          let count = document.querySelector('.predictions-table tbody').children.length;
          let picks = []
          for (let i = 0; i < count; i++) {
              let pick = {}
              if (document.querySelector('.predictions-table tbody').children[i].children.length > 2) {
                  let teams = document.querySelector('.predictions-table tbody').children[i].children[1].innerText.split('\n')
                  pick.league = teams.shift();
                  pick.fixture = teams.join('-');
                  pick.tip = document.querySelector('.predictions-table tbody').children[i].children[2].innerText
                  picks.push(pick);
              }
          }
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(aFootballReportPicks.map((pick) => normalizePick(pick)))
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
  }
}