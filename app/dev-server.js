/*!
 * app/dev-server.js —— 本地开发反代服务器（零依赖，node 内置模块）
 *
 * 作用：
 *   - 把 app/ 当静态站点提供（http://localhost:8088/）
 *   - 把 *.do 请求反代到内网后端 192.168.5.21（与现有 ERP 同源策略一致）
 *   - 改写 Set-Cookie 的 domain，让 authentication Cookie 落在 localhost
 *   这样浏览器看到的全是同源(localhost)，登录/认证/CORS 全部自然解决。
 *
 * 启动：
 *   node app/dev-server.js                 # 默认 :8088，后端 192.168.5.21
 *   node app/dev-server.js 9090            # 自定义端口
 *   node app/dev-server.js 9090 10.0.0.5   # 自定义端口+后端 IP
 *
 * 然后浏览器打开 http://localhost:8088/login.html
 *
 * 注意：这是开发工具，不参与打包、不会被业务页引用。生产部署走 nginx/容器。
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ============ 配置 ============
const PORT = parseInt(process.argv[2], 10) || 8088;
const BACKEND_HOST = process.argv[3] || '192.168.5.21';
const BACKEND_PORT = 80;
const APP_ROOT = __dirname; // app/ 目录

// ============ MIME 类型 ============
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
    '.map': 'application/json'
};

// ============ 静态文件服务 ============
function serveStatic(req, res, pathname) {
    // 默认首页
    if (pathname === '/' || pathname === '') pathname = '/login.html';

    // 安全：禁止路径穿越
    const filePath = path.join(APP_ROOT, decodeURIComponent(pathname));
    if (!filePath.startsWith(APP_ROOT)) {
        res.writeHead(403); res.end('Forbidden'); return;
    }

    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + pathname);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

// ============ 反代到后端 ============
function proxyToBackend(req, res, pathname) {
    const parsed = url.parse(req.url, true);
    const targetPath = parsed.pathname + (parsed.search || '');

    // 收集请求 body
    const chunks = [];
    req.on('data', function (c) { chunks.push(c); });
    req.on('end', function () {
        const body = Buffer.concat(chunks);

        // 转发请求头，修正 Host
        const headers = Object.assign({}, req.headers);
        headers['host'] = BACKEND_HOST + ':' + BACKEND_PORT;
        // 移除可能引发 CORS 预检的 Origin（后端不校验也无所谓）
        delete headers['origin'];
        delete headers['referer'];

        const proxyReq = http.request({
            hostname: BACKEND_HOST,
            port: BACKEND_PORT,
            path: targetPath,
            method: req.method,
            headers: headers
        }, function (proxyRes) {
            // 改写 Set-Cookie 的 domain → localhost，并把 path 保留
            const setCookies = proxyRes.headers['set-cookie'];
            const respHeaders = Object.assign({}, proxyRes.headers);
            if (setCookies) {
                respHeaders['set-cookie'] = setCookies.map(function (c) {
                    // 去掉 domain=后端IP，让 Cookie 落在 localhost；保留 path/expires
                    return c.replace(/domain=[^;]+;?\s*/gi, '');
                });
            }
            // 允许前端跨域读（同源下其实不需要，保险起见）
            respHeaders['access-control-allow-origin'] = '*';

            res.writeHead(proxyRes.statusCode, respHeaders);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', function (e) {
            console.error('[proxy error]', targetPath, e.message);
            res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ errorCode: -1, errorMsg: '后端不可达: ' + e.message }));
        });

        if (body.length) proxyReq.write(body);
        proxyReq.end();
    });
}

// ============ 主服务 ============
const server = http.createServer(function (req, res) {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname || '/';

    // OPTIONS 预检直接放行
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'access-control-allow-headers': '*'
        });
        res.end(); return;
    }

    // *.do / communion.do / 验证码 / 二维码 → 反代后端
    const isDo = /\.do(\?|$)/.test(pathname) || pathname.indexOf('/verifyCode') === 0;

    // 静态资源命中规则：这些扩展名且文件存在 → 静态；否则若像接口 → 反代
    if (isDo) {
        proxyToBackend(req, res, pathname);
    } else {
        serveStatic(req, res, pathname);
    }
});

server.listen(PORT, function () {
    console.log('====================================================');
    console.log('  Rhadamanthus 纯 LayUI 前端 - 本地开发服务器');
    console.log('====================================================');
    console.log('  前端地址:   http://localhost:' + PORT + '/login.html');
    console.log('  后端反代:   http://' + BACKEND_HOST + ':' + BACKEND_PORT + '  (*.do)');
    console.log('  静态根:     ' + APP_ROOT);
    console.log('----------------------------------------------------');
    console.log('  浏览器打开上面"前端地址"即可登录体验');
    console.log('  按 Ctrl+C 停止');
    console.log('====================================================');
});
