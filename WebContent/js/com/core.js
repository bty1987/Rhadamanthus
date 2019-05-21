var com = {
    /**
     * 提醒信息弹窗等级
     */
    info: {typeclass: "layer-alert-info", outtime: 1000},
    warning: {typeclass: "layer-alert-warning", outtime: 3000},
    error: {typeclass: "layer-alert-error", outtime: 5000},
    /**
     * checkbox/switch内容对应信息
     */
    genderType: {"女": true, "男": false, "true": "女", "false": "男"},
    isOrNotType: {"是": true, "否": false, "true": "是", "false": "否"},
    /**
     * 时间控件初始化中文默认配置
     */
    datepickerdefault: {
        language: "zh",
        format : 'yyyy-mm-dd',
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
            today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
        },
        header: {
            left: 'prev,next', center: 'title', right: 'month'
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
     * 接口请求方法 , 主要使用post方式 , 根据api对应的接口对象信息完成请求动作
     * @param api 接口对象
     * @param options 请求参数
     * @param callback 成功回调方法
     * @param failCallback 失败回调方法
     * @param asyncFlag 异步标识
     */
    post: function (api, options, callback, failCallback, asyncFlag) {

        if (api == null) {
            return;
        }

        var method = api.url;
        var target = method.substring(0, method.indexOf('.'));
        var reg = new RegExp(/query*|page*|report*|count*|[a-z]*\/[a-z]*/);
        var timestamp = new Date().getTime();

        if (!reg.test(target)) {
            if (!api.intercept) { // 该接口不拦截)
                if (params.apiHistory.hasOwnProperty(target)) {   // 存在请求方法
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
            return;
        }

        var opts = $.extend({}, options || {});
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
        
        if(api.cache && params[api.cache]){
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
                return;
            }

            url = 'result/' + api.url.split('.')[0] + '.json';
        } else {
            url = server + api.url;
            opts["authentication"] = params.authentication;
        }

        $.ajax({
            url: url,
            data: opts,
            type: url.indexOf('.json') != -1 ? "get" : "post",
            dataType: "json",
            async: optAsync, //设为false就是同步请求
            success: function (res) {
                if (res == null) {
                    return;
                }
                
                if (res.errorCode == 0) {
                	
                	if(api.cache) {
                		params[api.cache] = res;
                	}
                	
                    if (callback) {
                        callback(res);
                    } else {
                        com.showAlert(com.info, "操作成功");
                        return res;
                    }
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
                        com.showAlert(com.error, res.errorMsg);
                        return res;
                    }
                }
            }, error: function (msg) {
                console.error(msg);
                com.showAlert(com.error, "功能问题,请稍后再试");
                if (failCallback) {
                    failCallback(msg);
                }
            }
        });
    },
    /**
     * 简化版POST请求 , 主要用于library相关服务请求
     * @param url 请求地址
     * @param data 请求参数
     * @param callback 成功回调方法
     * @param failcallback 失败回调方法
     * @param async 异步标识
     */
    _post_: function (url, data, callback, failcallback, async) {

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
            type: "get",
            dataType: "json",
            async: async, //设为false就是同步请求
            success: function (res) {
                if (callback) {
                    callback(res);
                } else {
                    return res;
                }
            }, error: function (res) {
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
     * @param items 元素列表
     */
    cleanItems: function (items) {
        for (var i in items) {
            
            var item = items[i]
            
            if (typeof item != 'object') continue;
            if (item[0].type == 'checkbox') {
                item.prop("checked", false).trigger("change");
            } else if (item[0].type == 'select-one') {
                if (item[0].options[0] != undefined) item[0].options[0].selected = true;
            } else {
                
                if(item.hasClass("date-picker")) item.datepicker('clearDates');
                
                item.val("").removeAttr('data-typeahead-key');
            }
        }
    },
    validator: {},
    /**
     * 验证 , 利用validator中class过滤需要验证内容的标签/元素
     * @param scopeID 页面标签/元素ID
     * @param placement 提醒显示方向
     */
    validate: function (scopeID, placement) {

        var _scopeID = scopeID == "" || scopeID == null || scopeID == undefined ? '.flpage.tab-pane.active' : "#" + com.focusPage("#" + scopeID).attr("id");
        var _placement = placement == "" || placement == null || placement == undefined ? 'right' : placement;

        var _count = 0;

        $.each(com.validator, function (k, value) {

            com.focusPage(_scopeID + " ." + value.type + ":visible").each(function (i, v) {

                var $this = $(v);

                if (!$this.prop("disabled")) {

                    var $datafor = $this;

                    if ($this.data("for")) {
                        $datafor = $("#" + $this.data("for"));
                    }
                    if (value.func) {
                        if (value.func($datafor)) {
                            com.showPopover($this, value, _placement);
                            _count++;
                        } else {
                            $this.css('border-color', "#b5b5b5");
                            $this.popover('destroy')
                        }
                        return true;
                    } else {
                        var _regex = value.regex;

                        if (!( _regex.test($datafor.val()))) {
                            com.showPopover($this, value, _placement);
                            _count++;
                        }
                    }
                }
            })
        });

        return _count == 0 ? false : true;
    },
    /**
     * 清空验证提示
     * @param id 页面标签/元素ID
     * @param _isTip 是否为Tip样式显示
     */
    clearValidator: function(id, _isTip){
        isTip = _isTip || false;

        if(id != undefined && id != ""){  id = id.indexOf("#") == 0 ? id : "#" + id; }
        else{  id = ""; }

        var popover = isTip == true ? "[data-rel='popover']" : " [data-rel='popover']";

        $.each(com.focusPage(id + popover), function(k, v){

            if($(this).data("tip") && !isTip){  return true; }
            if($(this).data("addBorderWidth")){  $(this).css("border-width", "0px");  }
            if($(this).data("addBorderStyle")){  $(this).css("border-style", "none"); }

            $(this).css("border", "1px solid #d5d5d5").popover("destroy");
        });
    },
    /**
     * 提示
     * @param type 类型 , 可以使用com.info, com.warning, com.error
     * @param contents 显示内容
     */
    showTip: function (obj, msg, direc) {
        direc = direc ? ["", "top", "right", "bottom", "left"].indexOf(direc) : "top"
        layer.tips(msg, obj, direc);
    },
    showTips: function ($obj, msg, isTip) {
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
        $obj.attr({"data-rel": "popover"}).popover('destroy').popover({content: msg}).popover('show');

        if (isTip) {
            $obj.data("tip", isTip);
        }
    },
    /**
     * 提示窗口
     * @param type 类型 , 可以使用com.info, com.warning, com.error
     * @param contents 显示内容
     */
    showAlert: function (type, contents) {
        if(!type) type = com.info;
        layer.msg(contents, {skin: type.typeclass, time: type.outtime});
    },
    /**
     * 确认窗口
     * @param content 确认提示内容
     * @param success 确认按钮回调方法
     * @param cancel 取消按钮回调方法
     */
    showConfirm: function(content, success, cancel){
        layer.confirm(content, {title: false, closeBtn: false}, function(index){
            success && success();
            layer.close(index);
        }, function(index){
            cancel && cancel();
        });
    },
    /**
     * 提示信息
     * @param title 表头信息
     * @param contents 提示内容
     */
    showInfo: function (title, contents) {
        layer.alert(contents, {title: title, btn: [], shade: false, time: 5000});
    },
    /**
     * 贴示 , 吸附元素对象
     * @param $obj 元素ID或者元素对象
     * @param msg 提示信息
     * @param placement 显示方向 , 默认为右侧
     */
    showPopover: function ($obj, msg, placement) {
        
        $obj = com.focusPage($obj);
        $obj.focus().select();
        
        var _ = ["", "top", "right", "bottom", "left"].indexOf(placement);
        
        layer.tips(msg.errorMsg, $obj, {tips: [_ == -1 ? 2 : _, '#fd6b6b'], tipsMore: true, time: 5000});
    },
    /**
     * 加载页面，切换页面功能
     * @param url 页面地址
     * @param notTab 页面不在flpage.active中显示
     * @param data 页面携带参数
     * @param callback 成功回调
     */
    switchPage: function (url, notTab, data, callback) {
        var container = $(".flpage.tab-pane.active").attr("id");
        if (notTab) {
            container =  "fl-container";
        }
        $("#" + container).load(url, data, function (response, status, xhr) {
            callback && callback(response, status, xhr);
        });
    },
    /**
     * 载入页面
     * @param page 页面 不可为空 如api.index.homeIndex
     * @param features 显示内容
     */
    loadPage: function (page, $features){
        if (!page) return false;
        if ($('.flpage.nav-tab').length > 10) {
            com.showAlert(com.warning, "页面标签加载过多!");
            return false;
        }

        var menuId = $features.attr("mid");
        
        var breadcrumb = function(tabPane){
            var temp = [];
            if (tabPane.attr('parentText')) temp.push(tabPane.attr('parentText'));
            if (tabPane.attr('text')) temp.push(tabPane.attr('text'));
            $.breadcrumb(tabPane.attr('icon'), temp);
            $.showHelp('.breadcrumb', tabPane.attr('helpKey'));
        };

        if ($("#homeNav .flpage.nav-tab a#tab_"+ menuId +"").length > 0 ) {
            
            var _tab = $("#tab_"+ menuId +"");
            var _tabPane = $("#"+ menuId +"");
            
            _tab.parent().siblings().removeClass("active");
            _tab.parent().addClass("active");
            _tabPane.siblings().removeClass("active");
            _tabPane.addClass("active");
            
            breadcrumb(_tabPane);
            
            return false;
        }

        var opearteTab = $("#homeNav > #operateTab");
        var tabDel = $('<div class="removePage"><i class="icon-remove"></i></div>');
        var tabRefresh = $('<div class="removePage"><i class="icon-refresh"></i></div>');
        var tabLi = $('<li class="flpage nav-tab active" data-page="'+ page +'"></li>');
        var taba = $('<a data-toggle="tab" href="#'+ menuId +'" id="tab_'+ menuId +'">'+ $features.attr("menuText") +'</a>').append(tabRefresh).append(tabDel);
        var tabPane = $('<div id="'+ menuId +'" class="flpage tab-pane in active"></div>').attr({
            'icon': $features.attr('icon'),
            'helpKey': $features.attr('helpKey'),
            'text': $features.attr("menuText"),
            'parentText': $($features.parents('li').find('a:first')).attr("menuText")
        });

        var tabClose = $("#dropdown");

        $(".flpage.nav-tab").removeClass("active");
        $(".flpage.tab-pane").removeClass("active");

        opearteTab.before(tabLi.append(taba));
        $(".flpage.tab-content").append(tabPane);

        tabPane.load(page);

        tabDel.on(ace.click_event, function(){
            params['urlLoadParams'] = com.splitUrl($(this).parents('li.flpage').prev().attr('data-page'));
            
            $(this).parents('li.flpage').prev('li.flpage').addClass('active');
            $($(this).parent("a").attr("href")).prev('div.flpage').addClass('active');
            $(this).parents('li.flpage').remove();
            $($(this).parent("a").attr("href")).remove();
        });
        
        taba.on(ace.click_event, function(){
            tabClose.removeClass('show');
            params['urlLoadParams'] = com.splitUrl(page);
            breadcrumb(tabPane);
        });
        
        tabRefresh.on(ace.click_event, function(){
            var target = $($(this).parent().attr("href"));
            var height = parseInt(target.get(0).offsetHeight)-300;
            
            target.append($("<div><h1 style='margin-top: "+height/2+"px'><i class='icon-spinner icon-spin bigger-450'></i></h1></div>").addClass("tab-mask"));
            setTimeout(function(){
                tabPane.load(page);
                target.removeClass("tab-mask");
            }, 1200)
        });

        breadcrumb(tabPane);
    },
    /**
     * 获取当前使用标签页面对应选择器内容的页面元素
     * @param selecter 选择器
     * @param contianer 指定元素内
     * @return 元素对象
     */
    focusPage: function(selecter, contianer){
        if(!contianer){ return $('.flpage.tab-pane.active').find(selecter); }
        else { return $('.flpage.tab-pane.active').find(contianer).find(selecter); }
    },
    /**
     * 获取自动补全key值
     * @param id 页面标签/元素ID
     * @param defaults 请求地址
     * @param isKey 是否获取key , 否则为val的信息
     * @return 自动补全的key/value
     */
    typeahead: function(id, defaults, isKey){
        var _ = com.focusPage('#' + id).attr('data-typeahead-key');
        if(isKey) _ = com.focusPage('#' + id).val();
        if(!defaults) defaults = '';
        return  _ ? _ : defaults;
    },
    /**
     * 初始化自动补全 , 利用接口完成基础数据获取
     * @param id 页面标签/元素ID
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    initTypeahead: function (id, url, name, args, result, key, value, callback){
        
        var $ele = com.focusPage('#' + id).typeahead({
            url: url,
            list: [],
            postData: {},
            source: function (query, process) {
                if(query.length < 2) return false;
                var options = {};
                options[name] = query;
                com.post(this.options.url, $.extend(options, args), $.proxy(this.options.callback, this));
            }, matcher: function (item) {
                return true;
            }, callback: function (data) {
                this.options.list = data[result];
                this.flprocess(this.options.list, key, value);
            },
            isResultTypeMap: true,
            flupdater: function (k, v) {
            	if(callback) return callback(this.options.list, k, v);
            	else return v;
            }
    	});
    },
    /**
     * 初始化自动补全 , 提供基础数据 , 无需发生请求
     * @param id 页面标签/元素ID
     * @param data 基础数据
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    selectTypeahead: function (id, data, key, value, callback){
        var $ele = com.focusPage('#' + id).typeahead({
            list: [],
            source: function (query, process) {
                
                var res = [];
                
                if(query.length < 2){
                    res = data.slice(0, 5);
                }else{
                    $.each(data, function(i, v){
                        if(v[value].indexOf(query) != -1) res.push(v);
                    });
                }
                $.proxy(this.options.callback, this)(res)
            }, matcher: function (item) {
                return true;
            }, callback: function (list) {
                this.options.list = list;
                this.flprocess(list, key, value);
            },
            isResultTypeMap: true,
            flupdater: function (k, v) {
                if(callback) return callback(this.options.list, k, v);
                else return v;
            }
        });
    },
    /**
     * 初始化自动补全 , 利用接口完成基础数据获取
     * @param id 页面标签/元素ID
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    autoTypeahead: function (id, url, name, args, result, key, value, callback){
        com.initTypeahead(id, url, name, args, result, key, value, callback);
    },
    /**
     * 更新自动补全 , 显示内容 , 对应key值
     * @param id 页面标签/元素ID
     * @param key 补全元素key值
     * @param value 补全元素value值
     */
    updateTypeahead: function(id, key, value){
        com.focusPage('#' + id).val(value).attr('data-typeahead-key', key);
    },
    /**
     * 获取自动补全对应key值
     * @param id 页面标签/元素ID
     */
    cleanTypeahead: function(id){
        com.focusPage('#' + id).val("").removeAttr('data-typeahead-key');
    },
    initChosen: function (id, url, name, post, result, key, value) {

        var $e = com.focusPage('#' + id);

        $e.chosen({
            allow_single_deselect: true
        });

        var $i = $('#' + id + '_chosen input');
        var $c = $('#' + id + '_chosen');

        $i.bind("input", function () {
            var $pinyin = $(this).val();

            if ($(this).val() != "") {

                var $p = {}; $p[name] = $pinyin;

                com.post(url, $.extend({}, $p, post), function (res) {

                    var html = '<option value="">&nbsp;</option>';

                    if (res[result] != null) {
                        var kv = res[result];
                        var length = kv.length;

                        for (var i = 0; i < length; i++) {
                            var _ = kv[i];
                            html += '<option value="' + _[key] + '">' + _[value] + '</option>';
                        }
                    }

                    $e.html(html).trigger("chosen:updated");
                });
            }
        });

        $c.css("width", "200px");

        return $e;
    },
    updateChosen: function (id, key, value) {
        return com.focusPage("#" + id).html($('<option></option>').attr('value', key).text(value)).trigger("chosen:updated");
    },
    /**
     * 显示图片 , 图片标签赋值地址 , 返回显示图片地址
     * @param $e 图片元素对象
     * @param url 图片路径
     * @param width 宽度
     * @param height 高度
     * @param alt alt信息
     * @param defaultUrl 默认地址
     * @param type 类型 , 0: 本地 , 1: 钉钉
     */
    showImg: function ($e, url, width, height, alt, defaultUrl, type) {

        var $media = '', imgUrl = '';

        if (type) {
            $media = config.dmedia;
            imgUrl = url ? $media + url + '_' + alt + '.jpg' : defaultUrl;
        } else {
            $media = config.media;
            imgUrl = url ? $media + api.common.showImg.url + '?imgBasePath=' + url + '&divFlag=1&width=' + width + '&height=' + height + '&timestamp=' + new Date().getTime() : defaultUrl;
        }

        $e.attr("src", imgUrl).attr("alt", alt).error(function () {
            $(this).hide();
        });

        return $media + api.common.showImg.url + '?imgBasePath=' + url;
    },
    downloadFile: function ($e, url, name) {
        $e.attr('href', config.media + api.common.downloadFile.url + "?downloadFilePath=" + url + "&fileName=" + name).attr('target', '_blank');
    },
    /**
     * 弹窗 , 显示指定url地址内容
     * @param title 标题
     * @param url 地址
     * @param success 成功回调方法
     * @param cancel 取消回调方法
     * @param isPrint 是否显示打印按钮
     */
    popup: function (title, url, success, cancel, isPrint) {
        var layerPra = {
            type: 2,
            skin: 'layui-layer-lan',
            title: title,
            content: url,
            zIndex: 9999,
            move: false,
            success: function () {
                if (success != null && typeof(success) == 'function') {
                    success();
                }
            },
            cancel: function () {
                if (cancel != null && typeof(cancel) == 'function') {
                    cancel();
                }
            }
        };

        if(isPrint){
            $.extend(layerPra,{btn:["打印"],btn1:function(index, layero){
                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.print();
                }, success:function (index, layero) {
                    $('.layui-layer-title').text("");

                    var divM = $("<div></div>");
                    var div1 = $("<div></div>").attr("id","FL-titleDiv").css({"float":"left","width":"33%"}).text(title);
                    var div2 = $(".layui-layer-btn").css({"float":"right","width":"65%"});

                    divM.append(div1,div2).appendTo(com.focusPage('.layui-layer-title'));
                    divM.append(div1,div2).appendTo($('.layui-layer-title'));

                }
            });

            layerPra.skin = "layui-layer-hong"
        }

        layer.full(
            layer.open(layerPra)
        );
    },
    sealJournal: function (level, content) {
        (config.logflag) && console[level](content);
    },
    /**
     * 拆分url参数
     * @param url 地址信息
     */
    splitUrl: function (url) {

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
     * @param obj 验证对象
     * @param rep 替换对象
     */
    checkNull: function (obj, rep) {
        return obj == null || obj == undefined || obj == "" ? rep : obj;
    },
    /**
     * 获取cookie值
     * @param name 名称
     * @return cookie值
     */
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    /**
     * 设置cookie值
     * @param name 名称
     * @param value 值
     * @param minutes 有效时间 , 分钟为单位
     */
    setCookie: function (name, value, minutes) {
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
     * @param name 名称
     */
    deleteCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = com.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    adaptDataArray: function (obj, callback) {
        
        var result = [];
        
        if (obj != undefined) {
            for (var i = 0; i < obj.length; i++) {
                var node = callback(obj[i], i);
                result.push(node);
            }
        }

        return result;
    },
    /**
     * 格式化日期信息 , 格式为yyyy-MM-dd hh:mm:ss
     * @param name 名称
     */
    dateFormat: function(datetime, format){
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    /**
     * 当前时间 , 格式为yyyy-MM-dd hh:mm:ss
     * @param name 名称
     */
    currentTime: function () {
        var date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }
};

(function ($) {
    
    /**
     * 判断数组中是否包含某元素
     * @param value 判断元素
     * @param defaults 默认值
     * @return 如果存在返回判断元素 , 否则返回默认值
     */
    Array.prototype.contains = function (value, defaults) {
        return $.inArray(value, this) != -1 ? value : defaults;
    };
    
    /**
     * 面包屑显示
     * @param icon 图标 , 开始位置显示
     * @param items 面包屑元素列表
     */
    $.breadcrumb = function (icon, items) {
        
        $('.breadcrumb').empty();
        
        if (!$.isArray(items)) return false;
        
        $.each(items, function (k, o) {
            $('.breadcrumb').append($('<li class="nav' + (k + 1) + '"></li>').append(k == 0 ? '<i class="fa fa-fw ' + icon + '"></i>&nbsp;&nbsp;&nbsp;' + o : o, '&nbsp;&nbsp;'));
        });
    }
    
    /**
     * 显示帮助文档
     * @param container 显示帮助按钮的块级元素 (必须传入标识符, 例如：(".breadcrumb")符号不可省略)
     * @param key 显示帮助文档的内容关键词，与help.json中key值至少相同一个
     * 例：$.showHelp(".breadcrumb", "decoration-create")
     *  执行：从help.json中获取key为"decoration-create"的数据，将在标识为".breadcrumb"的元素之后显示帮助按钮并在点击帮助按钮后显示帮助信息
     */
    $.showHelp = function (container, key) {

        var addHelpBtn = function (v) {
            $(container).append(
                $('<span class="badge badge-purple">帮助</span>').on(ace.click_event, function () {
                    layer.open({
                        type: 1,
                        title: v.title,
                        area: ["40%", ( $(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750 ) + "px"],
                        maxmin: false,
                        zIndex: 9000,
                        content: '<div class="help-content">'+ showHelpInfo(v.content) +'</div>'
                    });
                }).css({"cursor": "pointer", "line-height": "18px"})
            );
            var showHelpInfo = function (content) {
                var container = $('<div></div>');
                if ($.isArray(content)) {
                    $.each(content, function(i, o){
                        if ($.isPlainObject(o)) {
                            $.each(o, function(k, e){
                                if (k == 'title') container.append($('<h3>'+ e +'</h3>'));
                                if (k == 'content') container.append($('<div>'+ e +'</div>'));
                                if (k == 'img') container.append($('<image src="'+ e +'"></image>'));
                                if (k == 'p') {
                                    if($.isArray(e)) {
                                        $.each(e, function(pi, p){
                                            container.append($('<p>'+ p +'</p>'));
                                        });
                                    }else{
                                        container.append($('<p>'+ e +'</p>'));
                                    }
                                }
                            })
                        } else {
                            container.append($('<div>'+ o +'</div>'))
                        }
                    })
                } else {
                    container.append($('<div>'+ content +'</div>'))
                }
                return container.html();
            }
        };

        var getHelpInfo = function (res) {
            
            var _help = res[key];
            
            if(!_help) return false;
            
            if (!_help.hasOwnProperty("title")) {
                getHelpInfo(_help)
            } else {
                addHelpBtn(_help)
            }
        };
        
        com.post(api.ds.help, {}, function(res){
            getHelpInfo(res);
        });
    }
    
    /**
     * 页面表头信息
     * @param title 标题
     * @parma detail 详细信息
     */
    $.fn.statement = function (title, detail) {
        return $(this).prepend("<div class='page-header'><h1>" + title + "<small><i class='icon-double-angle-right'></i> " + detail + "</small></h1></div>");
    }
    
    /**
     * select标签绑定数据
     * @param data 绑定数据
     * @param key 数据项key值
     * @param value 数据项value值
     * @param all 全部选项标识
     * @param callback 回调方法 , 
     * @param other 其他属性
     * @return select标签对象
     */
    $.fn.bindData = function (data, key, value, all, callback, other) {
        
        var $this = this;
        
        if ($this[0] == undefined || $this[0].nodeName.toLowerCase() != "select" || data == undefined){
            console.log("该控件无法绑定列表数据");
            return $this;
        }
        
        if (key == undefined || value == undefined || key == "" || value == "") {
            console.log("该控件无法绑定列表数据");
            return $this;
        }
        
        $this.empty();

        var optionHTML = "";

        if (all) {
            optionHTML = "<option value=''>全部</option>";
        }

        for (var i = 0; i < data.length; i++) {
            
            var item = data[i];
            
            if (typeof item == 'object') {
                var _o = other ? "other='" + item[other] + "'" : "";
                optionHTML = optionHTML + "<option value='" + item[key] + "'" + _o + ">" + item[value] + "</option>";
            } else {
                optionHTML = optionHTML + "<option value='" + item + "' multikey='multikey'>" + item + "</option>";
            }
        }

        $(optionHTML).appendTo($this);

        if (callback)  callback();
        
        return $this;
    }

    /**
     * 开关switch样式初始化
     * @param clazz 样式 , 显示内容 , 需要提前定义
     */
    $.fn.switchBtn = function (clazz) {
        return this.each(function () {
            
            var $this = $(this);
            
            if ($this.type != "checkbox") return false;

            $this.addClass('ace ace-switch ace-switch-5').after("<span class='lbl " + clazz || "" + "'></span>");
        });
    };

    /**
     * 绑定点击事件 , 按钮增加加载效果
     * @param callback 点击事件执行内容
     * @param delayTime 延迟事件
     */
    $.fn.bindClick = function (callback, delayTime) {

        var dfd = $.Deferred();

        var that = this;

        that.click(function () {

            that.button('loading');

            callback();

            setTimeout(function () {
                that.button('reset')
            }, typeof(delayTime) == "number" ? delayTime : 1000);
        });

        return dfd.promise();
    };
    
    /**
     * 时间控件默认配置
     */
    $.fn.datepicker.dates['zh'] = {
        days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        daysShort: ["日", "一", "二", "三", "四", "五", "六"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
        today: "今天",
        clear: "清空",
        format: "mm/dd/yyyy",
        titleFormat: "MM yyyy",
        weekStart: 0
    };

    bootbox.setDefaults({
        locale: "zh_CN",
        show: true,
        backdrop: true,
        closeButton: true,
        animate: true,
        className: "my-modal"
    });
    
})(jQuery);

