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

    // i18n:语言切换。点击立即落库 userprefer + 当前页面 apply 翻译。
    // 不跳转刷新(语言切换不应破坏用户当前编辑/操作);主框架顶栏需用户刷新后翻译。
    com.focusPage("#langStyle button").on("click", function() {

        var lang = $(this).attr("data-lang");
        if (lang === config.lang) return;  // 未变化直接返回

        setLangStyle(lang);
        setUserPrefer("index", "global", "lang", lang);

        if (window.i18n) {
            // setLang 内部已实现:重载语言包 + 全局 apply + 写 localStorage + 落库 userprefer
            i18n.setLang(lang, {
                applyRoot: $('body')
            });
        } else {
            // 兜容:i18n 未加载时直接落库 + 写 localStorage
            try { window.localStorage && window.localStorage.setItem('rhada.lang', lang); } catch (e) {}
            com.post(api.personel.updateUserPrefer, {
                "userPrefer.module": "index",
                "userPrefer.page": "global",
                "userPrefer.pkey": "lang",
                "userPrefer.pvalue": lang
            });
        }
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
