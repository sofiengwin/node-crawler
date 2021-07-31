const puppeteer = require('puppeteer');

module.exports = function () {
  return new Promise((resolve, reject) => {
    (async () => {
        try {
          const browser = await puppeteer.launch({
            args: ['--no-sandbox']
          })
          const page = await browser.newPage()
          
          await page.goto('https://betgurushome.com/', {
            waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
          });
    
          const tips = await page.evaluate(() => {
            let arr = document.querySelectorAll('.display-posts-listing .content table tbody').item(1).children;
            let picks = []
            for (let i = 1; i < arr.length; i++) {
                let pick = {}
    
                const home = arr.item(i).children[2].innerText;
                const away = arr.item(i).children[4].innerText;
    
                pick.fixture = `${home.trim()} vs ${away.trim()}`;
                pick.tip = arr.item(i).children[5].innerText;
                
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
  const [homeTeam, awayTeam] = pick.fixture.split(/ vs /);

  return {
    // odd: pick.odd,
    homeTeam,
    awayTeam,
    bet: pick.tip
    
  }
}
