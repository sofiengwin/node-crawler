const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
        try {
          const browser = await puppeteer.launch({
            args: ['--no-sandbox']
          })
          const page = await browser.newPage()
          
          await page.goto('http://www.wizpredict.com/', {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
          });
    
          const tips = await page.evaluate(() => {
            let count = document.querySelectorAll('table.tg tbody tr').length;
            let picks = []
            for (let i = 0; i < count; i++) {
                let pick = {}
    
                const home = document.querySelectorAll('table.tg tbody tr')[i].children[2].innerText;
                const away = document.querySelectorAll('table.tg tbody tr')[i].children[3].innerText;
    
                pick.fixture = `${home.trim()} vs ${away.trim()}`
                pick.tip = document.querySelectorAll('table.tg tbody tr')[i].children[4].innerText.trim();
                
                if (pick.fixture) picks.push(pick);
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
  const [homeTeam, awayTeam] = pick.fixture.split(/ vs /);

  return {
    // odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}
