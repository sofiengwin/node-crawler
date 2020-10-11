const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://www.betensured.com/', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
        
        const ensuredPicks = await page.evaluate(() => {
          let count = document.querySelectorAll("#today table tr").length;
          const picks = []
          for (let j = 0; j < count; j++) {
              let pick = {}
              if (document.querySelectorAll("#today table tr")[j].children[0].textContent != '') {
                  pick.fixture = document.querySelectorAll("#today table tr")[j].children[1].textContent
                  pick.tip = document.querySelectorAll("#today table tr")[j].children[2].children[0].textContent
                  picks.push(pick)
              }
          }
        
        
          return picks;
        });
  
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(ensuredPicks.map((pick) => normalizePick(pick)))
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