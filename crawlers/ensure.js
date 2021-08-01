const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://www.betensured.com/', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
        
        const ensuredPicks = await page.evaluate(() => {
          let rows = document.querySelectorAll(".table.table-striped.expert-picks-table tbody").item(0).children;
          const picks = []
          
          for (let j = 0; j < rows.length; j++) {
              let pick = {}

              const row = rows[j].children[0] ? rows[j].children[0].innerText : '';
              const tip = rows[j].children[1] ? rows[j].children[1].innerText : '';

              if (row.split('\n')[1]) {
                pick.fixture = row.split('\n')[1];
                pick.tip = tip;
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
  const [homeTeam, awayTeam] = pick.fixture.split(/ vs /);

  return {
    homeTeam,
    awayTeam,
    bet: pick.tip,
  }
}