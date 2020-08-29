const puppeteer = require('puppeteer')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const browser = await puppeteer.launch({
        headless: true, // debug only
        args: ['--no-sandbox']
      })

      try {
        const page = await browser.newPage()
      
        await page.goto('https://www.stats24.com/football', {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
   
        const stats24Picks = await page.evaluate(() => {
          let count = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1').length;
          let picks = [];
          for (let i = 0; i < count; i++) {
              let pick = {}
              let teams = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[2].innerText.trim().split('\n')
              pick.fixture = teams.join('-')
              pick.tip = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[4].innerText.trim();
              pick.accuracy = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[0].children[3].innerText.trim()
              picks.push(pick)
          }
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(stats24Picks.map((pick) => normalizePick(pick)))
      } catch (error) {
        Sentry.captureException(error);
        browser.close();
        console.log({error});
      }
    })()
  })
}

const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/-/);

  return {
    homeTeam,
    awayTeam,
    bet: pick.tip,
    accuracy: pick.accuracy
  }
}