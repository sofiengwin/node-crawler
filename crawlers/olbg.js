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
      
        await page.goto('https://www.olbg.com/betting-tips/Football/1', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });

        const OLGPicks = await page.evaluate(() => {
          let rows = document.querySelector("#tipsListingContainer-Match tbody").children;
          let picks = []

          for (let i = 0; i < rows.length; i++) {
            if (rows[i].classList.contains('tip-row', 'odds-row')) {
              let pick = { }
              let today = `${new Date(Date.now()).toDateString().split(' ')[1]} ${(Number(new Date(Date.now()).toDateString().split(' ')[2]) + 1).toString()}`;
              let matchDay = rows[i].children[1].children[2].children[0].textContent.trim();

              if (today === matchDay) {
                  pick.fixture = rows[i].children[1].children[0].textContent;
                  pick.tip = rows[i].children[2].children[0].textContent.trim();
                  pick.accuracy = rows[i].children[4].children[1].textContent.trim();
              }
              if (pick.fixture && pick.tip) {
                  picks.push(pick);
              }
            }
          };
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(OLGPicks.map((pick) => normalizePick(pick)))
      } catch (error) {
        Sentry.captureException(error);
        browser.close();
        console.log({error});
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/v/);

  return {
    homeTeam,
    awayTeam,
    bet: pick.tip,
    accuracy: pick.accuracy,
  }
}