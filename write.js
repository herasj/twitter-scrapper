const puppeteer = require('puppeteer');
const randomSentence = require('random-sentence');
require('dotenv').config();

const user = process.env.USER_EMAIL;
const pass = process.env.USER_PASS;
const target = process.env.TARGET;

var msg = new Array(150);
for (let index = 0; index < msg.length; index++) {
    msg[index]=(target+' '+ randomSentence().toString());
}
console.table(msg);
(async() => {
    const url = 'https://twitter.com/login'; //Target URL
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }) //Esperar
    console.log('Home');
    await page.screenshot({ path: './screenshots/page.png'});
    await page.waitForSelector('[type=text]');
    await page.type('[type=text]',user,{delay: 50}); //Escribe el usuario en el input de tipo text
    console.log('Email');
    await page.waitForSelector('[type=password]');
    await page.type('[type=password]',pass,{delay: 50}); //Escribe la contraseña en el input de tipo pass
    console.log('Pass');
    await page.waitForSelector('[data-testid="LoginForm_Login_Button"]',{timeout:60000});
    await page.click('[data-testid="LoginForm_Login_Button"]'); //Click Login

    // await page.waitForSelector('[type=text]');
    // await page.type('[type=text]','5p782qej',{delay: 50}); //Escribe la contraseña en el input de tipo pass
    
    // await page.waitForSelector('[type="submit"]');
    // await page.click('[type="submit"]'); //Click Login
    
    await page.screenshot({ path: './screenshots/login.png'});
    await page.waitForSelector('[data-testid="SideNav_NewTweet_Button"]');
    await page.screenshot({ path: './screenshots/newtweet.png'});
    console.log('A twittear');
    for (const iterator of msg) {
        await page.click('[data-testid="SideNav_NewTweet_Button"]'); //Click new tweet
        await page.waitFor(250);
        await page.waitForSelector('[data-text="true"]');
        await page.type('[data-text="true"]',iterator,{delay: 25}); //Escribir tweet
        await page.waitFor(250);
        await page.click('[data-testid="tweetButton"]'); //twitear
        await page.waitFor(2000); //Esperar a que cargue la pantalla de inicio
        await page.screenshot({ path: './screenshots/tweetbustillo.png'});
    }   
    await browser.close(); //Close Chromium 
}
)()
