import puppeteer from 'puppeteer';

declare var localStorage: any;

const setDomainLocalStorage = async (browser: any, url: any, values: any) => {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (r: any) => {
      r.respond({
        status: 200,
        contentType: 'text/plain',
        body: 'tweak me.',
      });
    });
    await page.goto(url);
    await page.evaluate((values: any) => {
      for (const key in values) {
        localStorage.setItem(key, values[key]);
      }
    }, values);
    
  };

export async function capture(requestId: string): Promise<string> {
    const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--ignore-certificate-errors']});
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({width: 4096, height: 4096});
    await page.setCacheEnabled(false);
    await setDomainLocalStorage(browser, 'http://localhost:3000/', {preferred_profile: '{"name":"ww","textures":[{"name":"elevation_normal","url":"/src/assets/textures/elevation/normal.jpg","textureData":{"metadata":{"version":4.5,"type":"Texture","generator":"Texture.toJSON"},"uuid":"b7f30bf5-6cf7-4b17-8826-d5a6f7e661cd","name":"","image":"b7d399b7-ab7f-47ac-a97f-26ee5140cb6b","mapping":300,"repeat":[1,1],"offset":[0,0],"center":[0,0],"rotation":0,"wrap":[1001,1001],"format":1023,"type":1009,"encoding":3000,"minFilter":1008,"magFilter":1006,"anisotropy":1,"flipY":true,"premultiplyAlpha":false,"unpackAlignment":4}}],"rendererProperties":{"camera":{"type":1,"far":14000,"near":1,"fov":60,"aspect":1,"placement":{"position":{"x":10,"y":100,"z":10},"target":{"x":0,"y":0,"z":0},"rotation":{"isEuler":true,"_x":0,"_y":0,"_z":0,"_order":"XYZ"}}},"fog":{"enabled":false,"color":3735928559,"near":1,"far":12000},"ambient":{"color":14275731,"intensity":1}},"skyProperties":{"turbidity":10,"rayleigh":3,"mieCoefficient":0.005,"mieDirectionalG":0.7,"elevation":7,"azimuth":-87,"exposure":1,"lightProbeIntensity":1},"postProcessorProperties":{"ssao":{"maxDistance":2000,"kernelSize":4,"maxValue":0.55,"contrast":0},"bokeh":{"enabled":false,"focus":4240,"aperture":0.8,"maxBlur":0.0065},"border":{"radius":512,"thickness":200,"color":16777215},"halftone":{"disable":false,"shape":1,"radius":1,"rotateR":0.2617993877991494,"rotateG":0.7853981633974483,"rotateB":0.7853981633974483,"scatter":0,"blending":1,"blendingMode":1,"greyscale":false}},"settings":{"buildings":{"color":746502,"opacity":1,"outlineColor":16711680,"outlineOpacity":1,"outlineWidth":1.2},"roads":{"enabled":true,"color":16711680,"width":5},"water":{"color":9611988},"elevation":{"color":16777215,"specular":16711680,"shininess":1,"topography":{"lineColor":16711680,"lineThickness":0.1,"lineSpacing":2,"lineOffset":0,"lineEmphasisMod":20,"fadeStart":0,"fadeDistance":3680,"normalMapFactor":0.1}}}}'})

    await page.goto('http://localhost:3000/');
    var x: boolean = false;
    do {
        try {
            await page.waitForSelector('#krend-status', {timeout: 3000});
            x = true;
        } catch (e) {
            x = false;
        }
    } while (!x);

    const path = `${requestId}.png`;
    await page.screenshot({path: `public/${path}`});
    await browser.close();

    return path;
}
