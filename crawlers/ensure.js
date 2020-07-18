const puppeteer = require('puppeteer')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const browser = await puppeteer.launch({
        headless: true, // debug only
        args: ['--no-sandbox']
      })
      const page = await browser.newPage()
    
      await page.goto('https://www.betensured.com/', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
      });
      
      const ensuredPicks = await page.evaluate(() => {
        let count = document.querySelectorAll("#today table tr").length;
        const picks = []
        for (let i = 0; i < count; i++) {
            let pick = {}
            if (document.querySelectorAll("#today table tr")[i].children[0].textContent != '') {
                pick.league = document.querySelectorAll("#today table tr")[i].children[0].textContent
                pick.fixture = document.querySelectorAll("#today table tr")[i].children[1].textContent
                pick.tip = document.querySelectorAll("#today table tr")[i].children[2].children[0].textContent
                pick.odd = document.querySelectorAll("#today table tr")[i].children[2].children[1].textContent
                picks.push(pick)
            }
        }
      
      
        return picks;
      });

      await page.waitFor(1000)

      await browser.close()

      resolve(ensuredPicks)
    })()
  })
}