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
     * 图表默认配置 , Echarts
     */
    chartdefault: {
        toolbox: {
            show : true,
            feature : {
                //saveAsImage : {show: true}
            }
        }
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
            return false;
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
            return false;
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
                return false;
            }

            url = 'result/' + api.url.split('.')[0] + '.json';
        } else {
            url = server + api.url;
            opts["authentication"] = params.authentication;
        }
        
        if (api.type == 'update' && api.tranargs){
            $.each(opts, function(k, v){
                if(api.tranargs.args.indexOf(k.replace(/\[\d+\]/, '')) != -1){
                    utils.accExtend(opts, k);
                }
            });
        }

        $.ajax({
            url: url,
            data: opts,
            type: url.indexOf('.json') != -1 ? "get" : "post",
            dataType: "json",
            async: optAsync, //设为false就是同步请求
            success: function (res) {
                if (res == null) {
                    return false;
                }
                
                if (res.errorCode == 0) {
                    
                    if((api.type == 'query' && api.tranargs) || (api.type == "update" && api.tranargs.query)){
                        
                        var tranargs = api.tranargs.query ? api.tranargs.query : api.tranargs;
                        
                        $.each(tranargs, function(i, v){
                            
                            com.getProp(res, v.result, '-', function(o){
                                if($.isArray(o)){
                                    $.each(o, function(i, vv){
                                        utils.accReduce(vv, v.args);
                                    });
                                }else if($.isPlainObject(o)){
                                    utils.accReduce(o, v.args);
                                }
                            });
                        });
                    }
                	
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
            
            if (!item || !item[0]) continue;
            if (typeof item != 'object' && typeof item[0] != 'object') continue;
            
            if (item[0].type == 'checkbox') {
                item.prop("checked", false).trigger("change");
            } else if (item[0].type == 'select-one') {
                if (item[0].options[0] != undefined) item[0].options[0].selected = true;
            } else {
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
    validate: function (container, placement) {
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return true;

        var _placement = placement == "" || placement == null || placement == undefined ? 'right' : placement;

        var _count = 0;
        
        $.each(com.validator, function (k, value) {
            
            com.focusPage(" ." + value.type + ":visible", container).each(function (i, v) {

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

        layer.closeAll("tips");
    },
    /**
     * 提示
     * @param type 类型 , 可以使用com.info, com.warning, com.error
     * @param contents 显示内容
     */
    showTip: function (obj, msg, direc) {
        direc = direc ? ["", "top", "right", "bottom", "left"].indexOf(direc) : 1
        layer.tips(msg, obj, {tips: [direc ,'#3595CC']});
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
        layer.confirm(content, {title: false, resize: false, closeBtn: false}, function(index){
            layer.close(layer.index);
            success && success();
        }, function(index){
            cancel && cancel();
        });
    },
    /**
     * 选择窗口
     * @param content 确认提示内容
     * @param events 时间列表 , 格式为[{"事件名": 处理方法}]
     */
    showSelection: function(content, events){
        
        if(!events) return false;
        
        var index = 1;
        var btns = [];
        var options = {title: false, resize: false, closeBtn: false, btn: btns};
        
        $.each(events, function(k, v){
            btns.push(k);
            options["btn"+index++] = v;
        });
        
        layer.confirm(content, options);
    },
    /**
     * 提示信息
     * @param title 表头信息
     * @param contents 提示内容
     */
    showInfo: function (title, contents) {
        layer.alert(contents, {skin: 'layui-layer-lan', title: title, btn: [], move: false});
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
     * 关闭提示
     */
    closePopover: function(){ 
        layer.closeAll('tips'); 
    },
    /**
     * 关闭提示
     */
    closeTip: function(){
        layer.closeAll("tips");
    },
    /**
     * 加载页面 , 切换页面功能
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
        layer.closeAll("tips");
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

        tabDel.on("click", function(){
            
            var _btn = $(this);
            var _tab = _btn.parents('li.flpage');
            
            var _pageId = _btn.parent("a").attr("href");
            var _page = $(_pageId);
            
            if(_tab.hasClass("active")){
                params['urlLoadParams'] = com.splitUrl(_tab.prev().attr('data-page'));
                
                _tab.prev('li.flpage').addClass('active');
                _page.prev('div.flpage').addClass('active');
            }
            
            _tab.remove();
            _page.remove();
        });
        
        taba.on("click", function(){
            tabClose.removeClass('show');
            params['urlLoadParams'] = com.splitUrl(page);
            breadcrumb(tabPane);
            
            layer.closeAll("tips");
        });
        
        tabRefresh.on("click", function(){
            
            var target = $($(this).parent().attr("href"));
            
            var mask = $("<div></div>").addClass("tab-mask").appendTo(target);
            var maskh1 = $("<h1></h1>").css({"position": "absolute", "top": "30%", "left": "45%"}).appendTo(mask);
            var maskicon = $("<i></i>").addClass("icon-spinner icon-spin bigger-450").appendTo(maskh1);
            
            setTimeout(function(){
                tabPane.load(page);
            }, 1200);
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
    typeahead: function(container, defaults, isKey){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        var _ = container.attr('data-typeahead-key');
        if(isKey) _ = container.val();
        if(!defaults) defaults = '';
        return  _ ? _ : defaults;
    },
    /**
     * 初始化自动补全 , 利用接口完成基础数据获取
     * @param id 页面标签/元素ID/样式class
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    initTypeahead: function (container, url, name, args, result, key, value, callback){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        var $ele = container.typeahead({
            url: url,
            list: [],
            postData: args,
            source: function (query, process) {
                if(query.length < 2) return false;
                var options = {};
                options[name] = query;
                com.post(this.options.url, $.extend(options, this.options.postData), $.proxy(this.options.callback, this));
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
     * @param id 页面标签/元素ID/样式class
     * @param data 基础数据
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    selectTypeahead: function (container, data, key, value, callback){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        var $ele = container.typeahead({
            list: data,
            source: function (query, process) {
                
                var res = [];
                var data = this.options.list;
                
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
     * @param id 页面标签/元素ID/样式class
     * @param url 请求地址
     * @param args 请求参数
     * @param result 返回结果名称
     * @param key 补全元素key值
     * @param value 补全元素value值
     * @param callback 回调方法 , 选中元素之后执行
     */
    autoTypeahead: function (container, url, name, args, result, key, value, callback){
        com.initTypeahead(container, url, name, args, result, key, value, callback);
    },
    /**
     * 更新自动补全 , 显示内容 , 对应key值
     * @param id 页面标签/元素ID
     * @param key 补全元素key值
     * @param value 补全元素value值
     */
    updateTypeahead: function(container, key, value){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        container.val(value).attr('data-typeahead-key', key);
    },
    /**
     * 重置自动补全数据源
     * @param id 页面标签/元素ID
     * @param data 数据源
     * @param args 请求参数
     */
    resetTypeahead: function(container, data, args){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        if (data) container.typeahead("list", data);
        if (args) container.typeahead("args", args);
    },
    /**
     * 获取自动补全对应key值
     * @param id 页面标签/元素ID
     */
    cleanTypeahead: function(container){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        container.val("").removeAttr('data-typeahead-key');
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

        var $media = '', imgUrl = '', sourceUrl = '';

        if (type == 1) {
            $media = config.dmedia;
            imgUrl = url ? $media + url + '_' + alt + '.jpg' : defaultUrl;
        } else if (type == 2) {
            sourceUrl = com.showObs($e, url, width, height, alt, defaultUrl, type);
        } else {
            $media = config.media;
            imgUrl = url ? $media + api.common.showImg.url + '?imgBasePath=' + url + '&divFlag=1&width=' + width + '&height=' + height + '&timestamp=' + new Date().getTime() : defaultUrl;
        }
        
        sourceUrl = $media + api.common.showImg.url + '?imgBasePath=' + url;

        $e.attr("src", imgUrl).attr("layer-src", sourceUrl).attr("alt", alt).error(function () {
            $(this).hide();
        });
        
        return sourceUrl;
    },
    /**
     * 清空图片 , 图片标签地址等信息
     * @param $e 图片元素对象
     */
    clearImg: function($e){
        return $e.removeAttr("src").removeAttr("layer-src").removeAttr("alt");
    },
    showOss: function ($e, url, width, height, alt, defaultUrl, type) {

        var imgUrl = url + '?x-oss-process=image/resize,m_fill,h_' + height + ',w_' + width;

        $e.attr("src", imgUrl).attr("alt", alt).error(function () {
            $(this).hide();
        });

        return url;
    },
    showObs: function ($e, url, width, height, alt, defaultUrl, type) {
        
        var imgUrl = url + '?x-image-process=image/resize,m_fill,h_' + height + ',w_' + width;

        $e.attr("src", imgUrl).attr("alt", alt).error(function () {
            $(this).hide();
        });

        return url;
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
     * @returns 弹窗索引
     */
    popup: function (title, url, success, cancel, isPrint) {
        
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
            success: function () {
                if (success != null && typeof(success) == 'function') success();
            },
            cancel: function () {
                if (cancel != null && typeof(cancel) == 'function') cancel();
            },
            end: function () {
                if (cancel != null && typeof(cancel) == 'function') cancel();
            },
        };
        
        if(isPrint){
            
            var printConf = {
                skin: "layui-layer-hong",
                success: function (layero, index) {
                    var $title = $(layero).find('.layui-layer-title').text("");
                    
                    var divM = $("<div></div>").appendTo($title);
                    var div1 = $("<div></div>").attr("id","FL-titleDiv").css({"float":"left", "width":"33%", "padding": "0px"}).text(title).appendTo(divM);
                    
                    var btns = $('<div class="layui-layer-btn layui-layer-btn-" style="float: right; width: 65%; padding: 0px;"></div>').appendTo(divM);
                    var btn1 = $('<a class="layui-layer-btn0">普通打印</a>').appendTo(btns);
                    var btn2 = $('<a class="layui-layer-btn0">热敏打印</a>').appendTo(btns);
                    
                    btn1.click(function(){
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        if(typeof (isPrint) === "function")isPrint(layero);
                        iframeWin.print();
                        return false;
                    })
                    
                    btn2.click(function(){
                        printer.handle();
                        if(typeof (isPrint) === "function")isPrint(layero);
                        return false;
                    })
                    
                    if (success != null && typeof(success) == 'function') {
                        success();
                    }
                }
            }
            
            $.extend(options, printConf);
        }
        
        return setTimeout(function(){layer.open(options)}, 200);
    },
    /**
     * 弹窗 , 密你页类型
     * @param container 页面容器
     * @param holder 页面容器
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4mini: function(container, holder, title, success, cancel, prepare){
        
        if(prepare && typeof(prepare) == 'function') prepare();
        
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
            success: function (layer, index) {
                if(success && typeof(success) == 'function') success();
            },
            cancel: function () {
                if(cancel && typeof(cancel) == 'function') cancel();
            },
            end: function(){
                layer.closeAll("tips");
                if(cancel && typeof(cancel) == 'function') cancel();
                _container.empty();
            }
        }
        
        return setTimeout(function(){layer.open(options)}, 200);
    },
    /**
     * 弹窗 , 编辑页类型
     * @param holder 页面容器
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4model: function(holder, title, success, cancel, prepare){
        
        if(prepare && typeof(prepare) == 'function') prepare();
        
        if(holder && typeof(holder) == "object" && holder.length) holder = holder;
        else if(holder && typeof(holder) == "object") holder = [holder];
        else if(holder && typeof(holder) == "string") holder = com.focusPage(!/\W+/.test(holder) ? '#' + holder : holder);
        else return false;
        
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
            success: function (layer, index) {
                if(success && typeof(success) == 'function') success();
            },
            cancel: function () {
                if(cancel && typeof(cancel) == 'function') cancel();
            },
            end: function () {
                layer.closeAll("tips");
                if(cancel && typeof(cancel) == 'function') cancel();
            }
        }
        
        return setTimeout(function(){layer.open(options)}, 200);
    },
    /**
     * 弹窗 , 内嵌页类型
     * @param holder 页面容器
     * @param url 地址
     * @param title 标题
     * @param success 成功回调
     * @param cancel 取消回调
     * @param prepare 前置回调
     * @returns 弹窗索引
     */
    popup4page: function(holder, url, title, success, cancel, prepare){
        
        if(prepare && typeof(prepare) == 'function') prepare();
        
        var _holder = com.focusPage(holder);
        
        var _width = $(window).width() * 0.8;
        var _height = $(window).height() * 0.8;
        
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
            success: function (layer, index) {
                _holder.load(url);
                if(success && typeof(success) == 'function') success();
            },
            cancel: function () {
                if(cancel && typeof(cancel) == 'function') cancel();
            },
            end: function () {
                layer.closeAll("tips");
                if(cancel && typeof(cancel) == 'function') cancel();
                _holder.empty();
            }
        }

        return setTimeout(function(){layer.open(options)}, 200);
    },
    /**
     * 弹窗 , 单页类型 , 支持打印
     * @param title 标题
     * @param url 地址
     * @param success 成功回调方法
     * @param cancel 取消回调方法
     * @param isPrint 是否显示打印按钮
     * @returns 弹窗索引
     */
    popup4frame: function(title, url, success, cancel, isPrint){
        com.popup(title, url, success, cancel, isPrint);
    },
    /**
     * 弹窗 , 图片类型
     * @param holder 页面容器
     * @returns 弹窗索引
     */
    popup4photos: function(holder){
        com.focusPage(holder).unbind();
        return layer.photos({"photos": holder, move: false});
    },
    /**
     * 关闭弹窗
     * @param type 类型为字符串(tips/page) , 类型为对象 , 关闭对象所属的弹窗
     */
    closePopup: function(index){
        if(index && typeof(index) == "object"){
            layer.close(index.parents(".layui-layer").attr("times"));
        }else if(index && typeof(index) == "string"){
            layer.closeAll(index);
        }else{
            layer.closeAll()
        }
    },
    /**
     * 日志打印信息
     * @param content 内容
     */
    debug: function (content) {
        (config.logflag && config.logflag > 1) && console.info(content);
    },
    /**
     * 日志打印信息
     * @param content 内容
     */
    wrong: function(content){
        (config.logflag && config.logflag > 0) && console.error(content);
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
    /**
     * 格式化日期信息 , 格式为yyyy-MM-dd hh:mm:ss
     * @param name 名称
     */
    dateFormat: function(datetime, format){
        
        if(!datetime) datetime = new Date();
        if(!format) format = "yyyy-MM-dd hh:mm:ss";
        
        var yyyy = datetime.getFullYear();
        var MM = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var dd = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hh = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
        var mm = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var ss = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        
        format = format.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd).replace("hh", hh).replace("mm", mm).replace("ss", ss);
        
        return format;
    },
    /**
     * 当前时间 , 格式为yyyy-MM-dd hh:mm:ss
     * @param name 名称
     */
    currentTime: function () {
        return com.dateFormat();
    },
    /**
     * 图标工具方法
     * @param parentId 图表容器ID
     * @param elementId 图标元素ID
     * @param args 请求参数
     * @param styles 图标元素样式
     */
    charts: function(parentId, elementId, url, args, clazz, styles, theme, excuter){
        
        if(!echarts) return false;
        
        var $parent = com.focusPage("#" + parentId);
        
        if (!$parent) return false;
        
        styles = styles ? styles : {};
        theme = theme ? theme : "light";
        
        var $element = $("<div></div>").attr("id", elementId).addClass(clazz).css(styles).appendTo($parent);
        
        if ($element.length == 0) return false;
        
        var $options = $.extend({}, com.chartdefault);
        var $chart = echarts.init($element[0], theme);
        
        $chart.showLoading();
        
        com.post(url, args, function(res){
            $chart.hideLoading();
            if(excuter && typeof(excuter) == 'function') excuter(res);
            $chart.setOption($.extend($options, res.option));
        });
        
        return $chart;
    },
    /**
     * 日期/时间初始化方法
     * @param container 容器ID
     * @param type 类型 , 支持: year , month , date , time
     * @param range 是否为范围
     */
    datetime: function(container, type, range){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(container);
        else return false;
        
        $(container).attr("readonly", "readonly");
        
        type = type && typeof(type) == "string" ? ["year", "month", "day", "date", "time"].indexOf(type) != -1 ? type : "date" : "date";
        range = range ? true : false;
        
        var format = range ? "yyyy/MM/dd" : "yyyy-MM-dd";
        
        if(type == "year") format = "yyyy";
        else if(type == "month") format = "MM";
        else if(type == "day") {format = "dd"; type="date"}
        else if(type == "time") format = "HH:mm:ss";
        
        $.each(container, function(i, e){
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
     * 上传文件/图片
     * @param container 上传容器
     * @param title 标题
     * @param uapi 请求API
     * @param clazz 样式
     * @param exts 支持格式
     * @param args 请求参数
     * @param limit 限制数量
     * @param success 成功回调
     * @param fail 失败回调
     * @param complete 完成回调
     */
    uploadify: function(container, title, uapi, clazz, exts, args, limit, success, fail, complete){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "string") container = com.focusPage(container);
        else return false;
        
        var formData = $.extend({}, args);
        var multi = limit && limit > 1 ? true : false;
        var queueSizeLimit = limit ? limit : 1;
        var fileTypeExts = exts ? exts : '*.jpg;*.jpeg;*.gif;*.png';
        var buttonClass = clazz ? clazz : 'btn btn-success';
        
        var url = config.media + (uapi ? uapi.url : exts.indexOf('jpg') == -1 ? api.common.uploadOther.url : api.common.uploadImg.url);
        
        container.html("").Huploadify({
            'debug': false, // 开启调试
            'auto': true, // 是否自动上传
            'successTimeout': config.uploadTimeout, // 超时时间
            'formData': formData, // 附带值
            'multi': multi, // 批量上传
            'buttonClass': buttonClass,
            'buttonText': title,
            'overrideEvents' : ['onDialogClose'],  // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
            'uploader': url, // 上传处理程序
            'height': '45', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': fileTypeExts, // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'queueSizeLimit' : limit, // 上传数量
            'onUploadSuccess': function(file, data, response){ //上传到服务器,服务器返回相应信息到data里
                var datas = eval("("+data+")");
                if(datas.errorCode == 0 && typeof(success) == "function"){
                    success(datas, file);
                }else{
                    com.showAlert(com.error, "上传失败");
                    console.log(datas);
                    if(typeof(fail) == "function") fail(datas);
                }
            }, 'onQueueComplete': function(){
                if(typeof(complete) == "function") complete();
            }
        });
    },
    /**
     * 获取对象中属性
     * @param o 对象
     * @param props 属性 , 可以为字符串或数组
     * @param flag 拆分属性分隔标识
     * @param callback 回调方法
     */
    getProp: function(o, props, flag, callback){
        
        if(!props) callback(o);
        
        if(typeof props == 'string') props = props.split(flag);

        var prop = props.shift();

        if (props.length == 0) {
            callback(o[prop]);
        } else if ($.isArray(o[prop])) {
            $.each(o[prop], function(i, v){
                com.getProp(v, $.extend([], props), flag, callback);
            });
        } else {
            com.getProp(o[prop], props, flag, callback);
        }
    },
    
    initForm: function(container, title, forms, btns, prop, show, post, hide){
        
        if(container && typeof(container) == "object" && container.length) container = container;
        else if(container && typeof(container) == "object") container = [container];
        else if(container && typeof(container) == "string") container = com.focusPage(!/\W+/.test(container) ? '#' + container : container);
        else return false;
        
        if(prop && typeof(prop) === 'function') prop();
        
        container.addClass("modal fade");
                    
        var dialog = $("<div>").addClass("modal-dialog").appendTo(container);
        var content = $("<div>").addClass("modal-content").appendTo(dialog);
        var header = $("<div>").addClass("modal-header").appendTo(content);
        
        $("<span>").addClass("close").html("×").attr("data-dismiss", "modal").appendTo(header);
        $("<h4>").addClass("modal-title").html(title).appendTo(header);
        
        var body = $("<div>").addClass("modal-body").appendTo(content);
        var hform = $("<form>").addClass("form-horizontal").appendTo(body);
        
        $.each(forms, function(i, v){
            
            var group = $("<div>").addClass("form-group").appendTo(hform);
            
            if(v.type == "div"){
                $("<div>").addClass(v.clazz).attr("id", v.id).appendTo(group);
            }else{
                
                var $input = null;
                
                if(v.type == "select") $input = $("<select>");
                else if(v.type == "switch") $input = $("<input>").attr("type", "checkbox").addClass("ace ace-switch ace-switch-5");
                else $input = $("<input>").attr("type", v.type);
                
                $("<label>").addClass("col-md-3 control-label no-padding-right " + (v.validator.indexOf("v_require") != -1 ? "orange" : "")).text(v.name).appendTo(group);
                
                var inputCont = $("<div>").addClass("col-md-9").appendTo(group);
                $input.addClass("col-md-7").addClass(v.validator).addClass(v.clazz).attr("id", v.id).appendTo(inputCont);
                
                if(v.type == "switch") inputCont.append($("<div>").addClass("lbl " + v.clazz));
            }
            
        });
        
        var footer = $("<div>").addClass("modal-footer").appendTo(content);
        
        $.each(btns, function(i, v){
            $("<button>").addClass("btn btn-default").addClass(v.clazz).attr("id", v.id).text(v.name).appendTo(footer);
        });
        
        $("<button>").attr("data-dismiss", "modal").addClass("btn btn-default").text("取消").appendTo(footer);
        
        if(prop && typeof(prop) === 'function') prop();
        
        return container;
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
     * 拆分数组 , 数组元素为规律对象 , 利用元素中key和value值返回对象结构
     * @param key 数组元素key值
     * @param value 数组元素value值
     * @returns 对象结构
     */
    Array.prototype.split = function(key, value){
        var _pack = {};
        $.each(this, function(i, v){
            _pack[v[key]] = v[value];
        });
        return _pack;
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
     * @param container 显示帮助按钮的块级元素 (必须传入标识符, 例如: (".breadcrumb")符号不可省略)
     * @param key 显示帮助文档的内容关键词 , 与help.json中key值至少相同一个
     * 例: $.showHelp(".breadcrumb", "decoration-create")
     *  执行: 从help.json中获取key为"decoration-create"的数据, 将在标识为".breadcrumb"的元素之后显示帮助按钮并在点击帮助按钮后显示帮助信息
     */
    $.showHelp = function (container, key) {

        var addHelpBtn = function (v) {
            $(container).append(
                $('<span class="badge badge-purple">帮助</span>').on("click", function () {
                    layer.open({
                        type: 1,
                        title: v.title,
                        area: ["40%", ( $(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750 ) + "px"],
                        maxmin: false,
                        move: false,
                        zIndex: 5000,
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
        
        $this.empty();

        var optionHTML = "";

        if (all) {
            $("<option value=''>" + (typeof all == "string" ? all : "全部") +"</option>").appendTo($this);
        }

        for (var i = 0; i < data.length; i++) {
            
            var item = data[i];
            
            if (typeof item == 'object') {
                var _o = other ? "other='" + item[other] + "'" : "";
                $("<option value='" + item[key] + "'" + _o + ">" + item[value] + "</option>").appendTo($this);
            } else {
                $("<option value='" + item + "' multikey='multikey'>" + item + "</option>").appendTo($this);
            }
        }

        if (callback) callback();
        
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
    
})(jQuery);

