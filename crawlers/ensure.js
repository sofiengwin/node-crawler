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
      
        await page.goto('https://www.betensured.com/', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
        
        const ensuredPicks = await page.evaluate(() => {
          let count = document.querySelectorAll("#today table tr").length;
          const picks = []
          for (let i = 0; i < count; i++) {
              let pick = {}
              if (document.querySelectorAll("#today table tr")[i].children[0].textContent != '') {
                  pick.fixture = document.querySelectorAll("#today table tr")[i].children[1].textContent
                  pick.tip = document.querySelectorAll("#today table tr")[i].children[2].children[0].textContent
                  picks.push(pick)
              }
          }
        
        
          return picks;
        });
  
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(ensuredPicks.map((pick) => normalizePick(pick)))
      } catch (error) {
        Sentry.captureException(error);
        browser.close();
        console.log({error});
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