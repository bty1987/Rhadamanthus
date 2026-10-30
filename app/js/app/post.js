/**
 * app/js/app/post.js —— 请求层（替代旧 com.post）
 *
 * 设计：完全对齐旧 com.post(core.js:119-332) 的对外行为，但只用 layui 内置能力
 * （layui.jquery + layer），不依赖 jQuery 2.0.3 / ace / bootstrap。
 *
 * 复刻的关键行为（与后端 Struts2 拦截器契约一致，业务逻辑零改动）：
 *   1. 注入 authentication：从 Cookie 读取，作为表单字段随 POST 发出。
 *   2. 错误码处理：errorCode==0 成功；110000 累计错误→超限登出；110005 强制锁屏；
 *      其它 → failCallback 或 layer.msg(errorMsg)。
 *   3. 防重复提交：以 query、page、report、count 开头的接口跳过防重；其余在 config.spacing
 *      秒内重复请求被静默拦截（除非 api.intercept===true）。
 *   4. 登录超时：loginTime + timeout 分钟后视为超时，跳登录页。
 *   5. loading：api.loading 配置时显示加载层。
 *   6. 缓存：api.cache 命中则直接返回缓存（params[api.cache]）。
 *
 * 用法：
 *   app.post(api.system.pageRegion, { "paging.page":1, ... }, function(res){ ... });
 *   app.post(api.system.addRegion, { "region.name":"东北" }, cb, failcb);
 */
layui.define(['jquery', 'layer'], function (exports) {

    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;
    var cfg = app.config;

    // 请求历史（防重复提交用），与旧 params.apiHistory 等价
    var apiHistory = {};
    var errorCount = 0;
    var errorTime = 0;

    /**
     * 登出：清 Cookie 并跳登录页
     */
    function logout() {
        app.cookie.del('authentication');
        app.cookie.del('loginTime');
        // 兼容桌面端
        if (window.parent && window.parent !== window && window.parent.isPC) {
            try { window.parent.location.href = '../login.html'; return; } catch (e) {}
        }
        location.href = 'login.html';
    }

    /**
     * 统一 POST 请求
     * @param {Object} api 接口对象（{url, demo?, validate?, type?, tranargs?, cache?, server?, intercept?, loading?}）
     * @param {Object} options 请求参数（扁平点号键，如 "condition.status"、"paging.page"）
     * @param {Function} [callback] 成功回调(errorCode==0)
     * @param {Function} [failCallback] 失败回调(业务错误或网络错误)
     * @param {Boolean} [asyncFlag] false=同步
     */
    function post(api, options, callback, failCallback, asyncFlag) {
        if (api == null) return false;

        var method = api.url;
        var target = method.substring(0, method.indexOf('.'));
        // query*/page*/report*/count* 开头的接口不参与防重
        var noThrottle = /^query|^page|^report|^count|^[a-z]+\/[a-z]+/.test(target);
        var now = Date.now();

        if (!noThrottle && !api.intercept) {
            if (apiHistory.hasOwnProperty(target)) {
                if (now - apiHistory[target] <= cfg.spacing * 1000) {
                    return; // 防重：静默拦截
                }
            }
            apiHistory[target] = now;
        }

        // 登录超时检测
        var loginTime = app.cookie.get('loginTime');
        if (loginTime) {
            loginTime = parseInt(loginTime, 10);
            if (loginTime && (loginTime + cfg.timeout * 60 * 1000) < now) {
                layer.msg('登录已超时，请重新登录', { icon: 0, time: 2000 }, logout);
                return false;
            }
        }

        // 缓存命中
        if (api.cache && app.params[api.cache]) {
            var cached = app.params[api.cache];
            if (callback) return callback(cached);
            return cached;
        }

        // 前端必填校验（与旧 com.post 的 api.validate 一致）
        var opts = $.extend({}, options || {});
        if (api.validate) {
            var valid = true;
            $.each(api.validate, function (k, v) {
                if (v.required && !opts[k]) { valid = false; return false; }
            });
            if (!valid) return false;
        }

        // 选服务器根
        var server = (api.server && cfg[api.server]) ? cfg[api.server] : cfg.server;
        var url;
        if (cfg.demo) {
            if (!api.demo) { layer.msg('Demo状态不能完成此操作', { icon: 2 }); return false; }
            url = 'result/' + api.url.split('.')[0] + '.json';
        } else {
            // ★ 路径修正：server 为空（本地开发同源模式）时，接口 URL 必须用绝对路径，
            //   否则业务页在 views/<module>/ 下，相对 URL 会被解析为 views/<module>/xxx.do。
            if (server) {
                url = server + api.url;
            } else {
                url = '/' + api.url; // 绝对路径，从 web 根解析
            }
            opts.authentication = app.cookie.get('authentication');
        }

        // 金额/数量 ×1000（update 类接口，前端元→后端毫）
        if (api.type == 'update' && api.tranargs && api.tranargs.args) {
            $.each(opts, function (k) {
                if (api.tranargs.args.indexOf(k.replace(/\[\d+\]/g, '')) != -1) {
                    app.utils.accExtend(opts, k);
                }
            });
        }

        // loading
        var loader = null;
        if (api.loading) {
            loader = layer.msg(api.loading.content || '加载中', {
                shade: api.loading.shade != null ? api.loading.shade : 0.2,
                time: (api.loading.time || 5) * 1000,
                icon: 16
            });
        }

        $.ajax({
            url: url,
            data: opts,
            type: url.indexOf('.json') != -1 ? 'GET' : 'POST',
            dataType: 'json',
            async: (asyncFlag === undefined || asyncFlag === true),
            success: function (res) {
                if (res == null) return false;

                if (res.errorCode == 0) {
                    // query 类接口的金额/数量 ÷1000（后端毫→前端元）
                    if (api.type == 'query' && api.tranargs) {
                        var tranargs = api.tranargs.query ? api.tranargs.query : api.tranargs;
                        $.each(tranargs, function (i, v) {
                            app.utils.reduceProp(res, v.result, v.args);
                        });
                    }
                    if (api.cache) app.params[api.cache] = res;
                    if (callback) callback(res);
                    else layer.msg('操作成功', { icon: 1, time: 1000 });
                } else if (res.errorCode == 110000) {
                    errorCount += 1;
                    var t = Date.now();
                    if (errorCount >= 10 && (t - errorTime) <= 60000) { logout(); return; }
                    errorTime = t;
                    if (errorCount >= 5) {
                        layer.msg((res.errorMsg || '') + '<br>请重新登录或联系管理员', { icon: 2, time: 5000 });
                    } else {
                        layer.msg(res.errorMsg || '操作失败', { icon: 2, time: 5000 });
                    }
                    if (failCallback) failCallback(res);
                } else if (res.errorCode == 110005) {
                    logout();
                } else {
                    if (failCallback) failCallback(res);
                    else layer.msg(res.errorMsg || '操作失败', { icon: 2, time: 5000 });
                }
                if (loader) layer.close(loader);
            },
            error: function (xhr) {
                console.error(xhr);
                layer.msg('功能问题，请稍后再试', { icon: 2, time: 3000 });
                if (failCallback) failCallback({ errorCode: -1, errorMsg: '网络错误', xhr: xhr });
                if (loader) layer.close(loader);
            }
        });
    }

    /**
     * 简化版 POST（library 服务用，无 authentication、无错误码处理）
     * 对齐旧 com._post_：直接 callback(res)，不做 errorCode 分支。
     */
    function postRaw(url, data, callback, failCallback, asyncFlag) {
        var $ = layui.jquery;
        var realUrl = (typeof url === 'string') ? url : (cfg.library + url.url);
        $.ajax({
            url: realUrl,
            data: data || {},
            type: 'POST',
            dataType: 'json',
            async: (asyncFlag === undefined || asyncFlag === true),
            success: function (res) { if (callback) callback(res); },
            error: function (xhr) { if (failCallback) failCallback(xhr); }
        });
    }

    // 对外暴露
    app.post = post;
    app.postRaw = postRaw;
    app.logout = logout;

    exports('post', { post: post, postRaw: postRaw, logout: logout });
});
