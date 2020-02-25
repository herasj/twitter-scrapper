const puppeteer = require('puppeteer');
require('dotenv').config();
const user = process.env.USER_EMAIL;
const pass = process.env.USER_PASS;
(async () => {
  const url = 'https://twitter.com/login'; //Target URL
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' }) //Esperar

  await page.waitForSelector('[type=text]');
  await page.type('[type=text]',user); //Escribe el usuario en el input de tipo text

  await page.waitForSelector('[type=password]');
  await page.type('[type=password]',pass); //Escribe la contraseña en el input de tipo pass

  await page.screenshot({ path: './screenshots/form.png', fullPage: 'true' });//Form SS

  await page.waitForSelector('[data-testid="LoginForm_Login_Button"]');
  await page.click('[data-testid="LoginForm_Login_Button"]'); //Click Login
  

  await page.waitForSelector('[data-testid="AppTabBar_Explore_Link"]');
  await page.click('[data-testid="AppTabBar_Explore_Link"]'); //Click SearchButton

  await page.waitForSelector('[data-testid=SearchBox_Search_Input]');
  await page.type('[data-testid=SearchBox_Search_Input]','Uribe'); //Escribe la contraseña en el input de tipo pass

  await page.screenshot({ path: './screenshots/home.png', fullPage: 'true' });//Home SS

  await page.keyboard.press('Enter',{ waitUntil: 'networkidle2' }); //Search 

  await page.waitForSelector('#tweet-text'); //Waait
  await page.screenshot({ path: './screenshots/search.png'});//Search results

  await page.click('#tweet-text'); //Click tweet
  await page.screenshot({ path: './screenshots/tweet.png'});

  const element = await page.$('[class="css-1dbjc4n r-1igl3o0 r-qklmqi r-1adg3ll"]');
  const text = await page.evaluate(element => element, element); //.textContent
  console.log(text);

  await browser.close(); //Close Chromium 
})();

