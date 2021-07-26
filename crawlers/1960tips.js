const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
        
        await page.goto('https://1960tips.com/', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
  
        const tips = await page.evaluate(() => {
          let count = document.querySelectorAll('.dtable #m0-tip-date-1 .table-row').length;
          x = count;
          let picks = []
          for (let i = 0; i < count; i++) {
              let pick = {}
              pick.fixture = document.querySelectorAll('.dtable  #m0-tip-date-1 .table-row')[i].children[1].children[1].innerText;
              pick.tip = document.querySelectorAll('.dtable  #m0-tip-date-1 .table-row')[i].children[1].children[2].innerText;
              //add odd
              // pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;
              picks.push(pick);
          }
          return picks;
        })
      
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
  const [homeTeam, awayTeam] = pick.fixture.split(/Vs/);

  return {
    // odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}
