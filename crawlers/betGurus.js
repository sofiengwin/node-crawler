// const puppeteer = require('puppeteer');

// (async () => {
//     try {
//       const browser = await puppeteer.launch({
//         headless: false,
//         args: ['--no-sandbox']
//       })
//       const page = await browser.newPage()
      
//       await page.goto('https://betgurushome.com/', {
//         waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
//         timeout: 100000
//       });

//       const tips = await page.evaluate(() => {
//         let count = document.querySelectorAll('.display-posts-listing .content table tbody tr').length;
//         let picks = []
//         for (let i = 1; i < count; i++) {
//             let pick = {}

//             const home = document.querySelectorAll('.display-posts-listing .content table tbody tr')[i].children[2].innerText;
//             const away = document.querySelectorAll('.display-posts-listing .content table tbody tr')[i].children[4].innerText;

//             pick.fixture = `${home.trim()} vs ${away.trim()}`;
//             pick.tip = document.querySelectorAll('.display-posts-listing .content table tbody tr')[i].children[5].innerText;
            
//             //add odd
//             // pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;
//             if (pick.fixture) picks.push(pick);
//         }
//         return picks;
//       })
//       console.log(tips);
    
//       await page.waitFor(1000)

//       await browser.close()

//     //   resolve(tips.map((pick) => normalizePick(pick)))
//     } catch (error) {
//     //   reject(error);
//     console.log(error);
//     }
// })()