const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://www.olbg.com/betting-tips/Football/1', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });

        const OLGPicks = await page.evaluate(() => {
          let rows = document.querySelectorAll("#tipsListingContainer-Match tbody tr").length;
          let picks = []

          for (let i = 0; i < rows; i++) {
            let pick = { }

            const date = document.querySelectorAll("#tipsListingContainer-Match tbody tr")[i].children[2];

            const splitted = date ? date.innerText.split('\n') : [ ];
            
            if (date && splitted[splitted.length - 1].includes('Today')) {
              pick.fixture = splitted.find(i => i && i.includes('v'));
              pick.tip = splitted[0];
              picks.push(pick)
            }
          };
          return picks;
        })

        console.log(OLGPicks);
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(OLGPicks.map((pick) => normalizePick(pick)))
      } catch (error) {
        reject(error);
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/ v /);

  return {
    odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip,
    accuracy: pick.accuracy
    
  }
}