const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
        try {
          const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
          })
          const page = await browser.newPage()
          
          await page.goto('https://www.sportytrader.com/en/betting-tips/', {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
          });
    
          const tips = await page.evaluate(() => {
            let count = document.querySelectorAll('.betting-tip-wrapper .betting-cards > .betting-card').length;
            let picks = []
            for (let i = 0; i < count; i++) {
                let pick = {}
                pick.fixture = document.querySelectorAll('.betting-tip-wrapper .betting-cards > .betting-card')[i].children[0].getAttribute('content');
                pick.tip = document.querySelectorAll('.betting-tip-wrapper .betting-cards > .betting-card')[i].children[2].children[0].children[2].children[0].children[1].innerText;
                //add odd
                // pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;
                picks.push(pick);
            }
            return picks;
          })
          console.log(tips);
        
          await page.waitFor(1000)
    
          await browser.close()
    
          resolve(tips.map((pick) => normalizePick(pick)))
        } catch (error) {
          reject(error);
        }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/ - /);

  return {
    // odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}
