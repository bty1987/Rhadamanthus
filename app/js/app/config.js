/**
 * app/js/app/config.js —— 全局配置（普通对象，最早加载）
 *
 * 与旧 WebContent/js/com/config.js、server.js 保持等价语义，便于业务逻辑零改动迁移。
 * 不依赖任何库（login.html 在 layui.ready 之前就需要它）。
 */
window.app = window.app || {};

app.config = {
    // —— 系统开关 ——
    intranet: true,             // server.js 按 location.hostname 自动修正
    demo: false,                // true 时走 result/*.json mock
    system: 1,                  // 业务系统标识（菜单/接口查询会带）

    // —— 调优参数（与旧框架一致） ——
    spacing: 5,                 // 防重复提交间隔（秒）
    timeout: 120,               // 登录超时（分钟）
    singlePointTime: 60000,     // 单点登录心跳间隔（毫秒）
    pageTabLimit: 15,           // 标签页最大数量

    // —— 服务器根地址（server.js 运行时填充） ——
    communion: '',              // 公共服务（登录/验证码）
    server: '',                 // 主业务服务（绝大多数接口）
    media: '',                  // 媒体服务（图片/文件）
    dmedia: '',
    library: '',                // 资源库（com._post_ 走这里）
    store: '',

    // —— UI 资源 ——
    iconImg: 'images/icon_fanglin.png',
    backgroundImg: 'images/bg_fanglin.jpg',

    versionCode: ''
};

/**
 * Cookie 工具 —— 与旧 login.js 的 setCookie 行为一致
 * （path=/，按分钟过期；authentication 令牌后端用同样路径读取）
 */
app.cookie = {
    get: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].replace(/^\s+|\s+$/g, '');
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    },
    set: function (cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    },
    del: function (cname) {
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }
};
