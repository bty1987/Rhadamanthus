$(function() {

    // standalone拒绝页: 拦截(登录缺失/无效地址/未开放页面/无权限)统一就地显示提示视图, 不再跳转登录页/主页
    function standaloneDeny(title, message, showLogin) {

        $("#standaloneDeniedTitle").text(title);
        $("#standaloneDeniedMsg").text(message || "");
        $("#standaloneDeniedLogin").toggle(showLogin !== false);
        $("#main-container").hide();
        $("#standaloneDenied").fadeIn();
    }

    // 登录态缺失(无cookie且URL未携带authentication): 就地显示, 不再跳转登录页
    if (window.loginTime == undefined) {
        standaloneDeny("登录状态缺失", "请从系统内访问本页面, 或点击下方按钮重新登录");
        return;
    }

    // standalone: 无框宿主初始化 — index.js 裁剪版
    // 保留: 登录验证(queryUserForSelfByUserId+平台权限位)/服务器配置/用户偏好/常量/条件组件/i18n/目标页面装载
    // 摘除: 动态菜单/通知轮询/消息badge/锁屏/单点升级校验/公司切换等框架级功能; 页面内部导航走 com.switchPage 原生支持
    Api().init('js/api/');
    Validator().init();
    Printer().init();

    params.authentication = window.authentication;
    params.loginTime = window.loginTime;

    if (!config.intranet)
        config.communion = window.communion;

    function initUserPrefer(userPrefers) {

        params.user = params.user || {};
        params.user.prefer = params.user.prefer || {};

        $.each(userPrefers || [], function(i, v) {

            params.user.prefer[v.module] = params.user.prefer[v.module] || {};
            params.user.prefer[v.module][v.page] = params.user.prefer[v.module][v.page] || {};
            params.user.prefer[v.module][v.page][v.pkey] = v.pvalue;
        });
    }

    function loadUserPrefers() {

        params.user = params.user || (params.userInfo && params.userInfo.user ? params.userInfo.user : {});
        params.user.prefer = {};

        if (!api.personel || !api.personel.queryUserPrefers)
            return false;

        com.post(api.personel.queryUserPrefers, {
            "userPrefer.module": "searcher"
        }, function(res) {

            initUserPrefer(res.userPrefers);
        }, null, false);

        // i18n:拉取 module=index 的偏好(含 lang), 与 searcher 偏好并存
        // lang 优先级: localStorage(运行时切换同步写入) > userprefer(跨设备同步)
        com.post(api.personel.queryUserPrefers, {
            "userPrefer.module": "index"
        }, function(res) {

            initUserPrefer(res.userPrefers);

            if (window.i18n) {
                // ① localStorage 的 lang(运行时切换同步写入,最权威)
                var localLang = null;
                try { localLang = localStorage.getItem('rhada.lang'); } catch (e) {}
                // ② userprefer 的 lang(跨设备同步源)
                var serverLang = (params.user.prefer.index
                    && params.user.prefer.index.global
                    && params.user.prefer.index.global.lang) ? params.user.prefer.index.global.lang : null;

                var finalLang = localLang || serverLang;
                if (finalLang && finalLang !== i18n.lang) {
                    i18n.setLang(finalLang, {
                        silent: true,        // 不回写 localStorage(避免循环)
                        persist: false,      // 不再回写 userprefer
                        applyRoot: $('body') // 全局 apply
                    });
                }
            }
        }, null, false);
    }

    function initI18n() {

        if (!window.i18n) return;

        // 应用当前语言到页面静态文本
        i18n.apply($('body'));
    }

    // 目标页面装载: redirect.html 分流携带 target(如 /views/quotation/quotationPart.html 或带参 ...html?orderId=xxx)
    // 仅允许 views/ 前缀 html 片段(防开放跳转参数滥用); target=页面自身携带参数, 经 params.urlLoadParams 传给页面 JS(与菜单装载同机制)
    // 页面准入自声明: 页面html首行放标记 <!-- standalone: true --> 即支持standalone直开(纯前端, 各页面自维护, 无集中清单);
    // 未放标记的页面拒绝装载并回登录页; 装载前预取探测一次(静态页双请求无副作用)
    function loadTarget() {

        var target = decodeURIComponent(com.splitUrl(location.href)["target"] || "");

        if (!target || !/^\/?views\/[\w\/.\-]+\.html(\?.*)?$/.test(target)) {
            standaloneDeny("页面不可用", "无效的页面地址");
            return false;
        }

        if (target.indexOf("/") != 0)
            target = "/" + target;

        var fetchUrl = target + (target.indexOf("?") > -1 ? "&" : "?") + "_=" + new Date().getTime();

        $.get(fetchUrl, function(response) {

            if (response.slice(0, 500).indexOf("standalone: true") == -1) {
                standaloneDeny("页面不可用", "该页面未开放standalone访问");
                return;
            }

            params.urlLoadParams = com.splitUrl(target);

            $('#main-container').fadeIn();
            com.switchPage(target);
        }).fail(function() {

            standaloneDeny("页面不可用", "页面不存在或无法访问");
        });
    }

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        params.userInfo = res.userInfo;
        params.user = res.userInfo.user;
        params.user.prefer = {};

        loadUserPrefers();

        initI18n();

        // 平台权限位校验(web, 与 index.html 同水位): 无权限就地提示
        if ((res.userInfo.user.extranet & 8) != 8) {
            standaloneDeny("无访问权限", "当前账号无使用该平台的权限");
            return false;
        }

        if (!config.intranet) {
            com.post(api.system.queryServer, {
                "user.userId": res.userInfo.user.userId
            }, function(res) {

                $.each(res.servers, function(i, v) {

                    config[v.name] = v.host;
                });
            }, null, false);
        }

        Constant().init();

        Condition = Condition(api);
        Condition.init('js/condition/');

        loadTarget();
    }, function(res) {

        standaloneDeny("加载失败", (res && res.errorMsg) || "用户信息加载失败, 请稍后重试");
    });

});
