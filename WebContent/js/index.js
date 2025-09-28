$(function() {

    Api().init('js/api/');
    Validator().init();
    Printer().init();

    var interval = null;

    params.authentication = window.authentication;
    params.loginTime = window.loginTime;

    if (!config.intranet)
        config.communion = window.communion;

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res) {

        params.userInfo = res.userInfo;

        if (parent.window.isPC && (res.userInfo.user.extranet & 16) != 16) {
            alert('无使用该平台权限');
            nwRestart();
        }

        if (!parent.window.isPC && (res.userInfo.user.extranet & 8) != 8) {
            alert('无使用该平台权限');
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

    if (utils.isMobile()) {
        $("#faqInfo").parent().hide();
        $("#versionInfo").parent().hide();
    }

    params.userCompany = window.userCompany;

    com.post(api.personel.queryUserCompany, {
        "user.uid": params.userInfo.user.uid
    }, function(res) {

        var companysel = $('#companysel').html("");
        // var moreCompany = $("#moreCompany").html("");

        var companyGroup = null;
        var companys = [];

        $.each(res.userCompanys, function(i, v) {

            var index = 5; // 显示前五个公司信息

            if (i % 3 == 0)
                companyGroup = $("<div></div>").addClass("form-group").appendTo(moreCompany);

            var $btn = $("<button></button>").addClass("btn btn-link col-md-4").text(v.company.name).appendTo(companyGroup);

            $btn.click(function() {

                return changeCompany(v.company);
            });

            if (i < index) {

                var $li = $('<li></li>').appendTo(companysel);
                var $a = $('<a></a>').attr('data-cid', v.company.cid).text(v.company.name).appendTo($li);

                $a.click(function(e) {

                    return changeCompany(v.company);
                });
            }

            if (i == index) {

                var $di = $('<li class="divider"></li>').appendTo(companysel);
                var $li = $('<li></li>').appendTo(companysel);
                var $a = $('<a></a>').text("更多公司").appendTo($li);

                $a.click(function(e) {

                    com.popup4model($('#layerCompany'), '切换公司');
                });
            }

            companys.push(v.company);
        });

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

    $("#logout").on("click", function(e) {

        if (parent.window.isPC) {
            nwRestart();
        } else {
            com.deleteCookie("authentication");
            window.location.href = '/';
        }
    });

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

    Pace.on('hide', function() {

        if (config && !params.homeLoader) {
            $('#navbar').fadeIn();
            $('#main-container').fadeIn();
            com.switchPage('home-antv.html', true);
            params.homeLoader = true;
        }

        $(".navbar-logo").fadeIn();
        $("#navbar").fadeIn();
    });

    // $(".main-content").slimscroll({
    // height: '95vh',
    // size: '5px',
    // opacity: 0.2,
    // position: 'right',
    // });

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

        if (menuArr.level1.length) {
            $.each(menuArr.level1, function(i, v) {

                var $li = $('<li></li>');
                var $a = $('<a href="#"></a>').attr({
                    'menuText': v.name,
                    'module': v.module,
                });
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(v.name);

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
                var $span = $('<span></span>').addClass('menu-text').text(v.name);
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
                var $span = $('<span></span>').addClass('menu-text').text(v.name);

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
                            };
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
