/**
 * app/js/app/bootstrap.js —— 核心模块引导加载
 *
 * 问题：post.js / api.js / core.js / validate.js 是 layui.define 模块，
 *       普通 <script> 加载不会执行，必须经 layui.use() 触发。
 *       业务页（如 operation.js）依赖 app.post / app.validate 等，需在业务代码前就绪。
 *
 * 用法（业务页 HTML 末尾）：
 *   <script src="../../js/app/bootstrap.js"></script>
 *   bootstrap 之后会自动加载本页同名 JS（由 data-page 指定）。
 *
 *   或在业务 JS 内部第一行：app.ready(function(){ ...layui.use... });
 */
window.app = window.app || {};

/**
 * 加载核心运行时（post/api/core/validate），完成后回调。
 * config/server/utils 是普通脚本（已通过 <script> 加载），无需 use。
 * @param {Function} cb 核心就绪后回调
 */
app.ready = function (cb) {
    // 已就绪则直接回调
    if (app._coreReady) { cb(); return; }
    app._readyQueue = app._readyQueue || [];
    app._readyQueue.push(cb);
    if (app._booting) return;
    app._booting = true;

    // post/apiLoader/core/validate 是核心必选模块。
    // upload 是可选组件（仅图片上传页需要）——不放在这里 use，
    // 否则未引入 upload.js 的页面会因找不到模块而阻塞 bootstrap，导致页面空白。
    // 需要上传的页面：在 bootstrap.js 之前 <script src> 引入 upload.js，
    // 然后在 app.ready 回调内直接用 app.uploadImage / app.upload 即可（upload.js 的 layui.define 会自动注册）。
    layui.use(['post', 'apiLoader', 'core', 'validate'], function () {
        // post/apiLoader/core/validate 已执行，window.app.* 已就位

        // ★ 关键：确保 api 定义文件（system.js 等）在 (1, eval) 执行时，
        //   全局作用域有 $（jQuery）和 api（全局对象）可用。
        //   layui 的内置 jQuery 不自动挂 window.$，需手动暴露。
        var $ = layui.jquery;
        window.$ = window.$ || $;
        window.jQuery = window.jQuery || $;
        window.api = window.api || { index: {}, ds: {} };
        app.api = window.api;

        // 加载业务 API 定义
        // ★ 路径修正：业务页在 views/<module>/ 下（2层深），相对路径 js/api/ 会解析错误。
        //   用绝对路径 /js/api/ 确保从 web 根加载（与页面所在目录无关）。
        if (!app._apiLoaded) {
            app.initApi('/js/api/');
            app._apiLoaded = true;
        }
        app._coreReady = true;
        var q = app._readyQueue;
        app._readyQueue = null;
        for (var i = 0; i < q.length; i++) q[i]();
    });
};
