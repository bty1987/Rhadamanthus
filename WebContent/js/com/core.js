var com = {
    /**
     * 提醒信息弹窗等级
     */
    info: {
        typeclass: "layer-alert-info",
        outtime: 1000
    },
    warning: {
        typeclass: "layer-alert-warning",
        outtime: 3000
    },
    error: {
        typeclass: "layer-alert-error",
        outtime: 5000
    },
    /**
     * 错误码映射表(errorCode -> 展示文案)
     * 由 error-cn.json 加载,core.js else 分支查表优先,
     * 查不到 fallback 后端返回的 errorMsg。
     * 国际化时平行加 error-{lang}.json,初始化按语言选文件。
     */
    errorMap: {},
    /**
     * checkbox/switch内容对应信息
     */
    genderType: {
        "女": true,
        "男": false,
        "true": "女",
        "false": "男"
    },
    isOrNotType: {
        "是": true,
        "否": false,
        "true": "是",
        "false": "否"
    },
    /**
     * 时间控件初始化默认配置
     */
    timepickerdefault: {
        minuteStep: 1,
        showSeconds: false,
        showMeridian: false
    },
    /**
     * 时间控件初始化默认配置
     */
    datepickerdefault: {
        language: "zh",
        format: 'yyyy-mm-dd',
        clearBtn: true,
        todayHighlight: true
    },
    /**
     * 时间控件初始化中文默认配置
     */
    dateramgepickerdefault: {
        format: 'YYYY/MM/DD',
        separator: '-',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '从',
            toLabel: '到',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        }
    },
    /**
     * 日历初始化中文默认配置
     */
    calendardefault: {
        buttonText: {
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
            prev: '上一月',
            next: '下一月'
        },
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'month'
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
        today: ["今天"],
        titleFormat: {
            month: "yyyy年 MM月",
            week: " yyyy年",
            day: "yyyy年MM日dd "
        },
    },
    /**
     * 图表默认配置 , Echarts
     */
    chartdefault: {
        toolbox: {
            show: true,
            feature: {
            // saveAsImage : {show: true}
            }
        }
    },
    /**
     * 接口请求方法 , 主要使用post方式 , 根据api对应的接口对象信息完成请求动作
     * 
     * @param api 接口对象
     * @param options 请求参数
     * @param callback 成功回调方法
     * @param failCallback 失败回调方法
     * @param asyncFlag 异步标识
     */
    post: function(api, options, callback, failCallback, asyncFlag) {

        if (api == null) {
            return false;
        }

        var method = api.url;
        var target = method.substring(0, method.indexOf('.'));
        var reg = new RegExp(/query*|page*|report*|count*|[a-z]*\/[a-z]*/);
        var timestamp = new Date().getTime();

        if (!reg.test(target)) {
            if (!api.intercept) { // 该接口不拦截)
                if (params.apiHistory.hasOwnProperty(target)) { // 存在请求方法
                    if (utils.accSub(timestamp, params.apiHistory[target]) <= config.spacing * 1000) {
                        // 指定秒数之内重复请求
                        return;
                    } else {
                        params.apiHistory[target] = timestamp;
                    }
                } else {
                    params.apiHistory[target] = timestamp;
                }
            }
        }

        if (window.notOperate) {
            com.showAlert(com.warning, "已锁屏不能进行操作");
            return false;
        }

        var opts = $.extend({}, options || {});
        if (api.validate) {

            var $validate = true;

            $.each(api.validate, function(k, v) {

                if (v.required && !options[k]) {
                    $validate = false;
                    return false;
                }
            });

            if (!$validate)
                return false;
        }

        var optAsync = true;
        if (asyncFlag == undefined || asyncFlag == true) {
            optAsync = true;
        } else {
            optAsync = false;
        }

        var $ct = new Date();
        var timeout = config.timeout;
        if (!params.loginTime || (params.loginTime + timeout * 60 * 1000) < $ct.getTime()) {
            $("#userLock").click();
        } else {
            params.loginTime = $ct.getTime();
        }

        if (api.cache && params[api.cache]) {
            var res = params[api.cache]
            if (callback) {
                return callback(res);
            } else {
                return res;
            }
        }

        var server = "";
        if (api.server && config[api.server]) {
            server = config[api.server];
        } else {
            server = config.server;
        }

        if (config.demo) {
            if (!api.demo) {
                com.showAlert(com.warning, "Demo状态不能完成此操作");
                return false;
            }

            url = 'result/' + api.url.split('.')[0] + '.json';
        } else {
            url = server + api.url;
            opts["authentication"] = params.authentication;
        }

        if (api.type == 'update' && api.tranargs) {
            $.each(opts, function(k, v) {

                if (api.tranargs.args.indexOf(k.replace(/\[\d+\]/g, '')) != -1) {
                    utils.accExtend(opts, k);
                }
            });
        }

        var loader = null;
        if (api.loading) {
            loader = layer.msg(api.loading.content ? api.loading.content : "加载中", {
                shade: api.loading.shade ? api.loading.shade : 0.2,
                time: (api.loading.time ? api.loading.time : 5) * 1000,
            });
        }

        $.ajax({
            url: url,
            data: opts,
            type: url.indexOf('.json') != -1 ? "get" : "post",
            dataType: "json",
            async: optAsync, // 设为false就是同步请求
            success: function(res) {

                if (res == null) {
                    return false;
                }

                if (res.errorCode == 0) {

                    if ((api.type == 'query' && api.tranargs) || (api.type == "update" && api.tranargs && api.tranargs.query)) {

                        var tranargs = api.tranargs.query ? api.tranargs.query : api.tranargs;

                        $.each(tranargs, function(i, v) {

                            com.getProp(res, v.result, '-', function(o) {

                                if ($.isArray(o)) {
                                    $.each(o, function(i, vv) {

                                        utils.accReduce(vv, v.args, v.scale);
                                    });
                                } else if ($.isPlainObject(o)) {
                                    utils.accReduce(o, v.args, v.scale);
                                }
                            });
                        });
                    }

                    if (api.cache) {
                        params[api.cache] = res;
                    }

                    if (callback) {
                        callback(res);
                    } else {
                        com.showAlert(com.info, "操作成功");
                        return res;
                    }
                } else if (res.errorCode == 110000) {

                    params.errorCount += 1;

                    var currentTime = new Date().getTime();

                    if (params.errorCount >= 10 && (currentTime - params.errorTime) <= 60000) {
                        if (parent.window.isPC) {
                            document.getElementById('myiframe').contentWindow.document.getElementById("userLock").click();
                        } else {
                            window.location.href = '/';
                        }
                    }

                    params.errorTime = currentTime;

                    if (params.errorCount >= 5) {
                        var reloginMsg = (window.i18n) ? i18n.t('msg.relogin') : "请重新登录或联系管理员";
                        com.showAlert(com.error, res.errorMsg + "<br>" + reloginMsg);
                        return res;
                    }

                    com.showAlert(com.error, com.errorMap[res.errorCode] || res.errorMsg);

                } else if (res.errorCode == 110005) {

                    if (parent.window.isPC) {
                        document.getElementById('myiframe').contentWindow.document.getElementById("userLock").click();
                    } else {
                        $("#userLock").click();
                    }
                } else {
                    if (failCallback) {
                        failCallback(res);
                    } else {
                        com.showAlert(com.error, com.errorMap[res.errorCode] || res.errorMsg);
                        return res;
                    }
                }

                if (loader) {
                    layer.close(loader);
                }
            },
            error: function(msg) {

                console.error(msg);

                // i18n:网络异常兜底文案
                var netErr = (window.i18n) ? i18n.t('msg.networkError') : "功能问题,请稍后再试";
                com.showAlert(com.error, netErr);

                if (failCallback) {
                    failCallback(msg);
                }

                if (loader) {
                    layer.close(loader);
                }
            }
        });
    },
    /**
     * 简化版POST请求 , 主要用于library相关服务请求
     * 
     * @param url 请求地址
     * @param data 请求参数
     * @param callback 成功回调方法
     * @param failcallback 失败回调方法
     * @param async 异步标识
     */
    _post_: function(url, data, callback, failcallback, async) {

        var server = "";
        if (url.server) {
            server = config[url.server];
        } else {
            server = config["server"];
        }

        if (async == undefined || async == true) {
            async = true;
        } else {
            async = false;
        }

        $.ajax({
            url: server + url.url,
            data: data,
            type: "post",
            dataType: "json",
            async: async, // 设为false就是同步请求
            success: function(res) {

                if (callback) {
                    callback(res);
                } else {
                    return res;
                }
            },
            error: function(res) {

                if (failcallback) {
                    failcallback(res);
                } else {
                    console.log(res);
                }
            }
        });
    },
    /**
     * 清空元素/标签/空间内容
     * 
     * @param items 元素列表
     */
    cleanItems: function(items) {

        for ( var i in items) {

            var item = items[i]

            if (!item || !item[0])
                continue;
            if (typeof item != 'object' && typeof item[0] != 'object')
                continue;

            if (item[0].type == 'checkbox') {
                item.prop("checked", false).trigger("change");
            } else if (item[0].type == 'select-one') {
                if (item[0].options[0] != undefined)
                    item[0].options[0].selected = true;
            } else {
                item.val("").removeAttr('data-typeahead-key');
            }
        }
    },
    validator: {},
    /**
     * 验证 , 利用validator中class过滤需要验证内容的标签/元素
     * 
     * @param scopeID 页面标签/元素ID
     * @param placement 提醒显示方向
     */
    validate: function(container, placement) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return true;

        var _placement = placement == "" || placement == null || placement == undefined ? 'right' : placement;

        var _count = 0;

        $.each(com.validator, function(k, value) {

            com.focusPage(" ." + value.type + ":visible", container).each(function(i, v) {

                var $this = $(v);

                if (!$this.prop("disabled")) {

                    if (value.func) {
                        if (value.func($this)) {
                            com.showPopover($this, value, _placement);
                            _count++;
                        } else {
                            $this.css('border-color', "#b5b5b5");
                            $this.popover('destroy')
                        }
                        return true;
                    } else {
                        var _regex = value.regex;

                        if (!_regex.test($this.val())) {
                            com.showPopover($this, value, _placement);
                            _count++;
                        }
                    }
                }
            });
        });

        return _count == 0 ? false : true;
    },
    /**
     * 清空验证提示
     * 
     * @param id 页面标签/元素ID
     * @param _isTip 是否为Tip样式显示
     */
    clearValidator: function(id, _isTip) {

        isTip = _isTip || false;

        if (id != undefined && id != "") {
            id = id.indexOf("#") == 0 ? id : "#" + id;
        } else {
            id = "";
        }

        var popover = isTip == true ? "[data-rel='popover']" : " [data-rel='popover']";

        $.each(com.focusPage(id + popover), function(k, v) {

            if ($(this).data("tip") && !isTip) {
                return true;
            }
            if ($(this).data("addBorderWidth")) {
                $(this).css("border-width", "0px");
            }
            if ($(this).data("addBorderStyle")) {
                $(this).css("border-style", "none");
            }

            $(this).css("border", "1px solid #d5d5d5").popover("destroy");
        });

        layer.closeAll("tips");
    },
    /**
     * 提示
     * 
     * @param type 类型 , 可以使用com.info, com.warning, com.error
     * @param contents 显示内容
     */
    showTip: function(obj, msg, direc) {

        direc = direc ? ["", "top", "right", "bottom", "left"].indexOf(direc) : 1
        layer.tips(msg, obj, {
            tips: [direc, '#3595CC']
        });
    },
    showTips: function($obj, msg, isTip) {

        $obj = com.focusPage($obj);
        if ($obj.css("border-width") == "0px") {
            $obj.css("border-width", "1px");
            $obj.data("addBorderWidth", true);
        }

        if ($obj.css("border-style") == "none") {
            $obj.css("border-style", "solid");
            $obj.data("addBorderStyle", true);
        }

        $obj.css("border-color", "red");
        $obj.attr({
            "data-rel": "popover"
        }).popover('destroy').popover({
            content: msg
        }).popover('show');

        if (isTip) {
            $obj.data("tip", isTip);
        }
    },
    /**
     * 提示窗口
     * 
     * @param type 类型 , 可以使用com.info, com.warning, com.error
     * @param contents 显示内容
     */
    showAlert: function(type, contents) {

        if (!type)
            type = com.info;
        // i18n 透明拦截:命中 messageMap 的中文短语自动翻译,无需逐处改写
        if (window.i18n) contents = i18n.tAuto(contents);
        layer.msg(contents, {
            skin: type.typeclass,
            time: type.outtime
        });
    },
    /**
     * 确认窗口
     *
     * @param content 确认提示内容
     * @param success 确认按钮回调方法
     * @param cancel 取消按钮回调方法
     */
    showConfirm: function(content, success, cancel) {

        // i18n 透明拦截
        if (window.i18n) content = i18n.tAuto(content);
        layer.confirm(content, {
            title: false,
            resize: false,
            closeBtn: false
        }, function(index) {

            layer.close(layer.index);
            success && success();
        }, function(index) {

            cancel && cancel();
        });
    },

    /**
     * 显示加载提示
     *
     * @param content 加载提示内容，默认为"加载中..."
     * @param options 可选配置，包含 shade（遮罩透明度）、time（自动关闭时间）等
     * @return 返回加载索引，可用于关闭
     */
    showLoading: function(content, options) {
        options = options || {};
        // i18n:默认"加载中..."走翻译(未传 content 时)
        var defaultLoading = (window.i18n) ? i18n.t('msg.loading') : '加载中...';
        var loadIndex = layer.msg(content || defaultLoading, {
            shade: options.shade || 0.3,
            time: options.time || 0, // 默认不自动关闭
            icon: options.icon || 16
        });
        return loadIndex;
    },

    /**
     * 隐藏加载提示
     *
     * @param loadIndex 加载索引，如果为空则关闭所有加载提示
     */
    hideLoading: function(loadIndex) {
        if (loadIndex) {
            layer.close(loadIndex);
        } else {
            layer.closeAll('loading');
        }
    },

     /**
     * 确认窗口是否
     * 
     * @param content 确认提示内容
     * @param yes 是按钮回调方法
     * @param no 否按钮回调方法
     */
    showWhether: function(content, yes, no){
        // i18n 透明拦截:内容 + 按钮文本(是/否)
        if (window.i18n) content = i18n.tAuto(content);
        var btnYes = (window.i18n) ? i18n.t('msg.yes') : '是';
        var btnNo = (window.i18n) ? i18n.t('msg.no') : '否';
        layer.alert(content, {
          btn: [btnYes, btnNo],
          btnAlign: 'c',
          btn1: function(){
            yes && yes();
          },
          btn2: function(){
            no && no();
          }
        });
      },

    /**
     * 选择窗口
     * 
     * @param content 确认提示内容
     * @param events 时间列表 , 格式为[{"事件名": 处理方法}]
     */
    showSelection: function(content, events) {

        if (!events)
            return false;

        var index = 1;
        var btns = [];
        var options = {
            title: false,
            resize: false,
            closeBtn: false,
            btn: btns
        };

        $.each(events, function(k, v) {

            btns.push(k);
            options["btn" + index++] = v;
        });

        layer.confirm(content, options);
    },
    /**
     * 提示信息
     * 
     * @param title 表头信息
     * @param contents 提示内容
     */
    showInfo: function(title, contents) {

        layer.alert(contents, {
            skin: 'layui-layer-lan',
            title: title,
            btn: [],
            move: false
        });
    },
    /**
     * 贴示 , 吸附元素对象
     * 
     * @param $obj 元素ID或者元素对象
     * @param msg 提示信息
     * @param placement 显示方向 , 默认为右侧
     */
    showPopover: function($obj, msg, placement) {

        $obj = com.focusPage($obj);
        $obj.focus().select();

        var _ = ["", "top", "right", "bottom", "left"].indexOf(placement);

        layer.tips(msg.errorMsg, $obj, {
            tips: [_ == -1 ? 2 : _, '#fd6b6b'],
            tipsMore: true,
            time: 5000
        });
    },
    /**
     * 关闭提示
     */
    closePopover: function() {

        layer.closeAll('tips');
    },
    /**
     * 关闭提示
     */
    closeTip: function() {

        layer.closeAll("tips");
    },
    /**
     * 加载页面 , 切换页面功能
     * 
     * @param url 页面地址
     * @param notTab 页面不在flpage.active中显示
     * @param data 页面携带参数
     * @param callback 成功回调
     */
    switchPage: function(url, notTab, data, callback) {

        var container = $(".flpage.tab-pane.active").attr("id");
        if (notTab) {
            container = "fl-container";
        }

        // 拼接时间戳避免 ajax 加载页面时命中浏览器缓存,导致部署更新后仍显示旧页面
        var cacheUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + '_=' + new Date().getTime();

        $("#" + container).load(cacheUrl, data, function(response, status, xhr) {

            callback && callback(response, status, xhr);
        });
        layer.closeAll("tips");
    },
    /**
     * 载入页面
     * 
     * @param page 页面 不可为空 如api.index.homeIndex
     * @param features 显示内容
     */
    loadPage: function(page, $features) {

        if (!page)
            return false;
        if ($('.flpage.nav-tab').length > config.pageTabLimit) {
            com.showAlert(com.warning, "页面标签加载过多!");
            return false;
        }

        var menuId = $features.attr("mid");

        var breadcrumb = function(tabPane) {

            var temp = [];
            if (tabPane.attr('parentText'))
                temp.push(tabPane.attr('parentText'));
            if (tabPane.attr('text'))
                temp.push(tabPane.attr('text'));
            $.breadcrumb(tabPane.attr('icon'), temp);
            $.showHelp('.breadcrumb', tabPane.attr('helpKey'));
        };

        if ($("#homeNav .flpage.nav-tab a#tab_" + menuId + "").length > 0) {

            var _tab = $("#tab_" + menuId + "");
            var _tabPane = $("#" + menuId + "");

            _tab.parent().siblings().removeClass("active");
            _tab.parent().addClass("active");
            _tabPane.siblings().removeClass("active");
            _tabPane.addClass("active");

            breadcrumb(_tabPane);

            return false;
        }

        var opearteTab = $("#homeNav > #operateTab");
        var tabDel = $('<div class="removePage"><i class="icon-remove"></i></div>');
        var tabLi = $('<li class="flpage nav-tab active" data-page="' + page + '"></li>');
        var taba = $('<a data-toggle="tab" href="#' + menuId + '" id="tab_' + menuId + '">' + $features.attr("menuText") + '</a>').append(tabDel);
        var tabPane = $('<div id="' + menuId + '" class="flpage tab-pane in active"></div>').attr({
            'icon': $features.attr('icon'),
            'helpKey': $features.attr('helpKey'),
            'text': $features.attr("menuText"),
            'parentText': $($features.parents('li').find('a:first')).attr("menuText")
        });

        $(".flpage.nav-tab").removeClass("active");
        $(".flpage.tab-pane").removeClass("active");

        opearteTab.before(tabLi.append(taba));
        $(".flpage.tab-content").append(tabPane);

        tabPane.load(page);

        tabDel.on("click", function() {

            var _btn = $(this);
            var _tab = _btn.parents('li.flpage');

            var _pageId = _btn.parent("a").attr("href");
            var _page = $(_pageId);

            if (_tab.hasClass("active")) {
                params['urlLoadParams'] = com.splitUrl(_tab.prev().attr('data-page'));

                _tab.prev('li.flpage').addClass('active');
                _page.prev('div.flpage').addClass('active');
            }

            _tab.remove();
            _page.remove();
        });

        taba.on("click", function() {

            params['urlLoadParams'] = com.splitUrl(page);
            breadcrumb(tabPane);

            layer.closeAll("tips");
        });

        breadcrumb(tabPane);
    },
    /**
     * 获取当前使用标签页面对应选择器内容的页面元素
     * 
     * @param selecter 选择器
     * @param contianer 指定元素内
     * @return 元素对象
     */
    focusPage: function(selecter, contianer) {

        if (!contianer) {
            return $('.flpage.tab-pane.active').find(selecter);
        } else {
            return $('.flpage.tab-pane.active').find(contianer).find(selecter);
        }
    },
    /**
     * 获取自动补全key值
     * 
     * @param id 页面标签/元素ID
     * @param defaults 请求地址
     * @param isKey 是否获取key , 否则为val的信息
     * @return 自动补全的key/value
     */
    typeahead: function(container, defaults, isKey) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        var _ = container.attr('data-typeahead-key');
        if (isKey)
            _ = container.attr('data-typeahead-value');
        if (!defaults)
            defaults = '';
        return _ ? _ : defaults;
    },
    /**
     * 初始化自动补全 , 利用接口完成基础数据获取
     * 
     * @param id 页面标签/元素ID/样式class
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    initTypeahead: function(container, url, name, args, result, key, value, callback) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        var $ele = container.typeahead({
            url: url,
            list: [],
            postData: args,
            source: function(query, process) {

                if (query.length < 2)
                    return false;
                var options = {};
                options[name] = query;
                com.post(this.options.url, $.extend(options, this.options.postData), $.proxy(this.options.callback, this));
            },
            matcher: function(item) {

                return true;
            },
            callback: function(data) {

                this.options.list = data[result];
                this.flprocess(this.options.list, key, value);
            },
            isResultTypeMap: true,
            flupdater: function(k, v) {

                if (callback)
                    return callback(this.options.list, k, v);
                else
                    return v;
            }
        });
    },
    /**
     * 初始化自动补全 , 提供基础数据 , 无需发生请求
     * 
     * @param id 页面标签/元素ID/样式class
     * @param data 基础数据
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    selectTypeahead: function(container, data, key, value, callback) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        var $ele = container.typeahead({
            list: data,
            source: function(query, process) {

                var res = [];
                var data = this.options.list;

                if (query.length < 2) {
                    res = data.slice(0, 5);
                } else {
                    $.each(data, function(i, v) {

                        if (v[value].indexOf(query) != -1)
                            res.push(v);
                    });
                }
                $.proxy(this.options.callback, this)(res)
            },
            matcher: function(item) {

                return true;
            },
            callback: function(list) {

                this.flprocess(list, key, value);
            },
            isResultTypeMap: true,
            flupdater: function(k, v) {

                if (callback)
                    return callback(this.options.list, k, v);
                else
                    return v;
            }
        });
    },
    /**
     * 初始化自动补全 , 利用接口完成基础数据获取
     * 
     * @param id 页面标签/元素ID/样式class
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    autoTypeahead: function(container, url, name, args, result, key, value, callback) {

        com.initTypeahead(container, url, name, args, result, key, value, callback);
    },
    /**
     * 更新自动补全 , 显示内容 , 对应key值
     * 
     * @param id 页面标签/元素ID
     * @param key 补全元素key值
     * @param value 补全元素value值
     */
    updateTypeahead: function(container, key, value) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        container.val(value).attr('data-typeahead-key', key).attr("data-typeahead-value", value);
    },
    /**
     * 重置自动补全数据源
     * 
     * @param id 页面标签/元素ID
     * @param data 数据源
     * @param args 请求参数
     */
    resetTypeahead: function(container, data, args) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        if (data)
            container.typeahead("list", data);
        if (args)
            container.typeahead("args", args);
    },
    /**
     * 获取自动补全对应key值
     * 
     * @param id 页面标签/元素ID
     */
    cleanTypeahead: function(container) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        container.val("").removeAttr('data-typeahead-key');
    },
    /**
     * 显示图片 , 图片标签赋值地址 , 返回显示图片地址
     * 
     * @param $e 图片元素对象
     * @param url 图片路径
     * @param width 宽度
     * @param height 高度
     * @param alt alt信息
     * @param defaultUrl 默认地址
     * @param type 类型 , 0: 本地 , 1: 钉钉
     */
    /**
     * 显示图片，支持多种存储方式
     *
     * @param {Object} $e - 图片元素对象
     * @param {String} url - 图片路径
     * @param {Number} width - 目标宽度
     * @param {Number} height - 目标高度
     * @param {String} alt - alt 信息
     * @param {String} defaultUrl - 默认地址
     * @param {Number} type - 类型：0=本地, 1=钉钉, 2=华为云OBS, 3=阿里云OSS
     * @param {Object} args - 额外参数（已废弃，type=3 时使用 config.ossConfig）
     * @return {String} 图片源地址
     */
    showImg: function($e, url, width, height, alt, defaultUrl, type, args) {

        var $media = '', imgUrl = '', sourceUrl = '';

        if (type == 1) {
            // 钉钉图片处理
            $media = config.dmedia;
            imgUrl = url ? $media + url + '_' + alt + '.jpg' : defaultUrl;
            sourceUrl = $media + url;

        } else if (type == 2) {
            // 华为云 OBS 图片处理（直接拼接 URL）
            sourceUrl = com.showObs($e, url, width, height, alt, defaultUrl, type);

        } else if (type == 3 && url != "") {
            // ==================== 阿里云 OSS 图片处理（直接拼接 URL）====================
            // 使用全局配置 config.ossConfig
            var ossConfig = config.ossConfig || {};

            // 构建 OSS Host
            var ossHost = ossConfig.host ||
                ('https://' + ossConfig.bucket + '.' + ossConfig.endpoint);

            // 构建完整 URL
            var fullUrl = ossHost + '/' + (ossConfig.dir || '') + url;

            // 添加图片处理参数（缩放裁剪）
            if (width && height) {
                imgUrl = fullUrl + '?x-oss-process=image/resize,m_fill,w_' + width + ',h_' + height;
            } else {
                imgUrl = fullUrl;
            }

            sourceUrl = fullUrl;

        } else {
            // 本地图片处理
            $media = config.media;
            imgUrl = url ? $media + api.common.showImg.url + '?imgBasePath=' + url + '&divFlag=1&width=' + width + '&height=' + height + '&timestamp=' + new Date().getTime() : defaultUrl;
            sourceUrl = $media + api.common.showImg.url + '?imgBasePath=' + url;
        }

        // 设置图片属性
        $e.attr("src", imgUrl).attr("layer-src", sourceUrl).attr("alt", alt).error(function() {
            $(this).hide();
        });

        return sourceUrl;
    },
    /**
     * 清空图片 , 图片标签地址等信息
     * 
     * @param $e 图片元素对象
     */
    clearImg: function($e) {

        return $e.removeAttr("src").removeAttr("layer-src").removeAttr("alt");
    },
    showOss: function($e, url, width, height, alt, defaultUrl, type) {

        var imgUrl = url + '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width;

        $e.attr("src", imgUrl).attr("alt", alt).error(function() {

            $(this).hide();
        });

        return url;
    },
    showObs: function($e, url, width, height, alt, defaultUrl, type) {

        var imgUrl = url + '?x-image-process=image/resize,m_fill,h_' + height + ',w_' + width;

        $e.attr("src", imgUrl).attr("alt", alt).error(function() {

            $(this).hide();
        });

        return url;
    },
    downloadFile: function($e, url, name) {

        $e.attr('href', config.media + api.common.downloadFile.url + "?downloadFilePath=" + url + "&fileName=" + name).attr('target', '_blank');
    },
    /**
     * 蒙板 , 显示指定范围蒙板
     * 
     * @param popup 弹窗对象
     * @param target 目标对象 , 通常为控制大小
     * @returns 蒙板对象 , 可以用作删除动作
     */
    mask: function(popup, target) {

        var mask = $("<div></div>").addClass("tab-mask").appendTo(popup);
        var maskh1 = $("<h1></h1>").css({
            "position": "absolute",
            "top": "30%",
            "left": "45%"
        }).appendTo(mask);
        var maskicon = $("<i></i>").addClass("icon-spinner icon-spin bigger-450").appendTo(maskh1);

        mask.css("top", target.height() - mask.height() + 30);
        popup.css("overflow", "hidden");

        return mask;
    },
    /**
     * 关闭蒙板
     * 
     * @param mask 蒙板对象
     * @param popup 目标对象 , 主要恢复目标对象的滚动条
     */
    closeMask: function(mask, popup) {

        mask.remove();
        popup.css("overflow", "");
    },
    /**
     * 弹窗 , 显示指定url地址内容
     * 
     * @param title 标题
     * @param url 地址
     * @param success 成功回调方法
     * @param cancel 取消回调方法
     * @param isPrint 是否显示打印按钮
     * @returns 弹窗索引
     */
    popup: function(title, url, success, cancel, isPrint) {

        var _width = $(window).width();
        var _height = $(window).height();

        var _area = [_width + "px", _height + "px"];

        var _id = "popup-printer";

        var options = {
            id: _id,
            type: 2,
            skin: 'layui-layer-lan',
            area: _area,
            title: title,
            content: url,
            zIndex: 2500,
            maxmin: false,
            move: false,
            resize: false,
            success: function() {

                if (success != null && typeof (success) == 'function')
                    success();
            },
            cancel: function() {

                if (cancel != null && typeof (cancel) == 'function')
                    cancel();
            },
            end: function() {

                if (cancel != null && typeof (cancel) == 'function')
                    cancel();
            },
        };

        if (isPrint) {

            var printConf = {
                skin: "layui-layer-hong",
                success: function(layero, index) {

                    var $title = $(layero).find('.layui-layer-title').text("");

                    var divM = $("<div></div>").appendTo($title);
                    var div1 = $("<div></div>").attr("id", "FL-titleDiv").css({
                        "float": "left",
                        "width": "33%",
                        "padding": "0px"
                    }).text(title).appendTo(divM);

                    var btns = $('<div class="layui-layer-btn layui-layer-btn-" style="float: right; width: 65%; padding: 0px;"></div>').appendTo(divM);
                    var btn1 = $('<a class="layui-layer-btn0">标准打印</a>').appendTo(btns);
                    var btn2 = $('<a class="layui-layer-btn0">热敏打印</a>').appendTo(btns);

                    btn1.click(function() {

                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        if (typeof (isPrint) === "function")
                            isPrint(layero);
                        iframeWin.print();
                        return false;
                    });

                    btn2.click(function() {

                        printer.handle();
                        if (typeof (isPrint) === "function")
                            isPrint(layero);
                        return false;
                    });

                    if (success != null && typeof (success) == 'function') {
                        success();
                    }
                }
            }

            $.extend(options, printConf);
        }

        return setTimeout(function() {

            layer.open(options)
        }, 200);
    },
    /**
     * 弹窗 , 密你页类型
     * 
     * @param container 页面容器
     * @param holder 页面容器
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4mini: function(container, holder, title, success, cancel, prepare) {

        if (prepare && typeof (prepare) == 'function')
            prepare();

        var _holder = com.focusPage(holder).clone(true).show();
        var _container = com.focusPage(container).html("").append($(_holder));

        var _width = (_holder.width() > 521 ? _holder.width() + 50 : 521);
        var _height = _container.height() > $(window).height() * 0.8 ? $(window).height() * 0.8 : _container.height() + 50;

        var _id = "popup-mini";

        var options = {
            id: _id,
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: _container,
            area: ["512px", _height + "px"],
            maxmin: false,
            move: false,
            resize: false,
            zIndex: 3500,
            success: function(layer, index) {

                if (success && typeof (success) == 'function')
                    success();
            },
            cancel: function() {

                if (cancel && typeof (cancel) == 'function')
                    cancel();
            },
            end: function() {

                layer.closeAll("tips");
                if (cancel && typeof (cancel) == 'function')
                    cancel();
                _container.empty();
            }
        }

        return setTimeout(function() {

            layer.open(options)
        }, 200);
    },
    /**
     * 弹窗 , 编辑页类型
     * 
     * @param holder 页面容器
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4model: function(holder, title, success, cancel, prepare) {

        if (prepare && typeof (prepare) == 'function')
            prepare();

        if (holder && typeof (holder) == "object" && holder.length)
            holder = holder;
        else if (holder && typeof (holder) == "object")
            holder = [holder];
        else if (holder && typeof (holder) == "string")
            holder = com.focusPage(!/\W+/.test(holder) ? '#' + holder : holder);
        else
            return false;

        var _width = (holder.width() > 521 ? holder.width() + 50 : 521);
        var _height = holder.height() > $(window).height() * 0.8 ? $(window).height() * 0.8 : holder.height() + 50;

        var _id = "popup-model";

        var options = {
            id: _id,
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: holder,
            area: [_width + "px", _height + "px"],
            maxmin: false,
            move: false,
            resize: false,
            zIndex: 3000,
            success: function(layer, index) {

                if (success && typeof (success) == 'function')
                    success();
            },
            cancel: function() {

                if (cancel && typeof (cancel) == 'function')
                    cancel();
            },
            end: function() {

                layer.closeAll("tips");
                if (cancel && typeof (cancel) == 'function')
                    cancel();
            }
        }

        return setTimeout(function() {

            layer.open(options)
        }, 200);
    },
    /**
     * 弹窗 , 内嵌页类型
     * 
     * @param holder 页面容器
     * @param url 地址
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4page: function(holder, url, title, success, cancel, prepare) {

        if (prepare && typeof (prepare) == 'function')
            prepare();

        var _holder = com.focusPage(holder);

        var _rate = 0.8;

        if (utils.isMobile())
            _rate = 1;

        var _width = $(window).width() * _rate;
        var _height = $(window).height() * _rate;

        var _area = [_width + "px", _height + "px"]

        var _id = "popup-page";

        var options = {
            id: _id,
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: _holder,
            area: _area,
            maxmin: false,
            move: false,
            resize: false,
            zIndex: 2500,
            success: function(layer, index) {

                _holder.load(url);
                if (success && typeof (success) == 'function')
                    success();
            },
            cancel: function() {

                if (cancel && typeof (cancel) == 'function')
                    cancel();
            },
            end: function() {

                layer.closeAll("tips");
                if (cancel && typeof (cancel) == 'function')
                    cancel();
                _holder.empty();
            }
        }

        return setTimeout(function() {

            layer.open(options)
        }, 200);
    },
    /**
     * 弹窗 , 单页类型 , 支持打印
     * 
     * @param title 标题
     * @param url 地址
     * @param success 成功回调方法
     * @param cancel 取消回调方法
     * @param isPrint 是否显示打印按钮
     * @returns 弹窗索引
     */
    popup4frame: function(title, url, success, cancel, isPrint) {

        com.popup(title, url, success, cancel, isPrint);
    },
    /**
     * 弹窗 , 图片类型
     * 
     * @param holder 页面容器
     * @returns 弹窗索引
     */
    popup4photos: function(holder) {

        com.focusPage(holder).unbind();
        return layer.photos({
            "photos": holder,
            move: false
        });
    },
    /**
     * 关闭弹窗
     * 
     * @param type 类型为字符串(tips/page) , 类型为对象 , 关闭对象所属的弹窗
     */
    closePopup: function(index) {

        if (index && typeof (index) == "object") {
            layer.close(index.parents(".layui-layer").attr("times"));
        } else if (index && typeof (index) == "string") {
            layer.closeAll(index);
        } else {
            layer.closeAll()
        }
    },
    /**
     * 日志打印信息
     * 
     * @param content 内容
     */
    debug: function(content) {

        (config.logflag && config.logflag > 1) && console.info(content);
    },
    /**
     * 日志打印信息
     * 
     * @param content 内容
     */
    wrong: function(content) {

        (config.logflag && config.logflag > 0) && console.error(content);
    },
    /**
     * 拆分url参数
     * 
     * @param url 地址信息
     */
    splitUrl: function(url) {

        var _url = url == "" || url == undefined || url == null ? location.href : url;

        var result = {};
        var reg = new RegExp('([\?|&])(.+?)=([^&?]*)', 'ig');
        var arr = reg.exec(_url);

        while (arr) {
            result[arr[2]] = arr[3];

            arr = reg.exec(_url);
        }

        return result;
    },
    /**
     * 验证对象是否为null
     * 
     * @param obj 验证对象
     * @param rep 替换对象
     */
    checkNull: function(obj, rep) {

        return obj == null || obj == undefined || obj == "" ? rep : obj;
    },
    /**
     * 获取cookie值
     * 
     * @param name 名称
     * @return cookie值
     */
    getCookie: function(name) {

        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    /**
     * 设置cookie值
     * 
     * @param name 名称
     * @param value 值
     * @param minutes 有效时间 , 分钟为单位
     */
    setCookie: function(name, value, minutes) {

        var expires = "";
        if (minutes) {
            var d = new Date();
            d.setTime(d.getTime() + (minutes * 60 * 1000));
            expires = "expires=" + d.toUTCString();
        }
        document.cookie = name + "=" + value + "; " + expires;
    },
    /**
     * 删除cookie值
     * 
     * @param name 名称
     */
    deleteCookie: function(name) {

        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = com.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    /**
     * 格式化日期信息 , 格式为yyyy-MM-dd hh:mm:ss
     * 
     * @param name 名称
     */
    dateFormat: function(datetime, format) {

        if (!datetime)
            datetime = new Date();
        if (!format)
            format = "yyyy-MM-dd hh:mm:ss";

        var yyyy = datetime.getFullYear();
        var MM = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var dd = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hh = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var mm = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var ss = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();

        format = format.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd).replace("hh", hh).replace("mm", mm).replace("ss", ss);

        return format;
    },
    /**
     * 当前时间 , 格式为yyyy-MM-dd hh:mm:ss
     * 
     * @param name 名称
     */
    currentTime: function() {

        return com.dateFormat();
    },
    /**
     * 图标工具方法
     * 
     * @param parentId 图表容器ID
     * @param elementId 图标元素ID
     * @param args 请求参数
     * @param styles 图标元素样式
     */
    charts: function(parentId, elementId, url, args, clazz, styles, theme, excuter) {

        if (!echarts)
            return false;

        var $parent = com.focusPage("#" + parentId);

        if (!$parent)
            return false;

        styles = styles ? styles : {};
        theme = theme ? theme : "light";

        var $element = $("<div></div>").attr("id", elementId).addClass(clazz).css(styles).appendTo($parent);

        if ($element.length == 0)
            return false;

        var $options = $.extend({}, com.chartdefault);
        var $chart = echarts.init($element[0], theme);

        $chart.showLoading();

        com.post(url, args, function(res) {

            $chart.hideLoading();
            if (excuter && typeof (excuter) == 'function')
                excuter(res, $element);

            if (res.type == "number" || res.type == "table" || res.type == "top")
                return false;

            $chart.setOption($.extend($options, res.option));
        }, function(res){
            console.log(res);
        });

        return $chart;
    },
    /**
     * 日期/时间初始化方法
     * 
     * @param container 容器ID
     * @param type 类型 , 支持: year , month , date , time
     * @param range 是否为范围
     */
    datetime: function(container, type, range) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(container);
        else
            return false;

        $(container).attr("readonly", "readonly");

        type = type && typeof (type) == "string" ? ["year", "month", "day", "date", "time"].indexOf(type) != -1 ? type : "date" : "date";
        range = range ? true : false;

        var format = range ? "yyyy/MM/dd" : "yyyy-MM-dd";

        if (type == "year")
            format = "yyyy";
        else if (type == "month")
            format = "MM";
        else if (type == "day") {
            format = "dd";
            type = "date"
        } else if (type == "time")
            format = "HH:mm:ss";

        $.each(container, function(i, e) {

            laydate.render({
                elem: e,
                type: type,
                range: range,
                format: format,
                zIndex: 4500,
                trigger: "click",
                btns: ["clear", "now", "confirm"]
            });
        });
    },
    /**
     * 上传文件/图片（兼容 OSS 和本地上传）
     *
     * @param {String|Object} container - 上传容器（ID、选择器或jQuery对象）
     * @param {String} title - 按钮标题文本
     * @param {Object} uapi - 自定义上传API对象（可选）
     * @param {String} clazz - 按钮样式类名（可选，默认'btn btn-success'）
     * @param {String} exts - 支持的文件格式（可选，默认'*.jpg;*.jpeg;*.gif;*.png'）
     * @param {Object} args - 请求参数（本地上传的formData或OSS配置参数）
     * @param {Number} limit - 文件数量限制（可选，默认1）
     * @param {Function} success - 成功回调函数(result, file)
     * @param {Function} fail - 失败回调函数(error)
     * @param {Function} complete - 完成回调函数（可选）
     *
     * @example
     * // 本地上传示例
     * com.uploadify('#uploadBtn', '上传图片', null, null, '*.jpg;*.png', {}, 1,
     *     function(result, file) {
     *         console.log('上传成功:', result.uploadPath);
     *     }
     * );
     *
     * // OSS上传示例（需要在config中设置 isAliOss: true）
     * com.uploadify('#uploadBtn', '上传图片', null, null, '*.jpg;*.png', {
     *     accessKeyId: 'xxx',
     *     endpoint: 'oss-cn-hangzhou.aliyuncs.com',
     *     bucket: 'my-bucket',
     *     dir: 'uploads/'
     * }, 1, function(file) {
     *     console.log('上传成功:', file.name);
     * });
     */
    uploadify: function(container, title, uapi, clazz, exts, args, limit, success, fail, complete) {

        // 1. 容器参数处理
        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "string")
            container = com.focusPage(container);
        else
            return false;

        // 2. 提取公共配置参数
        var commonConfig = {
            multi: limit && limit > 1 ? true : false,          // 是否批量上传
            queueSizeLimit: limit ? limit : 1,                 // 上传队列限制
            fileTypeExts: exts ? exts : '*.jpg;*.jpeg;*.gif;*.png', // 文件格式限制
            buttonClass: clazz ? clazz : 'btn btn-success',    // 按钮样式
            buttonText: title || '选择文件',                    // 按钮文本
            fileSizeLimit: '5MB',                              // 文件大小限制
            height: '45',                                      // 按钮高度
            fileTypeDesc: '支持的格式:'                         // 文件类型描述
        };

        // 3. 判断上传模式并执行
        if (config.isAliOss) {
            // ==================== OSS 上传模式 ====================
            if (config.uploadMode === 'sts') {
                // STS 临时凭证直传（推荐，凭证隔离、安全）
                com._uploadifySts(container, commonConfig, args, success, fail, complete);
            } else {
                // 旧 Policy 签名直传（并行灰度兼容）
                com._uploadifyOss(container, commonConfig, args, success, fail, complete);
            }
        } else {
            // ==================== 本地上传模式 ====================
            com._uploadifyLocal(container, commonConfig, uapi, exts, args, success, fail, complete);
        }
    },

    /**
     * OSS STS 上传实现（私有方法，推荐）
     *
     * 流程：申请 STS 临时凭证 → 用 ali-oss SDK 浏览器直传（分片+断点续传）。
     * 凭证默认 15 分钟有效，按用户目录隔离（dir 由后端按 userId 生成）。
     *
     * 依赖：assets/js/aliyun-oss-sdk.min.js（提供全局 OSS 对象）
     * 降级：若未引入 ali-oss SDK，自动回退到后端 uploadFile.do 代理上传。
     *
     * @param {Object} container - 上传容器
     * @param {Object} commonConfig - 公共配置
     * @param {Object} ossArgs - 业务级 OSS 参数（可选 dir 覆盖等）
     * @param {Function} success - 成功回调
     * @param {Function} fail - 失败回调
     * @param {Function} complete - 完成回调
     */
    _uploadifySts: function(container, commonConfig, ossArgs, success, fail, complete) {

        // ali-oss SDK 未加载则降级到后端代理上传
        if (typeof OSS === 'undefined') {
            com._uploadifyLocal(container, commonConfig, api.common.uploadOther, commonConfig.fileTypeExts, ossArgs, success, fail, complete);
            return;
        }

        container.html("").Huploadify({
            'auto': true,
            'fileTypeDesc': commonConfig.fileTypeDesc,
            'fileTypeExts': commonConfig.fileTypeExts,
            'fileSizeLimit': commonConfig.fileSizeLimit,
            'height': commonConfig.height,
            'buttonClass': commonConfig.buttonClass,
            'buttonText': commonConfig.buttonText,

            // 上传开始：先申请 STS 凭证再直传
            'onUploadStart': function(file) {

                com.post(api.upgrade.getOssStsToken, {}, function(data) {

                    var sts = data.stsToken;

                    // 用 STS 三元组构建 OSS 客户端
                    var client = new OSS.Wrapper({
                        region: sts.region,
                        accessKeyId: sts.accessKeyId,
                        accessKeySecret: sts.accessKeySecret,
                        stsToken: sts.securityToken,
                        bucket: sts.bucket
                    });

                    // 对象名：会话目录/日期/uuid.后缀，防冲突
                    var suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
                    var dateStr = new Date().toISOString().slice(0, 10);
                    var uuidStr = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0;
                        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });
                    var objectKey = sts.dir + dateStr + '/' + uuidStr + '.' + suffix;

                    // 分片上传（自动支持大文件与断点续传，单片 5MB）
                    client.multipartUpload(objectKey, file, {
                        partSize: 5 * 1024 * 1024,
                        progress: function(p) {
                            // p 为 0~1 进度，可在此更新进度条
                        }
                    }).then(function(result) {

                        // 统一成功响应格式
                        var result2 = {
                            errorCode: 0,
                            errorMsg: '上传成功',
                            uploadPath: sts.host + '/' + objectKey,
                            fileName: file.name,
                            fileSize: file.size,
                            fileType: file.type
                        };

                        if (typeof success === 'function')
                            success(result2, file);

                    }).catch(function(err) {

                        com.showAlert(com.error, 'OSS上传失败: ' + (err.message || err.name));

                        if (typeof fail === 'function')
                            fail({
                                errorCode: -1,
                                errorMsg: err.message || err.name || 'OSS上传失败'
                            });
                    });

                }, function(res) {

                    com.showAlert(com.error, '获取STS凭证失败: ' + res.errorMsg);

                    if (typeof fail === 'function')
                        fail(res);
                });
            },

            // 文件选择/校验错误
            'onUploadError': function(file, errorCode) {

                com.showAlert(com.error, '文件选择或验证失败');

                if (typeof fail === 'function')
                    fail({
                        errorCode: errorCode,
                        errorMsg: '文件选择或验证失败',
                        file: file
                    });

                if (typeof complete === 'function')
                    complete();
            }
        });
    },

    /**
     * OSS 上传实现（私有方法）
     *
     * @param {Object} container - 上传容器
     * @param {Object} commonConfig - 公共配置
     * @param {Object} ossArgs - OSS配置参数（accessKeyId, endpoint, bucket, dir）
     * @param {Function} success - 成功回调
     * @param {Function} fail - 失败回调
     * @param {Function} complete - 完成回调
     */
    _uploadifyOss: function(container, commonConfig, ossArgs, success, fail, complete) {

        container.html("").Huploadify({
            'auto': true,
            'fileTypeDesc': commonConfig.fileTypeDesc,
            'fileTypeExts': commonConfig.fileTypeExts,
            'fileSizeLimit': commonConfig.fileSizeLimit,
            'uploader': "", // OSS直传不需要uploader
            'height': commonConfig.height,
            'buttonClass': commonConfig.buttonClass,
            'buttonText': commonConfig.buttonText,

            // OSS上传开始事件
            'onUploadStart': function(file) {

                // 步骤1: 获取OSS上传签名
                com.post(api.upgrade.generatePostSignature, {
                    "ossConfig.accessKeyId": ossArgs.accessKeyId,
                    "ossConfig.endpoint": ossArgs.endpoint,
                    "ossConfig.bucket": ossArgs.bucket,
                    "ossConfig.dir": ossArgs.dir
                }, function(data) {

                    var ossConfig = data.ossConfig;

                    // 步骤2: 构建OSS上传表单数据
                    var formData = new FormData();
                    formData.append('policy', ossConfig.policy);
                    formData.append('OSSAccessKeyId', ossConfig.accessKeyId);
                    formData.append('signature', ossConfig.signature);
                    formData.append('key', ossArgs.dir ? ossArgs.dir + file.name : file.name);
                    formData.append('file', file);

                    // 步骤3: 直接上传到OSS
                    $.ajax({
                        url: ossConfig.host,
                        type: 'POST',
                        data: formData,
                        processData: false,
                        contentType: false,
                        timeout: config.uploadTimeout * 1000,
                        success: function(response) {

                            // 构建成功响应对象（统一格式）
                            var result = {
                                errorCode: 0,
                                errorMsg: '上传成功',
                                uploadPath: ossConfig.host + '/' + (ossArgs.dir ? ossArgs.dir + file.name : file.name),
                                fileName: file.name,
                                fileSize: file.size,
                                fileType: file.type
                            };

                            if (typeof success === 'function')
                                success(result, file);
                        },
                        error: function(xhr, status, errorThrown) {

                            com.showAlert(com.error, "OSS上传失败: " + (errorThrown || status));

                            if (typeof (fail) == "function")
                                fail({
                                    errorCode: xhr.status || -1,
                                    errorMsg: errorThrown || status || 'OSS上传失败',
                                    xhr: xhr
                                });
                        }
                    });
                }, function(res) {
                    // 获取签名失败
                    com.showAlert(com.error, "获取OSS签名失败: " + res.errorMsg);
                    if (typeof (fail) == "function")
                        fail(res);
                });
            },

            // OSS上传错误事件
            'onUploadError': function(file, errorCode) {

                com.showAlert(com.error, "文件选择或验证失败");

                if (typeof (fail) == "function")
                    fail({
                        errorCode: errorCode,
                        errorMsg: '文件选择或验证失败',
                        file: file
                    });

                if (typeof (complete) == "function")
                    complete();
            }
        });
    },

    /**
     * 本地上传实现（私有方法）
     *
     * @param {Object} container - 上传容器
     * @param {Object} commonConfig - 公共配置
     * @param {Object} uapi - 自定义上传API
     * @param {String} exts - 文件扩展名
     * @param {Object} formData - 表单附加数据
     * @param {Function} success - 成功回调
     * @param {Function} fail - 失败回调
     * @param {Function} complete - 完成回调
     */
    _uploadifyLocal: function(container, commonConfig, uapi, exts, formData, success, fail, complete) {

        // 构建上传URL
        var uploadUrl = config.media + (uapi ? uapi.url :
            (exts && exts.indexOf('jpg') == -1 ? api.common.uploadOther.url : api.common.uploadImg.url));

        container.html("").Huploadify({
            'debug': false,                              // 关闭调试模式
            'auto': true,                                // 自动上传
            'successTimeout': config.uploadTimeout,      // 超时时间（秒）
            'formData': $.extend({}, formData),          // 附带的表单数据
            'multi': commonConfig.multi,                 // 是否批量上传
            'buttonClass': commonConfig.buttonClass,     // 按钮样式
            'buttonText': commonConfig.buttonText,       // 按钮文本
            'overrideEvents': ['onDialogClose'],         // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads',              // 服务器端文件对象名称
            'uploader': uploadUrl,                       // 上传处理URL
            'height': commonConfig.height,               // 按钮高度
            'fileTypeDesc': commonConfig.fileTypeDesc,   // 文件类型描述
            'fileTypeExts': commonConfig.fileTypeExts,   // 允许的文件后缀
            'fileSizeLimit': commonConfig.fileSizeLimit, // 文件大小限制
            'queueSizeLimit': commonConfig.queueSizeLimit, // 上传队列限制

            // 本地上传成功事件
            'onUploadSuccess': function(file, data) {

                var result = JSON.parse(data);

                if (result.errorCode == 0) {
                    // 上传成功
                    if (typeof (success) == "function")
                        success(result, file);
                } else {
                    // 上传失败（服务器返回错误）
                    com.showAlert(com.error, "上传失败: " + result.errorMsg);

                    if (typeof (fail) == "function")
                        fail(result);
                }
            },

            // 上传队列完成事件
            'onQueueComplete': function() {

                if (typeof (complete) == "function")
                    complete();
            },

            // 上传错误事件
            'onUploadError': function(file, errorCode, errorMsg) {

                com.showAlert(com.error, "上传出错: " + (errorMsg || errorCode));

                if (typeof (fail) == "function")
                    fail({
                        errorCode: errorCode,
                        errorMsg: errorMsg || '上传失败',
                        file: file
                    });
            }
        });
    },
    /**
     * 上传文件/图片
     * 
     * @param content 文件内容
     * @param name 名称
     * @param fileargs 文件请求参数名
     * @param args 请求参数
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 完成回调
     */
    upload: function(content, name, fileargs, args, success, fail, complete) {

        var url = config.media + (uapi ? uapi.url : exts.indexOf('jpg') == -1 ? api.common.uploadOther.url : api.common.uploadImg.url);

        var arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var file = new File([u8arr], name, {
            type: mime
        });

        var formData = new FormData();
        formData.append(fileargs, file);

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
        }).success(function(result) {

            if (success && typeof success == 'function')
                success(result);
        }).error(function(error) {

            if (fail && typeof fail == 'function')
                fail(error);
        }).complete(function(info) {

            if (complete && typeof complete == 'function')
                complete(info);
        });
    },
    /**
     * 
     * @param url
     * @param name
     */
    download: function(url, name) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {

            if (xhr.status === 200) {

                var blob = xhr.response;
                var link = document.createElement('a');
                var body = document.querySelector('body');

                link.href = window.URL.createObjectURL(blob);
                link.download = name;
                link.style.display = 'none';

                body.appendChild(link);
                link.click();
                body.removeChild(link);
            }

            xhr = null;
        }
        xhr.send();

    },
    /**
     * 获取对象中属性
     * 
     * @param o 对象
     * @param props 属性 , 可以为字符串或数组
     * @param flag 拆分属性分隔标识
     * @param callback 回调方法
     */
    getProp: function(o, props, flag, callback) {

        if (!props)
            callback(o);

        if (typeof props == 'string')
            props = props.split(flag);

        var prop = props.shift();

        if (props.length == 0) {
            callback(o[prop]);
        } else if ($.isArray(o[prop])) {
            $.each(o[prop], function(i, v) {

                com.getProp(v, $.extend([], props), flag, callback);
            });
        } else {
            com.getProp(o[prop], props, flag, callback);
        }
    },

    /**
     * 字符串格式化
     * 
     * @param content
     * @param args
     * @returns
     */
    format: function(content, args) {

        var result = content;

        for ( var key in args) {
            var value = args[key];
            if (undefined != value) {
                result = result.replace(new RegExp("{" + key + "}", "g"), value);
            }
        }

        return result;
    },

    initForm: function(container, title, forms, btns, prop, show, post, hide) {

        if (container && typeof (container) == "object" && container.length)
            container = container;
        else if (container && typeof (container) == "object")
            container = [container];
        else if (container && typeof (container) == "string")
            container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else
            return false;

        if (prop && typeof (prop) === 'function')
            prop();

        container.addClass("modal fade");

        var dialog = $("<div>").addClass("modal-dialog").appendTo(container);
        var content = $("<div>").addClass("modal-content").appendTo(dialog);
        var header = $("<div>").addClass("modal-header").appendTo(content);

        $("<span>").addClass("close").html("×").attr("data-dismiss", "modal").appendTo(header);
        $("<h4>").addClass("modal-title").html(title).appendTo(header);

        var body = $("<div>").addClass("modal-body").appendTo(content);
        var hform = $("<form>").addClass("form-horizontal").appendTo(body);

        $.each(forms, function(i, v) {

            var group = $("<div>").addClass("form-group").appendTo(hform);

            if (v.type == "div") {
                $("<div>").addClass(v.clazz).attr("id", v.id).appendTo(group);
            } else {

                var $input = null;

                if (v.type == "select")
                    $input = $("<select>");
                else if (v.type == "switch")
                    $input = $("<input>").attr("type", "checkbox").addClass("ace ace-switch ace-switch-5");
                else
                    $input = $("<input>").attr("type", v.type);

                $("<label>").addClass("col-md-3 control-label no-padding-right " + (v.validator.indexOf("v_require") != -1 ? "orange" : "")).text(v.name).appendTo(group);

                var inputCont = $("<div>").addClass("col-md-9").appendTo(group);
                $input.addClass("col-md-7").addClass(v.validator).addClass(v.clazz).attr("id", v.id).appendTo(inputCont);

                if (v.type == "switch")
                    inputCont.append($("<div>").addClass("lbl " + v.clazz));
            }

        });

        var footer = $("<div>").addClass("modal-footer").appendTo(content);

        $.each(btns, function(i, v) {

            $("<button>").addClass("btn btn-default").addClass(v.clazz).attr("id", v.id).text(v.name).appendTo(footer);
        });

        $("<button>").attr("data-dismiss", "modal").addClass("btn btn-default").text("取消").appendTo(footer);

        if (prop && typeof (prop) === 'function')
            prop();

        return container;
    }

};

(function($) {

    /**
     * 判断数组中是否包含某元素
     * 
     * @param value 判断元素
     * @param defaults 默认值
     * @return 如果存在返回判断元素 , 否则返回默认值
     */
    Array.prototype.contains = function(value, defaults) {

        return $.inArray(value, this) != -1 ? value : defaults;
    };
    /**
     * 拆分数组 , 数组元素为规律对象 , 利用元素中key和value值返回对象结构
     * 
     * @param key 数组元素key值
     * @param value 数组元素value值
     * @returns 对象结构
     */
    Array.prototype.split = function(key, value) {

        var _pack = {};
        $.each(this, function(i, v) {

            _pack[v[key]] = v[value];
        });
        return _pack;
    };
    /**
     * 字符串格式化
     * 
     * @param args 格式化参数值
     * @returns 字符串
     */
    String.prototype.format = function(args) {

        var result = this;

        if (arguments.length < 1) {
            return result;
        }

        var data = arguments; // 如果模板参数是数组

        if (arguments.length == 1 && typeof (args) == "object") {
            // 如果模板参数是对象
            data = args;
        }

        for ( var key in data) {
            var value = data[key];
            if (undefined != value) {
                result = result.replace("{" + key + "}", value);
            }
        }
        return result;
    }
    /**
     * 面包屑显示
     * 
     * @param icon 图标 , 开始位置显示
     * @param items 面包屑元素列表
     */
    $.breadcrumb = function(icon, items) {

        $('.breadcrumb').empty();

        if (!$.isArray(items))
            return false;

        $.each(items, function(k, o) {

            $('.breadcrumb').append($('<li class="nav' + (k + 1) + '"></li>').append(k == 0 ? '<i class="fa fa-fw ' + icon + '"></i>&nbsp;&nbsp;&nbsp;' + o : o, '&nbsp;&nbsp;'));
        });
    }
    /**
     * 显示帮助文档
     * 
     * @param container 显示帮助按钮的块级元素 (必须传入标识符, 例如: (".breadcrumb")符号不可省略)
     * @param key 显示帮助文档的内容关键词 , 与help.json中key值至少相同一个 例: $.showHelp(".breadcrumb", "decoration-create") 执行: 从help.json中获取key为"decoration-create"的数据, 将在标识为".breadcrumb"的元素之后显示帮助按钮并在点击帮助按钮后显示帮助信息
     */
    $.showHelp = function(container, key) {

        var addHelpBtn = function(v) {

            $(container).append($('<span class="badge badge-purple">帮助</span>').on("click", function() {

                layer.open({
                    type: 1,
                    title: v.title,
                    area: ["40%", ($(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750) + "px"],
                    maxmin: false,
                    move: false,
                    zIndex: 5000,
                    content: '<div class="help-content">' + showHelpInfo(v.content) + '</div>'
                });
            }).css({
                "cursor": "pointer",
                "line-height": "18px"
            }));
            var showHelpInfo = function(content) {

                var container = $('<div></div>');
                if ($.isArray(content)) {
                    $.each(content, function(i, o) {

                        if ($.isPlainObject(o)) {
                            $.each(o, function(k, e) {

                                if (k == 'title')
                                    container.append($('<h3>' + e + '</h3>'));
                                if (k == 'content')
                                    container.append($('<div>' + e + '</div>'));
                                if (k == 'img')
                                    container.append($('<image src="' + e + '"></image>'));
                                if (k == 'p') {
                                    if ($.isArray(e)) {
                                        $.each(e, function(pi, p) {

                                            container.append($('<p>' + p + '</p>'));
                                        });
                                    } else {
                                        container.append($('<p>' + e + '</p>'));
                                    }
                                }
                            })
                        } else {
                            container.append($('<div>' + o + '</div>'))
                        }
                    })
                } else {
                    container.append($('<div>' + content + '</div>'))
                }
                return container.html();
            }
        };

        var getHelpInfo = function(res) {

            var _help = res[key];

            if (!_help)
                return false;

            if (!_help.hasOwnProperty("title")) {
                getHelpInfo(_help)
            } else {
                addHelpBtn(_help)
            }
        };

        com.post(api.ds.help, {}, function(res) {

            getHelpInfo(res);
        });
    }

    /**
     * 页面表头信息
     * 
     * @param title 标题
     * @parma detail 详细信息
     */
    $.fn.statement = function(title, detail) {

        return $(this).prepend("<div class='page-header'><h1>" + title + "<small><i class='icon-double-angle-right'></i> " + detail + "</small></h1></div>");
    }

    /**
     * select标签绑定数据
     *
     * @param data 绑定数据
     * @param key 数据项key值
     * @param value 数据项value值
     * @param all 全部选项标识
     * @param callback 回调方法 ,
     * @param other 其他属性
     * @return select标签对象
     */
    $.fn.bindData = function(data, key, value, all, callback, other) {

        var $this = this;

        if ($this[0] == undefined || $this[0].nodeName.toLowerCase() != "select" || data == undefined) {
            console.log("该控件无法绑定列表数据");
            return $this;
        }

        $this.empty();

        var optionHTML = "";

        if (all) {
            $("<option value=''>" + (typeof all == "string" ? all : "全部") + "</option>").appendTo($this);
        }

        for ( var i = 0; i < data.length; i++) {

            var item = data[i];

            if (typeof item == 'object') {
                var _o = other ? "other='" + item[other] + "'" : "";
                $("<option value='" + item[key] + "'" + _o + ">" + item[value] + "</option>").appendTo($this);
            } else {
                $("<option value='" + item + "' multikey='multikey'>" + item + "</option>").appendTo($this);
            }
        }

        if (callback)
            callback();

        return $this;
    }
    /**
     * 开关switch样式初始化
     * 
     * @param clazz 样式 , 显示内容 , 需要提前定义
     */
    $.fn.switchBtn = function(clazz) {

        var $this = $(this);

        if ($this.attr("type") != "checkbox")
            return false;

        $this.addClass('ace ace-switch ace-switch-5').after("<span class='lbl " + clazz || "" + "'></span>");

        return $this;
    };

    /**
     * 绑定点击事件 , 按钮增加加载效果
     * 
     * @param callback 点击事件执行内容
     * @param delayTime 延迟事件
     */
    $.fn.bindClick = function(callback, delayTime) {

        var dfd = $.Deferred();

        var that = this;

        that.click(function() {

            that.button('loading');

            callback();

            setTimeout(function() {

                that.button('reset')
            }, typeof (delayTime) == "number" ? delayTime : 1000);
        });

        return dfd.promise();
    };

    // 加载错误码映射表(i18n/error-{lang}.json),供 post 的 else 分支查表展示
    // 同步加载,确保 com.post 调用前就绪;加载失败不影响功能(fallback 后端 errorMsg)
    // 国际化:按 config.lang 选文件(cn/en/zh-TW...),默认 cn
    try {
        var _lang = (config.lang || 'cn').replace('-', '_');
        $.ajax({
            url: 'js/i18n/error-' + _lang + '.json',
            dataType: 'json',
            async: false,
            cache: true,
            success: function(data) {
                com.errorMap = data || {};
            }
        });
    } catch (e) {
        com.errorMap = {};
    }

})(jQuery);
