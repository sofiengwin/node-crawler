const puppeteer = require('puppeteer');
const Sentry = require("../sentry");

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
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
                let awayTeam = rows[i].children[4].textContent;
                pick.awayTeam = awayTeam;
                pick.homeTeam = homeTeam
                

                //add odd
                let indx = rows[i].children[6].textContent.indexOf('(');
                let odd = 1.5;
                if (indx > 0)
                {
                  let tip = rows[i].children[6].textContent;
                  pick.tip = tip.includes(homeTeam) ? 1 : tip.includes(awayTeam) ? 2 : "X";
                  let oddSelection = +rows[i].children[6].textContent.slice(indx + 1, rows[i].children[6].textContent.length - 1)
                  odd = typeof oddSelection == 'number' ? oddSelection : 1.5;
                }

                pick.odd = odd;
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