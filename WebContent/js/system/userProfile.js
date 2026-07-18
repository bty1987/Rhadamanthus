jQuery(function($) {

    var userProfile = {
        userPhoto: "",
        age: null,
        phone: "",
        qq: "",
        wechat: "",
        email: "",
        emergencyMan: "",
        emergencyPhone: "",
        imageName: ""
    };

    com.focusPage("#removePicture").on("click", removePicture);

    var getUserPrefer = function(module, page, key) {

        if (!params.user || !params.user.prefer)
            return null;

        return params.user.prefer[module] && params.user.prefer[module][page] && params.user.prefer[module][page][key];
    };

    var setUserPrefer = function(module, page, key, value) {

        params.user = params.user || {};
        params.user.prefer = params.user.prefer || {};
        params.user.prefer[module] = params.user.prefer[module] || {};
        params.user.prefer[module][page] = params.user.prefer[module][page] || {};
        params.user.prefer[module][page][key] = value;
    };

    var setSearcherViewMode = function(mode) {

        mode = mode || "line";

        com.focusPage("#searcherViewMode button").removeClass("btn-primary").addClass("btn-white");
        com.focusPage('#searcherViewMode button[data-mode="' + mode + '"]').removeClass("btn-white").addClass("btn-primary");
    };

    var setTemplateStyle = function(template) {

        template = config.templates && config.templates[template] ? template : (window.templateStyle || config.defaultTemplate || "ace");

        com.focusPage("#templateStyle button").removeClass("btn-primary").addClass("btn-white");
        com.focusPage('#templateStyle button[data-template="' + template + '"]').removeClass("btn-white").addClass("btn-primary");
    };

    // i18n:语言设置按钮高亮。当前语言取 config.lang(已由 index.js loadUserPrefers 从 userprefer 应用)
    var setLangStyle = function(lang) {

        lang = lang || (window.config && config.lang) || 'cn';
        var support = (window.config && config.supportedLangs) || ['cn', 'tw', 'en'];
        if (support.indexOf(lang) < 0) lang = (window.config && config.defaultLang) || 'cn';

        com.focusPage("#langStyle button").removeClass("btn-primary").addClass("btn-white");
        com.focusPage('#langStyle button[data-lang="' + lang + '"]').removeClass("btn-white").addClass("btn-primary");
    };

    var getTemplateUrl = function(template) {

        var templates = config.templates || {};
        var target = templates[template] || templates[config.defaultTemplate || "ace"];

        return target ? target.url : "index.html";
    };

    var saveTemplateLocal = function(template) {

        try {
            window.localStorage && window.localStorage.setItem("fl_template", template);
        } catch (e) {
        }

        com.setCookie("templateStyle", template, config.timeout);
    };

    var switchTemplate = function(template) {

        saveTemplateLocal(template);

        if (typeof isF5 != "undefined") {
            isF5 = true;
        }

        window.location.href = getTemplateUrl(template) + "?timestamp=" + new Date().getTime();
    };

    var userid = null;
    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        userProfile.userPhoto = res.userInfo.user.userPhoto;
        userProfile.age = res.userInfo.age;
        userProfile.phone = res.userInfo.user.phone;
        userProfile.emergencyMan = res.userInfo.emergencyMan;
        userProfile.emergencyPhone = res.userInfo.emergencyPhone;
        userProfile.qq = res.userInfo.qq;
        userProfile.wechat = res.userInfo.wechat;
        userProfile.email = res.userInfo.email;

        userid = res.userInfo.user.userId;
        initUser();
    });

    function initUser() {

        com.focusPage("#age").val(userProfile.age);
        com.focusPage("#telephone").val(userProfile.phone);
        com.focusPage("#qq").val(userProfile.qq);
        com.focusPage("#wechat").val(userProfile.wechat);
        com.focusPage("#email").val(userProfile.email);
        com.focusPage("#emergencyMan").val(userProfile.emergencyMan);
        com.focusPage("#emergencyPhone").val(userProfile.emergencyPhone);
        com.focusPage("#picture").val(userProfile.userPhoto);

        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), userProfile.userPhoto, 150, 150, ''));
        setSearcherViewMode(getUserPrefer("searcher", "global", "viewMode") || "line");
        setTemplateStyle(getUserPrefer("index", "global", "templateStyle") || window.templateStyle || config.defaultTemplate || "ace");
        setLangStyle(getUserPrefer("index", "global", "lang"));
    }

    com.focusPage("#searcherViewMode button").on("click", function() {

        var mode = $(this).attr("data-mode");

        setSearcherViewMode(mode);
        setUserPrefer("searcher", "global", "viewMode", mode);

        com.post(api.personel.updateUserPrefer, {
            "userPrefer.module": "searcher",
            "userPrefer.page": "global",
            "userPrefer.pkey": "viewMode",
            "userPrefer.pvalue": mode
        });
    });

    com.focusPage("#templateStyle button").on("click", function() {

        var template = $(this).attr("data-template");

        setTemplateStyle(template);
        setUserPrefer("index", "global", "templateStyle", template);

        com.post(api.personel.updateUserPrefer, {
            "userPrefer.module": "index",
            "userPrefer.page": "global",
            "userPrefer.pkey": "templateStyle",
            "userPrefer.pvalue": template
        }, function() {

            switchTemplate(template);
        });
    });

    // i18n:语言切换。落库 userprefer + 写 localStorage + 提示用户刷新主框架。
    // 刷新整个主框架(parent)而非当前 iframe,确保所有业务页面的查询条件/列头/表格
    // 都用新语言重新渲染(searcher 的 tAuto 拦截只在渲染时生效,已渲染的 DOM 不会自动翻译)。
    com.focusPage("#langStyle button").on("click", function() {

        var lang = $(this).attr("data-lang");
        console.log('[i18n-diag] 点击语言切换, target=', lang, 'current config.lang=', config.lang);
        if (lang === config.lang) {
            console.log('[i18n-diag] 语言未变化,直接返回');
            return;
        }

        setLangStyle(lang);
        setUserPrefer("index", "global", "lang", lang);

        // 写 localStorage + 落库 userprefer
        try {
            window.localStorage && window.localStorage.setItem('rhada.lang', lang);
            console.log('[i18n-diag] localStorage rhada.lang 已写入:', localStorage.getItem('rhada.lang'));
        } catch (e) {
            console.log('[i18n-diag] localStorage 写入失败:', e.message);
        }
        // 落库 userprefer:必须同步完成(async:false),否则 reload 时主框架读 userprefer
        // 还是旧 lang,会覆盖 localStorage 的新值,导致切换失效
        if (window.com && com.post && window.api && api.personel && api.personel.updateUserPrefer) {
            com.post(api.personel.updateUserPrefer, {
                "userPrefer.module": "index",
                "userPrefer.page": "global",
                "userPrefer.pkey": "lang",
                "userPrefer.pvalue": lang
            }, function() {
                console.log('[i18n-diag] userprefer 落库成功 lang=', lang);
            }, null, false);   // 第 5 参数 false = 同步请求,确保 reload 前落库完成
        }

        // 提示并刷新主框架。iframe 内页用 parent.location.reload()。
        // 先切换 i18n 到新语言,拿新语言的提示文案
        if (window.i18n) {
            console.log('[i18n-diag] 切换前 i18n.lang=', i18n.lang, 'messageMap keys=', Object.keys(i18n._maps().message).length);
            i18n.setLang(lang, { persist:false, applyRoot:null });
            console.log('[i18n-diag] 切换后 i18n.lang=', i18n.lang, 'messageMap keys=', Object.keys(i18n._maps().message).length);
            console.log('[i18n-diag] t(msg.save)=', i18n.t('msg.save'), 'tAuto(操作成功)=', i18n.tAuto('操作成功'));
        } else {
            console.log('[i18n-diag] window.i18n 不存在!');
        }
        var tipSuccess = (window.i18n) ? i18n.t('msg.opSuccess') : '操作成功';
        var tipRefresh = (window.i18n) ? i18n.t('msg.langChanged') : '语言已切换,即将刷新页面以完全生效';

        layer.msg(tipSuccess + ', ' + tipRefresh, { icon: 1, time: 1500 }, function() {
            console.log('[i18n-diag] 触发主框架 reload');
            try {
                // 优先刷新主框架(让顶栏/菜单/iframe 全部重载)
                if (window.parent && window.parent !== window) {
                    window.parent.location.reload();
                } else {
                    window.location.reload();
                }
            } catch (e) {
                console.log('[i18n-diag] parent reload 失败,改刷新当前页:', e.message);
                window.location.reload();
            }
        });
    });

    com.focusPage("#reset").on("click", function() {

        initUser();
    });

    com.focusPage("#saveBtn").on("click", function() {

        if (com.validate("edit-basic")) {
            return false;
        }

        var saveUserId = userid || (params.userInfo && params.userInfo.user ? params.userInfo.user.userId : null);
        if (!saveUserId) {
            com.showAlert(com.warning, "用户信息加载中，请稍后再试");
            return false;
        }

        var options = {
            "userInfo.user.userPhoto": com.focusPage("#picture").val(),
            "userInfo.user.userId": saveUserId,
            "userInfo.user.phone": com.focusPage("#telephone").val(),
            "userInfo.age": com.focusPage("#age").val(),
            "userInfo.emergencyMan": com.focusPage("#emergencyMan").val(),
            "userInfo.emergencyPhone": com.focusPage("#emergencyPhone").val(),
            "userInfo.qq": com.focusPage("#qq").val(),
            "userInfo.wechat": com.focusPage("#wechat").val(),
            "userInfo.email": com.focusPage("#email").val()
        };

        com.post(api.personel.updateUserForBaseInfo, options, function(res) {

            userProfile.userPhoto = com.focusPage("#picture").val();
            userProfile.age = com.focusPage("#age").val();
            userProfile.phone = com.focusPage("#telephone").val();
            userProfile.emergencyMan = com.focusPage("#emergencyMan").val();
            userProfile.emergencyPhone = com.focusPage("#emergencyPhone").val();
            userProfile.qq = com.focusPage("#qq").val();
            userProfile.wechat = com.focusPage("#wechat").val();
            userProfile.email = com.focusPage("#email").val();

            com.showAlert(com.info, "操作成功");
        });
    });

    function removePicture() {

        com.focusPage("#showImg").attr("src", "#");
        com.focusPage("#picture").val("");
        com.focusPage("#infoPicture").attr("href", "javascript:void(0)");
    }

    com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {
        'uploadType': 0,
        'name': 'oss-fanglin-erp'
    }, 1, function(data) {

        com.focusPage("#picture").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        if (data.name) {
            com.focusPage("#picture").val(data.name);
            com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.name, 150, 150, '', '', 3, {
                "name": "oss-fanglin-erp"
            }));
        }

        com.focusPage("#showImg").show();
    });

});
