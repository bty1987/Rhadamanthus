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

    var userid = -null;
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

    com.focusPage("#reset").on("click", function() {

        initUser();
    });

    com.focusPage("#saveBtn").on("click", function() {

        if (com.validate("edit-basic")) {
            return false;
        }
        var options = {
            "userInfo.user.userPhoto": com.focusPage("#picture").val(),
            "userInfo.user.userId": userid,
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
