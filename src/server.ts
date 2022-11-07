import Koa, { Middleware } from 'koa';
import Router from 'koa-router';
import { capture } from './capture';
import { randomString } from './util';

const KoaStatic = require('koa-static');
const fs = require('fs');

const app = new Koa();
const router = new Router();

const apiController: Middleware = async (ctx, next) => {
    console.log("Request received, rendering frame ...");

    const capturePath = await capture(randomString(36));
    ctx.response.set('Content-Type', 'image/png');
    ctx.body = fs.createReadStream(`public/${capturePath}`);
};

router.get("/", apiController);

app.use(router.routes()).use(router.allowedMethods());
app.use(KoaStatic('public'));
app.listen(8080, () => console.log('Server started on port 8080'));
