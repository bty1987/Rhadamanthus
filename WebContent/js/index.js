$(function() {

    Api().init('js/api/');
    Validator().init();
    Printer().init();

    var interval = null;

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

        // i18n:拉取 module=index 的偏好(含 lang / templateStyle),与 searcher 偏好并存
        // lang 用服务端值覆盖本地(silent+不持久化),保证跨设备一致
        com.post(api.personel.queryUserPrefers, {
            "userPrefer.module": "index"
        }, function(res) {

            initUserPrefer(res.userPrefers);

            if (window.i18n && params.user.prefer.index
                && params.user.prefer.index.global
                && params.user.prefer.index.global.lang) {

                i18n.setLang(params.user.prefer.index.global.lang, {
                    silent: true,        // 不回写 localStorage(服务端已是权威源)
                    persist: false,      // 不再回写 userprefer(就是从那儿读的)
                    applyRoot: $('body') // 全局 apply
                });
            }
        }, null, false);
    }

    /**
     * i18n 主框架初始化:apply 当前语言到全局顶栏/导航静态文本
     * 语言切换 UI 已移至个人资料页(userProfile),此处仅负责应用偏好语言
     * 由 queryUserForSelfByUserId 回调中(用户偏好拉完后)调用一次
     */
    function initI18n() {

        if (!window.i18n) return;

        // 应用当前语言到全局(顶栏/导航/页面静态文本)
        i18n.apply($('body'));
    }

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        params.userInfo = res.userInfo;
        params.user = res.userInfo.user;
        params.user.prefer = {};

        loadUserPrefers();

        // i18n:用户偏好(含 lang)拉完后,apply 全局
        initI18n();

        if (parent.window.isPC && (res.userInfo.user.extranet & 16) != 16) {
            alert(i18n.t('msg.noPermission'));
            nwRestart();
        }

        if (!parent.window.isPC && (res.userInfo.user.extranet & 8) != 8) {
            alert(i18n.t('msg.noPermission'));
            window.location.href = '/';
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

        $(".user-info-dropmenu .user-name").text(res.userInfo.user.currentName);
        $(".user-info-dropmenu #userId").text(res.userInfo.user.currentName);
        $(".user-name").text(res.userInfo.user.currentName);

        $("#userInfoId").text(res.userInfo.user.currentName);
        $("#userLeftId").text(res.userInfo.user.currentName);

        window.userLockName = res.userInfo.user.currentName;
        window.userLockPhoto = res.userInfo.user.userPhoto;

        com.showImg($("#userImg"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgleft"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgtop"), res.userInfo.user.userPhoto, 60, 60, '');

        setWatermark(res.userInfo.user.currentName, res.userInfo.user.userId);

        com.post(api.system.queryCompanyByCid, {
            "company.cid": res.userInfo.user.companys
        }, function(data) {

            params.company = data.company;
            $(".companyinfo .companyName").text(data.company.name);
        });

    }, function(res) {

        if (parent.window.isPC) {
            nwRestart();
        } else {
            window.location.href = '/';
        }
    }, false);

    com.post(api.system.queryModuleForLogin, {
        "module.system": 1
    }, createMenu);

    $(".nav-search .nav-search-input").keyup(function() {

        com.focusPage(".marksearch").removeClass("marksearch");

        var data = $(this).val();

        if (data != "") {
            var elements = com.focusPage(":contains('" + data + "')");
            $.each(elements, function(i, e) {

                var _e = $(e);
                if (_e.children().length == 0) {
                    console.log(_e)
                    _e.addClass('marksearch');
                }
            });
        }
    }).keypress(function(event) {

        if (event.keyCode == 13)
            return false;
    });

    $("#versionName").text(parent.window.isPC ? "(PC)" : "(WEB)");
    $("#versionCode").text(config.versionCode);

    $(".userProfile").attr("href", api.index.userProfile.url + "?timestamp=" + new Date().getTime());
    $(".userProfile").data("level", 1);

    $(".changePassword").attr("href", api.index.changePasswordIndex.url + "?timestamp=" + new Date().getTime());
    $(".changePassword").data("level", 1);

    $(".messageList").attr("href", api.index.messageIndex.url + "?timestamp=" + new Date().getTime());
    $(".messageList").data("level", 1);

    function getTemplateUrl(template) {

        var templates = config.templates || {};
        var target = templates[template] || templates[config.defaultTemplate || "ace"];

        return target ? target.url : "index.html";
    }

    function getTemplateLocal() {

        var template = null;

        try {
            template = window.localStorage && window.localStorage.getItem("fl_template");
        } catch (e) {
        }

        if (!template) {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].replace(/^\s+|\s+$/g, "");

                if (cookie.indexOf("templateStyle=") == 0) {
                    template = cookie.substring("templateStyle=".length);
                    break;
                }
            }
        }

        return config.templates && config.templates[template] ? template : null;
    }

    function saveTemplateLocal(template) {

        try {
            window.localStorage && window.localStorage.setItem("fl_template", template);
        } catch (e) {
        }

        com.setCookie("templateStyle", template, config.timeout);
    }

    function loadIndexPrefer() {

        if (!api.personel || !api.personel.queryUserPrefers) {
            return false;
        }

        var localTemplate = getTemplateLocal();
        var remoteTemplate = null;

        com.post(api.personel.queryUserPrefers, {
            "userPrefer.module": "index"
        }, function(res) {

            initUserPrefer(res.userPrefers);

            $.each(res.userPrefers || [], function(i, v) {

                if (v.page == "global" && v.pkey == "templateStyle" && config.templates && config.templates[v.pvalue]) {
                    remoteTemplate = v.pvalue;
                    params.templateStyle = remoteTemplate;
                    return false;
                }
            });
        }, null, false);

        if (!localTemplate && remoteTemplate && remoteTemplate != window.templateStyle) {
            saveTemplateLocal(remoteTemplate);

            isF5 = true;
            window.location.href = getTemplateUrl(remoteTemplate) + "?timestamp=" + new Date().getTime();

            return true;
        }

        return false;
    }

    if (loadIndexPrefer()) {
        return false;
    }

    if (utils.isMobile()) {
        $("#faqInfo").parent().hide();
        $("#versionInfo").parent().hide();
    }

    params.userCompany = window.userCompany;

    com.post(api.personel.queryUserCompany, {
        "user.uid": params.userInfo.user.uid
    }, function(res) {

        var companysel = $('#companysel').html("");
        var moreCompany = $("#moreCompanyList").html("");

        var companyGroup = null;
        var companys = [];
        var index = 5; // 下拉默认显示五项 , 公司数量超过五个时第五项显示更多公司
        var companyIndex = res.userCompanys.length > index ? index - 1 : index;

        $.each(res.userCompanys, function(i, v) {

            if (i % 3 == 0)
                companyGroup = $("<div></div>").addClass("form-group").appendTo(moreCompany);

            var $btn = $("<button></button>").addClass("btn btn-link col-md-4").text(v.company.name).appendTo(companyGroup);

            $btn.click(function() {

                return changeCompany(v.company);
            });

            if (i < companyIndex) {

                var $li = $('<li></li>').appendTo(companysel);
                var $a = $('<a></a>').attr('data-cid', v.company.cid).text(v.company.name).appendTo($li);

                $a.click(function(e) {

                    return changeCompany(v.company);
                });
            }

            companys.push(v.company);
        });

        if (res.userCompanys.length > index) {

            var $di = $('<li class="divider"></li>').appendTo(companysel);
            var $li = $('<li></li>').appendTo(companysel);
            var $a = $('<a></a>').text("更多公司").appendTo($li);

            $a.click(function(e) {

                com.popup4model($('#layerCompany'), '切换公司');
            });
        }

        com.selectTypeahead($('#typeaheadCompany'), companys, "cid", "name", function(list, k, v) {

            changeCompany({
                "cid": k
            });
        });
    }, null, false);

    function changeCompany(company) {

        var companysel = $('#companysel');

        params.selectCaching = {};

        com.post(api.common.changeAuthCode, {
            "company": company.cid
        }, function(res) {

            for ( var key in params) {
                if (key.indexOf("PostData") != -1) {
                    params[key] = null;
                }
            }
            params.authentication = res.authentication;
            window.authentication = res.authentication;

            loadUserPrefers();

            com.post(api.system.queryCompanyByCid, {
                "company.cid": company.cid
            }, function(res) {

                params.company = res.company;
                $(".companyinfo .companyName").text(res.company.name)
            }, null, false);

            com.switchPage(api.index.homeIndex.url, true);

            // 切换公司后 目录所有菜单收起
            foldMenu();

            companysel.parent().removeClass("open");

            com.closePopup();

            Constant().init();

        }, null, false);

        return false;
    }

    $.breadcrumb('icon-home', ['首页']);
    
    function getCookie(name) {
        const nameEncoded = encodeURIComponent(name);
        const cookieString = `; ${document.cookie}`;
        const parts = cookieString.split(`; ${nameEncoded}=`);
        
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(';').shift());
        }
        
        return null;
    }

    $("#logout").on("click", function(e) {
        
        if(config.oss){
            $.ajax({
                url: config.server + '/logoutAuthCode.do',
                data: {"userId": params.userInfo.user.userId, "osstoken": getCookie('osstoken'), "domain": config.server},
                type: "post",
                dataType: "json",
                async: false,
                success: function (res) {
                    clearCookiesByDomain(config.server);
                    clearCookiesByDomain("fanglin.vip");
                }
            });
        }

        if (parent.window.isPC) {
            nwRestart();
        } else {
            com.deleteCookie("authentication");
            window.location.href = '/';
        }
    });
    
    function clearCookiesByDomain(domain) {
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var domainIndex = cookie.indexOf("domain=");
            if (domainIndex > -1 && cookie.substr(domainIndex + 7).indexOf(domain) === 0) {
                document.cookie = cookie.split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=" + domain;
            }
        }
    }

    $("a.userProfile").attr({
        "mid": "userProfileTab",
        "menuText": "个人资料",
        "icon": "icon-user"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage($this.attr("href"), $this);

        $.breadcrumb('icon-user', ['个人资料']);

        return false;
    });

    $("a.changePassword").attr({
        "mid": "changePasswordTab",
        "menuText": "修改密码",
        "icon": "icon-cog"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage($this.attr("href"), $this);

        $.breadcrumb('icon-cog', ['修改密码']);

        return false;
    });

    $("#indexBtn").attr({
        "mid": "homePage",
        "menuText": "首页"
    }).on("click", function(e) {

        foldMenu();

        com.loadPage('home-antv.html', $(this));

        $.breadcrumb('icon-home', ['首页']);

        return false;
    });

    $(".messageList").attr({
        "mid": "messageListTab",
        "menuText": "消息查看",
        "icon": "icon-envelope"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage($this.attr("href"), $this);

        $.breadcrumb('icon-envelope', ['消息查看']);

        return false;
    });

    $("#versionInfo").attr({
        "mid": "versionInfoTab",
        "menuText": "版本",
        "icon": "icon-bookmark"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();

        com.loadPage(api.index.versionIndex.url, $(this));

        $.breadcrumb('icon-bookmark', ['版本']);

        return false;
    });

    $("#faqInfo").attr({
        "mid": "faqInfoTab",
        "menuText": "帮助",
        "icon": "icon-key"
    }).on("click", function(e) {

        foldMenu();

        com.loadPage(api.index.faqIndex.url, $(this));

        $.breadcrumb('icon-bookmark', ['帮助']);

        return false;
    });

    $("#userLock").on("click", function(i) {

        doLocking();
    });

    $("button.userProfile").attr({
        "mid": "userProfileTab",
        "menuText": "个人资料",
        "icon": "icon-cogs"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage($this.attr("href"), $this);

        $.breadcrumb('icon-user', ['个人资料']);

        return false;
    });

    $("button.changePassword").attr({
        "mid": "changePasswordTab",
        "menuText": "修改密码",
        "icon": "icon-user"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage($this.attr("href"), $this);

        $.breadcrumb('icon-cog', ['修改密码']);

        return false;
    });

    $("#btn-scroll-license").attr({
        "mid": "license",
        "menuText": "License",
        "icon": "icon-copyright"
    }).on("click", function(e) {

        var $this = $(this);

        foldMenu();
        navControl($this);

        com.loadPage(api.index.license.url, $this);

        $.breadcrumb('icon-copyright', ['License']);

        return false;
    });

    params.homeLoader = false;

    var loadHomePage = function() {
        console.log('[diag] loadHomePage called, config:', !!config, 'homeLoader:', params.homeLoader, 'fl-container:', $('#fl-container').length);

        if (config && !params.homeLoader) {
            $('#navbar').fadeIn();
            $('#main-container').fadeIn();
            com.switchPage('home-antv.html', true);
            params.homeLoader = true;
            setTimeout(function() {
                console.log('[diag] after switchPage, #homeNav:', $('#homeNav').length, '#operateTab:', $('#operateTab').length, '.flpage.tab-content:', $('.flpage.tab-content').length);
            }, 1000);
        }

        $(".navbar-logo").fadeIn();
        $("#navbar").fadeIn();
    };

    if (typeof Pace !== 'undefined') {
        console.log('[diag] Pace available, running:', Pace.running);
        Pace.on('hide', loadHomePage);
        if (!Pace.running) {
            loadHomePage();
        }
        setTimeout(function() {
            if (!params.homeLoader) {
                console.log('[diag] 5s fallback triggered');
                loadHomePage();
            }
        }, 5000);
    } else {
        console.log('[diag] Pace not available');
        loadHomePage();
    }

    // Diagnostic: check page state after 8 seconds
    setTimeout(function() {
        console.log('=== DIAGNOSTIC SNAPSHOT ===');
        console.log('templateStyle:', window.templateStyle);
        console.log('params.homeLoader:', params.homeLoader);
        console.log('#fl-container exists:', $('#fl-container').length);
        console.log('#fl-container children:', $('#fl-container').children().length);
        console.log('#homeNav exists:', $('#homeNav').length);
        console.log('#operateTab exists:', $('#operateTab').length);
        console.log('.flpage.tab-content exists:', $('.flpage.tab-content').length);
        console.log('ul.nav-list items:', $('ul.nav-list li').length);
        console.log('Pace running:', typeof Pace !== 'undefined' ? Pace.running : 'N/A');
        console.log('=== END SNAPSHOT ===');
    }, 8000);

    // $(".main-content").slimscroll({
    // height: '95vh',
    // size: '5px',
    // opacity: 0.2,
    // position: 'right',
    // });
    
    function setWatermark(userName, userId) {

        // 用 canvas 画水印再 toDataURL('image/png'),替代 SVG Data URI。
        // PNG Data URI 浏览器兼容性远好于 SVG(IE9+/所有 win7 浏览器),
        // 且字体回退由 canvas 原生处理,规避 SVG <text> 在 win7 上中文乱码/不渲染的问题。
        var text = userName;
        if (userId) {
            text += ' ' + userId;
        }

        var now = new Date();
        var pad = function(n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate())
                  + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());

        var style = window.templateStyle || 'ace';
        var dark = (style === 'dark' || style === 'metro');

        var canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 140;
        var ctx = canvas.getContext('2d');

        // win7 上 Microsoft Yahei 不一定可用,回退到 SimSun(宋体),与后端 WMCodeUtil 保持一致。
        ctx.font = '16px "Microsoft Yahei", "Microsoft YaHei", SimSun, sans-serif';
        ctx.textAlign = 'center';
        ctx.translate(120, 70);
        ctx.rotate(-25 * Math.PI / 180);

        // rgba 半透明颜色:亮色模板用黑,深色模板用白,平铺不叠加变深。
        ctx.fillStyle = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        ctx.fillText(text, 0, -10);
        ctx.font = '12px "Microsoft Yahei", "Microsoft YaHei", SimSun, sans-serif';
        ctx.fillText(stamp, 0, 15);

        var dataUri;
        try {
            dataUri = canvas.toDataURL('image/png');
        } catch (e) {
            // toDataURL 失败(被污染/不支持)时,直接不画水印,不阻塞主流程。
            return;
        }

        var applyWatermark = function() {
            $('.watermark-overlay').remove();
            $('<div class="watermark-overlay"></div>').css({
                'position': 'fixed',
                'top': 0,
                'left': 0,
                'width': '100%',
                'height': '100%',
                'pointer-events': 'none',
                'z-index': 9999,
                'background-image': 'url(' + dataUri + ')',
                'background-repeat': 'repeat'
            }).appendTo('body');
        };

        applyWatermark();

        // 防删除:用户在控制台 .remove() 掉水印后立即重建。
        if (window.MutationObserver) {
            var mo = new MutationObserver(function(records) {
                var removed = false;
                for (var i = 0; i < records.length; i++) {
                    for (var j = 0; j < records[i].removedNodes.length; j++) {
                        if (records[i].removedNodes[j] &&
                            records[i].removedNodes[j].className === 'watermark-overlay') {
                            removed = true;
                        }
                    }
                }
                if (removed && $('.watermark-overlay').length === 0) {
                    applyWatermark();
                }
            });
            mo.observe(document.body, { childList: true });
        }
    };

    function createMenu(data) {

        var menuArr = {
            level1: [],
            level2: [],
            level3: []
        };

        var menuObj = {
            level1: {},
            level2: {}
        };
        var treeData = data.modules;
        var $tree = $("ul.nav-list");
        var $main = $('<li class="active"><a href="#"><i class="icon-home"></i><span class="menu-text">首页</span><b class="selected"></b></a></li>').appendTo($tree);
        var arr;

        $tree.slimscroll({
            height: utils.isMobile() ? '100vh' : '88vh',
            size: '5px',
            opacity: 0.2,
            position: 'left',
        });

        $main.click(function() {

            $('li', $tree).removeClass('open').removeClass('active');
            $main.addClass('active');
            $(this).attr({
                "mid": "homePage",
                "menuText": "首页"
            });
            com.loadPage('home-antv.html', $(this));
            $.breadcrumb('icon-home', ['首页']);
            return false;
        });

        if (params.userInfo.user.password == "resetPassword") {

            com.showAlert(com.warning, "请重置密码 , 重新登陆.");

            return false;
        }

        if (!treeData || !treeData.length) {
            return;
        }

        $.each(treeData, function(i, v) {

            arr = menuArr['level' + v.level];
            arr[arr.length] = v;
        });

        $.each(menuArr, function(key, val) {

            menuArr[key] = val.sort(function(a, b) {

                return a.order - b.order
            });
        });

        // i18n:菜单名翻译。优先级:mid 专表 > 一级菜单的 code > tAuto 反查高频词
        // mid 是后端 communion.module 主键,稳定唯一;一级菜单有英文 code(如 "approval")
        // cn 模式直接返回原 name,确保中文环境下菜单与改造前 100% 一致
        var translateMenuName = function(v) {
            if (!window.i18n) return v.name;
            if (i18n.lang === 'cn') return v.name;   // cn 模式保持原文,排除 i18n 对中文环境的影响
            // ① 按 mid 查专表(同名菜单可差异化翻译)
            var midKey = 'menu.mid.' + v.mid;
            var t = i18n.t(midKey);
            if (t !== midKey) return t;
            // ② 一级菜单按英文 code 查(menu.code.approval 等)
            if (v.module) {
                var codeKey = 'menu.code.' + v.module;
                var tc = i18n.t(codeKey);
                if (tc !== codeKey) return tc;
            }
            // ③ 兜底:反查 message/page/field 包的高频词
            return i18n.tAuto(v.name);
        };

        if (menuArr.level1.length) {
            $.each(menuArr.level1, function(i, v) {

                var $li = $('<li></li>');
                var $a = $('<a href="#"></a>').attr({
                    'menuText': v.name,
                    'module': v.module,
                });
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(translateMenuName(v));

                $a.append($i).append($span).appendTo($li);
                menuObj.level1[v.mid] = $li;
                $li.appendTo($tree);
            });
        }

        if (menuArr.level2.length) {
            $.each(menuArr.level2, function(i, v) {

                var $li = $('<li></li>');
                var $a = $('<a></a>').attr({
                    // 'href': v.url ? v.url : '#',
                    'href': 'baitianyu',
                    'mid': v.mid,
                    'menuText': v.name,
                    'module': v.module,
                    'helpKey': v.helpKey
                });
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(translateMenuName(v));
                $a.append($i).append($span).appendTo($li);
                menuObj.level2[v.mid] = $li;

                var $parent = menuObj.level1[v.fatherModule.mid];
                $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
                var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
                $li.appendTo($pul);
            });
        }

        if (menuArr.level3.length) {
            $.each(menuArr.level3, function(i, v) {

                if (v.access == 1) {
                    return true;
                }

                var $li = $('<li></li>');
                var $a = $('<a></a>').attr({
                    // 'href': v.url ? v.url : '#',
                    'href': 'bty.html',
                    'mid': v.mid,
                    'menuText': v.name,
                    'module': v.module,
                    'helpKey': v.helpKey
                });
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(translateMenuName(v));

                $a.append($i).append($span).appendTo($li);

                var $parent = menuObj.level2[v.fatherModule.mid];
                $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
                var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
                $li.appendTo($pul);
            });
        }

        $("a", $tree).on("click", function(e) {

            $this = $(this);

            var hrefStr = $this.attr("href");
            var mid = $this.attr("mid");
            var module = $this.attr("module");

            console.log('[diag] menu click, href:', hrefStr, 'mid:', mid, 'module:', module);

            if (module && (!constant[module] || !constant[module]["update"])) {
                Constant().module(module);
            }

            if ($this.siblings('ul').length) {
                if (!$this.parent('li').hasClass('active')) {
                    $this.parent('li').toggleClass('open');
                    $this.parent('li').siblings('li').not('.active').removeClass('open');
                }
            } else {
                if (hrefStr != "#" && hrefStr != "null" && hrefStr != undefined) {

                    var _list = $this.parents('li.open');
                    $(_list.get(0)).siblings('li').removeClass('active');
                    $this.parent().siblings('li').removeClass('active').removeClass('open');
                    $.each($this.parent().siblings('li'), function(i, v) {

                        $(v).find('li.active').removeClass('active');
                    });
                    $this.parent('li').addClass('active');
                    $this.next("ul").toggle().closest("li").siblings("li").children("ul").hide();
                    $this.attr('icon', $this.parents('li').find('a:first i').attr('class'));

                    com.post(api.system.checkModule, {
                        "module.mid": mid
                    }, function(res) {

                        var module = res.module

                        console.log('[diag] checkModule response, module:', !!module, 'url:', module ? module.url : 'N/A');

                        if (module) {

                            params.urlLoadParams = com.splitUrl(module.url);

                            $("#menu-toggler").removeClass("display");
                            $("#sidebar").removeClass("display");

                            if (params.urlLoadParams.open && params.urlLoadParams.open == "popup") {

                                com.popup4frame(module.name, module.url);

                                return false;
                            }

                            if (params.urlLoadParams.open && params.urlLoadParams.open == "window") {

                                window.open(module.url);

                                return false;
                            }

                            com.loadPage(module.url, $this);
                        } else {
                            com.showAlert(com.warning, "无操作权限")
                        }
                    });
                }
            }

            com.closePopup();

            e.preventDefault();
        });
    }

    $("#sidebar-collapse").click(function() {

        var sidebar = $("#sidebar");
        var scorll = $(".slimScrollDiv");
        var nav = $(".nav.nav-list");
        var main = $(".main-content");

        if (sidebar.hasClass("menu-min")) {
            scorll.css("overflow", "visible");
            nav.css("overflow", "visible");

            main.css("margin-left", "43px");
        } else {
            scorll.css("overflow", "hidden");
            nav.css("overflow", "hidden");

            main.css("margin-left", "190px");
        }
    });

    function navControl($this) {

        if ($this.data('level') == 1) {
            $('.level1').removeClass('level1');
            $this.addClass('level1');
            if ($this.attr('href') != '#') {
                $.breadcrumb($('i', $this).attr('class'), [$this.text()]);
            }
        } else if ($this.data('level') == 2) {
            $('.level2').removeClass('level2');
            $this.addClass('level2');
            if ($this.attr('href') != '#') {
                $.breadcrumb($('.nav-list .level1 i').attr('class'), [$('.nav-list .level1').text()]);

                $a = $('<a href=' + $this.attr("href") + '>' + $this.text() + '</a>');
                $a.on('click', function(e) {

                    e.preventDefault();
                    com.switchPage(e.target.href);
                });
            }
        } else if ($this.data('level') == 3) {
            $('.level3').removeClass('level3');
            $this.addClass('level3');
            if ($this.attr('href') != '#') {
                $.breadcrumb($('.nav-list .level1 i').attr('class'), [$('.nav-list .level1').text()]);

                $a = $('<a href=' + $this.attr("href") + '>' + $this.text() + '</a>');
                $a.on('click', function(e) {

                    e.preventDefault();
                    com.switchPage(e.target.href);
                });
            }
        }
    }

    function doLocking() {

        $("#userNameLock").text(window.userLockName);

        com.showImg($("#personalPicLock"), window.userLockPhoto, 180, 180, '');

        $("#lockPassword").val('');

        $("#outLockingContent").show("slow");

        // 不能正常请求
        window.notOperate = true;

        // 禁止右键刷新
        document.oncontextmenu = function() {

            return false
        };
        // 禁止F5刷新
        document.onkeydown = function(e) {

            var ev = window.event || e;
            var code = ev.keyCode || ev.which;
            if (code == 116) {
                ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
                cancelBubble = true;
                return false;
            }
            // 按下回车键锁屏登录
            if (code == 13) {
                lockSubmit();
                return false;
            }
        };

        $("#lockSubmit").on("click", function() {

            lockSubmit();
        });
    }

    function clearLocking() {

        $("#outLockingContent").hide("slow");

        window.notOperate = false; // 可以正常请求
        document.oncontextmenu = function() {

            return true;
        };
        document.onkeydown = function(e) {

            var ev = window.event || e;
            var code = ev.keyCode || ev.which;
            if (code == 116) {
                isF5 = true;
            }
        };
    }

    // 锁屏登录
    var errorLockCount = 0;
    function lockSubmit() {

        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + api.common.updateAuthCode.url,
            data: {
                "authentication": params.authentication,
                "user.password": $("#lockPassword").val()
            },
            success: function(res) {

                if (res.errorCode == 0) {
                    // 重置cookie
                    com.setCookie("authentication", res.authentication, config.timeout);
                    com.setCookie("loginTime", new Date().getTime(), config.timeout);
                    com.setCookie("versionCode", config.versionCode, config.timeout);
                    // 重置params
                    params.authentication = res.authentication;
                    params.loginTime = new Date().getTime();
                    // 重置window
                    window.authentication = params.authentication;
                    window.loginTime = params.loginTime;
                    window.versionCode = config.versionCode;
                    clearInterval(interval);
                    com._post_(api.home.library, {
                        "userId": params.userInfo.user.userId,
                        "loginTime": window.loginTime,
                        "redis": 0,
                        "api": "system.login.login"
                    });

                    interval = setInterval(function() {

                        com._post_(api.home.library, {
                            "userId": params.userInfo.user.userId,
                            "redis": 0,
                            "api": "system.login.index",
                            "loginTime": window.loginTime
                        }, function(res) {

                            if (res.code != 0) {
                                alert('登录超时,请重新登录.');

                                window.onbeforeunload = null;
                                com.deleteCookie("authentication");

                                if (parent.window.isPC) {
                                    nwRestart();
                                } else {
                                    window.location.href = '/';
                                }
                            }
                        })
                    }, config.singlePointTime);

                    clearLocking();

                    $(".block.input-icon.input-icon-right").find('i.red.icon-remove-sign').remove();
                    $(".block.input-icon.input-icon-right").find('span.red.errorText').remove();

                    errorLockCount = 0;

                } else {

                    $(".block.input-icon.input-icon-right").find('i.red.icon-remove-sign').remove();
                    $(".block.input-icon.input-icon-right").find('span.red.errorText').remove();

                    $("#lockPassword").parent().append("<i class='red icon-remove-sign'></i><span class='red errorText'>密码错误</span>");
                    errorLockCount++;

                    if (errorLockCount == 2) {

                        if (parent.window.isPC) {
                            
                            $(".block").parent().empty();
                            $('#lockSubmit').remove();
                            
                            var $container = $("<div style='font-family: 幼圆;font-size: 20px;'></div>");
                            var $promptText = $("<i class='red icon-remove-sign' style='margin-right: 10px;position: relative!important;'></i><span class='red' style='margin-right: 6px;'>密码错误，请</span>");
                            var $lockSubmit = $("<span class='green'>重新登录</span>");

                            $("#outLockingContent .login-form-sub .form-group").append($container.append($promptText).append($lockSubmit));
                        } else {
                            
                            if(config.oss){
                                $.ajax({
                                    url: config.server + '/logoutAuthCode.do',
                                    data: {"userId": params.userInfo.user.userId, "osstoken": getCookie('osstoken'), "domain": config.server},
                                    type: "post",
                                    dataType: "json",
                                    async: false,
                                    success: function (res) {
                                        clearCookiesByDomain(config.server);
                                        clearCookiesByDomain("fanglin.vip");
                                        
                                        com.deleteCookie("authentication");
                                        
                                        isF5 = true;
                                        window.location.href = "/";
                                    }
                                });
                            }

                            $("#lockPassword").addClass('lock-error-input').attr({
                                'readonly': 'readonly'
                            });
                            $("#lockSubmit").text("去登录");

                            errorLockCount = 0;

                            $("#lockSubmit").on("click", function(e) {

                                isF5 = true;
                                window.location.href = "/";
                            });

                            document.onkeydown = function(e) {

                                var _e = e || event;
                                if (_e.keyCode == 13) {
                                    $("#lockSubmit").click();
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // 收起全部菜单
    function foldMenu() {

        $('li', 'ul.nav-list').removeClass('open').removeClass('active');
        $('ul.nav-list li').first().addClass('active');
    }
    // 生成二维码
    $('#qrcode').qrcode({
        render: "canvas", // 也可以替换为table
        width: 100,
        height: 100,
        text: "fanglinserver:" + params.userInfo.user.userId
    });

});
