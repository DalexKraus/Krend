import puppeteer from 'puppeteer';

export async function capture(requestId: string): Promise<string> {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
  
    await page.setViewport({width: 1080, height: 1920});
    await page.goto('https://kaart-seven.vercel.app/');
    await page.waitForSelector('#krend-status', {timeout: 60000});

    const path = `${requestId}.png`;
    await page.screenshot({path: `public/${path}`});
    await browser.close();

    return path;
}
