const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        const browser = await puppeteer.launch({
          args: ['--no-sandbox']
        })
        const page = await browser.newPage()
      
        await page.goto('https://confirmbets.com/Free-Football-Predictions', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });

				const confirmBets = await page.evaluate(() => {
					let rows = document.querySelector("#PredictionDetails tbody").children;
					console.log({rows, document})
					window.rows = rows
					let picks = []
					for(let i = 1; i < rows.length; i++) {
						pick = {}
						pick.fixture = rows[i].children[3].textContent;
						pick.tip = rows[i].children[4].textContent;
						picks.push(pick)
					}
					return picks;
				})

        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(confirmBets.map((pick) => normalizePick(pick)))
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
    accuracy: pick.accuracy,
  }
}