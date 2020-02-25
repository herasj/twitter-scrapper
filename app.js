const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();
const scrollPageToBottom = require("puppeteer-autoscroll-down")
//Variables
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
  

  await page.waitForSelector('[data-testid="AppTabBar_Explore_Link"]',{timeout:60000});
  await page.click('[data-testid="AppTabBar_Explore_Link"]'); //Click SearchButton

  await page.waitForSelector('[data-testid=SearchBox_Search_Input]',{timeout:60000});
  await page.type('[data-testid=SearchBox_Search_Input]',search); //Buscar en twitter


  await page.keyboard.press('Enter',{ waitUntil: 'networkidle2' }); //Buscar y esperar  

  await page.waitForSelector('article',{timeout:60000}); // Esperar a que carguen los articulos
  await page.screenshot({ path: './screenshots/search.png'});//Resultados

//[aria-labelledby="accessible-list-10"] > .css-1dbjc4n > div > div > div
  // await page.click('article',{button: 'middle',clickCount:2, delay: 100}); //Click tweet

  const pages = [0,1,2,3,4];
  for (const iterator of pages) {
    await page.waitForSelector('article',{timeout:60000}); //Esperar a que carguen articulos
    
    const articles = await page.$$('article'); //Obtener todos los elementos que sean de tipo article
    // console.log("Numero articulos: "+articles.length);

    for (const article of articles) { //Escribir cada articulo en un archivo
      const html = await page.evaluate(article => article.textContent, article);
      fs.appendFile('tweets.txt',html+'\n \n', function (err) {
        if (err) throw err;
      });  
    }

    await page.evaluate(_ => {
      window.scrollBy(0, 5*window.innerHeight); //Hacer Scroll hacia abajo para cargar más tweets
    });

    await page.waitFor(20000); //Esperar a que carguen los tweets
    await page.screenshot({ path: `./screenshots/search${iterator.toString}.png`});//Resultados
  }

  

  // const html = await page.evaluate(article => article.textContent, articleHandle);
  // console.dir(html);

  await browser.close(); //Close Chromium 

})();

