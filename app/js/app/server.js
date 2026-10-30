/**
 * app/js/app/server.js —— 服务器地址初始化
 *
 * 与旧 WebContent/js/com/server.js 等价：
 *   - 默认内网模式，按 location.hostname 判断内外网。
 *   - 内网(192.168.*)：communion/server/media = http://192.168.5.21/，library = http://192.168.5.22/。
 *   - 外网：先置空，由 communion.do 接口回填 communion（登录页 initConfig 处理）。
 *
 * 必须在 config.js 之后、post.js 之前加载。
 */
(function () {
    "use strict";

    var cfg = app.config;

    cfg.intranet = true;
    cfg.name = '方林信息平台';
    cfg.ename = 'Fanglin Information Platform';

    // hostname 不以 192.168 开头视为外网
    // 但本地开发（localhost/127.0.0.1，经 dev-server.js 反代 *.do 到 192.168.5.21）时，
    // 视为内网：server/communion/media 留空 → 接口走同源（相对路径），由反代转发到后端。
    if (!location.hostname || /^192\.168/.test(location.hostname)) {
        // 内网：与旧 server.js 保持一致
        cfg.library = 'http://192.168.5.22/';
        cfg.communion = 'http://192.168.5.21/';
        cfg.server = 'http://192.168.5.21/';
        cfg.media = 'http://192.168.5.21/';
    } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        // 本地开发（dev-server.js 反代）：同源，地址留空，*.do 走相对路径
        cfg.intranet = true;
        cfg.library = '';
        cfg.communion = '';
        cfg.server = '';
        cfg.media = '';
    } else {
        // 外网：清空，由 communion.do 回填
        cfg.intranet = false;
        cfg.library = '';
        cfg.communion = '';
        cfg.server = '';
        cfg.media = '';
    }
})();
