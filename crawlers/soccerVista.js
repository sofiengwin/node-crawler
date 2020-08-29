const puppeteer = require('puppeteer')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
          headless: true, // debug only
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://www.soccervista.com/bet.php', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
   
        const soccerVistaPicks = await page.evaluate(() => {
          let rows = document.querySelector('.main tbody').children;
          let picks = []
          for (let i = 0; i < rows.length; i++) {
            let pick = { }
            if (!rows[i].classList.contains('headupe')) {
                let homeTeam = rows[i].children[2].textContent;
                pick.awayTeam = rows[i].children[4].textContent;
                pick.homeTeam = homeTeam
                let tip = rows[i].children[6].textContent;
                pick.tip = tip.includes(homeTeam) ? 1 : 2;
                picks.push(pick);
            }
          };
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(soccerVistaPicks.map((pick) => normalizePick(pick)))
      } catch (error) {
        Sentry.captureException(error);
        browser.close();
        console.log({error});
      }
    })()
  })
}

const normalizePick = (pick) => {
  return {
    homeTeam: pick.homeTeam,
    awayTeam: pick.awayTeam,
    bet: pick.tip,
  }
}