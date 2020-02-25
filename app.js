const puppeteer = require('puppeteer');
require('dotenv').config();
const user = process.env.USER_EMAIL;
const pass = process.env.USER_PASS;
const search = process.env.SEARCH_VAL;
(async () => {
  const url = 'https://twitter.com/login'; //Target URL
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' }) //Esperar

  await page.waitForSelector('[type=text]');
  await page.type('[type=text]',user); //Escribe el usuario en el input de tipo text

  await page.waitForSelector('[type=password]');
  await page.type('[type=password]',pass); //Escribe la contraseña en el input de tipo pass

  
  await page.waitForSelector('[data-testid="LoginForm_Login_Button"]');
  await page.click('[data-testid="LoginForm_Login_Button"]'); //Click Login
  

  await page.waitForSelector('[data-testid="AppTabBar_Explore_Link"]');
  await page.click('[data-testid="AppTabBar_Explore_Link"]'); //Click SearchButton

  await page.waitForSelector('[data-testid=SearchBox_Search_Input]');
  await page.type('[data-testid=SearchBox_Search_Input]',search); //Buscar en twitter



  await page.keyboard.press('Enter',{ waitUntil: 'networkidle2' }); //Buscar y esperar  

  await page.waitForSelector('article'); // Esperar a que carguen los articulos
  await page.screenshot({ path: './screenshots/search.png'});//Resultados
//[aria-labelledby="accessible-list-10"] > .css-1dbjc4n > div > div > div
  await page.click('article',{button: 'middle',clickCount:2, delay: 100}); //Click tweet
  await page.screenshot({ path: './screenshots/tweet.png'});//Tweet SS

  const articleHandle = await page.$$('article'); //Obtener todos los elementos que sean de tipo article
  console.log("Numero articulos: "+articleHandle.length);
  const html = await page.evaluate(article => article.textContent, articleHandle);
  console.dir(html);

  await browser.close(); //Close Chromium 
})();

