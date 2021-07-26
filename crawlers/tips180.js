const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
        try {
          const browser = await puppeteer.launch({
            args: ['--no-sandbox']
          })
          const page = await browser.newPage()
        
          await page.goto('https://tips180.com/', {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
          });
    
          const tips180 = await page.evaluate(() => {
            let count = document.querySelectorAll('#tabletoday .table_change tr').length;
            let picks = []
            for (let i = 0; i < count; i++) {
                let pick = {}
                pick.fixture = document.querySelectorAll('#tabletoday .table_change tr')[i].children[2].innerText;
                pick.tip = document.querySelectorAll('#tabletoday .table_change tr')[i].children[3].innerText;
                //add odd
                // pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;
                picks.push(pick);
            }
            return picks;
          })
        
          await page.waitFor(1000)
    
          await browser.close()
    
          resolve(tips180.map((pick) => normalizePick(pick)))
        } catch (error) {
          reject(error);
        }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/vs/);

  return {
    // odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}
