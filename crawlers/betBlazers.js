const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
        try {
          const browser = await puppeteer.launch({
            args: ['--no-sandbox']
          })
          const page = await browser.newPage()
          
          await page.goto('https://betblazers.com/betting-tips', {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
          });
    
          const tips = await page.evaluate(() => {
            let count = document.querySelectorAll('.tips-table .rowlink .item').length;
            let picks = []
            for (let i = 0; i < count; i++) {
                let pick = {}
                const date = document.querySelectorAll('.tips-table .rowlink .item')[i].children[0].innerText;
    
                if (new Date(Date.now()).getDate() === +(date.split(' ')[0])) {
                    pick.fixture = document.querySelectorAll('.tips-table .rowlink .item')[i].children[2].children[0].innerText;
                    pick.odd = document.querySelectorAll('.tips-table .rowlink .item')[i].children[4].innerText.split(' ')[0];
                    pick.tip = document.querySelectorAll('.tips-table .rowlink .item')[i].children[3].innerText;
                }
                
                //add odd
                // pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;
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
  const [homeTeam, awayTeam] = pick.fixture.split(/ vs. /);

  return {
    odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}

