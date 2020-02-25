const puppeteer = require('puppeteer');
const randomSentence = require('random-sentence');
require('dotenv').config();

const user = process.env.USER_EMAIL;
const pass = process.env.USER_PASS;
var msg = [];
for (let index = 0; index < 5; index++) {
    msg.push(randomSentence());
}
(async() => {
    const url = 'https://twitter.com/login'; //Target URL
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }) //Esperar

    await page.waitForSelector('[type=text]');
    await page.type('[type=text]',user,{delay: 100}); //Escribe el usuario en el input de tipo text

    await page.waitForSelector('[type=password]');
    await page.type('[type=password]',pass,{delay: 100}); //Escribe la contraseña en el input de tipo pass

    await page.waitForSelector('[data-testid="LoginForm_Login_Button"]',{timeout:60000});
    await page.click('[data-testid="LoginForm_Login_Button"]'); //Click Login
    
    await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]');

    for (const iterator of msg) {
        await page.click('[data-testid="SideNav_NewTweet_Button"]'); //Click new tweet
        await page.waitFor(500);
        await page.waitForSelector('[data-text="true"]');
        await page.type('[data-text="true"]',iterator,{delay: 50}); //Escribir tweet
        await page.waitFor(500);
        await page.click('[data-testid="tweetButton"]'); //twitear
        await page.waitFor(5000); //Esperar a que cargue la pantalla de inicio
    }   
    await browser.close(); //Close Chromium 
}
)()