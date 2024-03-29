const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const browser = await puppeteer.launch({
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

              let tip = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[4].innerText.trim();
              if (tip.includes("In Full Time")) {
                tip.replace("In Full Time", "");
              } else if (tip.includes("In 1st Half")) {
                tip.replace("In 1st Half", "");
              }

              pick.odd = tip;
              pick.accuracy = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[0].children[3].innerText.trim()
              pick.tip = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[5].innerText.trim()
              picks.push(pick)
          }
          return picks;
        })
      
        await page.waitFor(1000)
  
        await browser.close()
  
        resolve(stats24Picks.map((pick) => normalizePick(pick)))
      } catch (error) {
        reject(error);
      }
    })()
  })
}
const normalizePick = (pick) => {
  const [homeTeam, awayTeam] = pick.fixture.split(/-/);

  return {
    odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip,
    accuracy: pick.accuracy
  }
}