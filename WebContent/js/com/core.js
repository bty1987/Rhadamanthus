com = {
    alertDiv: 'fl-alert',
    error: 'error',
    warning: 'warning',
    info: 'info',
    genderType: {"女": true, "男": false, "true": "女", "false": "男"},
    isOrNotType: {"是": true, "否": false, "true": "是", "false": "否"},
    deptType: {"designRegion": "设计大区", "businessRegion": "业务大区", "designDept": "设计部", "businessDept": "业务部", "materialDept": "主材部", "engineeringDept": "工程部", "qualityDept": "质检部", "supervisionDept": "监理部", "dutyDept": "职能部", "adminDept": "行政部", "financeDept": "财务部"},
    currentTime: function () {
        var date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " " + date.getHours() + ':' + date.getSeconds();
    },
    resizeContainer: function () {
    },
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
            com.showAlert(com.warning, "已锁屏不能进行操作！");
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
                com.showAlert(com.error, msg);
                if (failCallback) {
                    failCallback(msg);
                }
            }
        });

    },
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
    cleanItems: function (items) {
        for (var i in items) {
            if (typeof items[i] != 'object') continue;
            if (items[i][0].type == 'checkbox') {
                items[i].prop("checked", false).trigger("change");
                continue;
            } else if (items[i][0].type == 'select-one') {
                if (items[i][0].options[0] != undefined)
                    items[i][0].options[0].selected = true;
            } else {
                items[i].val("");
            }
        }
    },
    validator: {
        required: {
            type: "v_required",
            errorMsg: "内容不能为空",
            func: function (obj) {
                if (obj.val() == null || obj.val() == undefined)
                    return true;
                if (toString.apply(obj.val()) === '[object Array]')
                    return obj.val().toString().trim().length == 0 ? true : false;
                return obj.val().trim().length == 0 ? true : false;
            }
        },
        typeahead: {
            type: "v_typeahead",
            errorMsg: "请使用匹配数据",
            func: function (obj) {
                if (obj.attr('data-typeahead-key') == null || obj.attr('data-typeahead-key') == undefined)
                    return true;
                if (toString.apply(obj.attr('data-typeahead-key')) === '[object Array]')
                    return obj.attr('data-typeahead-key').toString().trim().length == 0 ? true : false;
                return obj.attr('data-typeahead-key').trim().length == 0 ? true : false;
            }
        },
        number: {
            type: "v_number",
            regex: /^[0-9]*$/,
            errorMsg: "请输入数字."
        },
        float: {
            type: "v_float",
            regex: /^(((\d)+(\.)?(\d)*)|(\d)*)$/,
            errorMsg: "请输入浮点数."
        },
        name: {
            type: "v_name",
            regex: /^[\w\u4e00-\u9fa5-.@&!, \/()%\[\]（）*，;。；！、：:?？><]*$/,
            errorMsg: "内容可以由汉字, 字母, 数字,基本标点符号,'-','>','<','_', '.', '@'组成."
        },
        nameen: {
            type: "v_name_en",
            regex: /^[\w-_]*$/,
            errorMsg: "内容可以由字母, 数字, '-', '_'组成."
        },
        email: {
            type: "v_email",
            regex: /^(([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)|(\s)*)$/,
            errorMsg: "内容可以由字母, 数字, '-', '_', '.', '@'组成.(如:muzh@163.com)"
        },
        dateTime: {
            type: "v_dateTime",
            regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
            errorMsg: "请输入正确格式的日期.(YYYY-MM-DD hh:mm:ss)"
        },
        date: {
            type: "v_date",
            regex: /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(20|21|22|23|[0-1]?\d):[0-5]?\d(:[0-5]?\d)?)?$/,
            errorMsg: "请输入正确格式的日期.(YYYY-MM-DD)"
        },
        time: {
            type: "v_time",
            regex: /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/,
            errorMsg: "请输入正确格式的时间.(hh:mm:ss)"
        },
        phone: {
            type: "v_phone",
            regex: /^((1[0-9]{10})*)$/,
            errorMsg: "请输入正确的手机格式 (如:13619181918)."
        },
        phones: {
            type: "v_phones",
            regex: /^(1[0-9]{10})((#1[0-9]{10})){0,4}$/,
            errorMsg: "请输入正确的手机格式 (如:13619181918).如果为多条电话请用#号分隔"
        },
        phones2: {
            type: "v_phones2",
            regex: /^((1[0-9]{10})|(0[0-9]{10}))((#(([0-9]{11})))){0,4}$/,
            errorMsg: "请输入正确的手机号或固定电话 (如:13619181918#02425601918).如果为多条号码请用#号分隔"
        },
        identity: {
            type: "v_identity",
            /*
             * xxxxxx yyyy MM dd 375 0     十八位
             * xxxxxx   yy MM dd  75 0     十五位
             * 地区： [1-9]\d{5}
             * 年的前两位： (18|19|([23]\d))        1800-2399
             * 年的后两位： \d{2}
             * 月份： ((0[1-9])|(10|11|12))
             * 天数： (([0-2][1-9])|10|20|30|31)    闰年不能禁止29+
             * 三位顺序码： \d{3}
             * 两位顺序码： \d{2}
             * 校验码： [0-9Xx]
             * */
            regex: /^\s*$|(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
            errorMsg: "请输入正确的身份证号码."
        },
        price: {
            type: "v_price",
            regex: /^[0-9]+(\.[0-9]{1,2})?$/,
            errorMsg: "请输入正确的金额格式."
        },
        discount: {                     // 折扣 0到1之间两位小数
            type: "v_discount",
            regex: /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/,
            errorMsg: "请输入0到1之间的两位小数."
        },
        numberAll: {                   // 正数或负数 小数两位
            type: "v_numberAll",
            regex: /^(\d{0,8}|\d{0,8}\.[0-9]{1,2})$|^-(\d{0,8}|\d{0,8}\.[0-9]{1,2})$/,
            errorMsg: "请输入正数或负数."
        },
        officer: {
            type: "v_officer",
            regex: /^\s*$|^[\u4e00-\u9fa5]{3}\d{8}[\u4e00-\u9fa5]$/,
            errorMsg: "请输入正确的军官证号."
        },
        amount: {   // 小数点前最多8位,小数点后最多两位
            type: "v_amount",
            regex: /^\s*$|^\d{1,8}(\.\d{1,2})?$/,   // ^\s*$表示验证可以为空，可以是空格和制表符
            errorMsg: "请输入正确的金额格式."
        }

    },
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
    showAlert: function (type, contents) {

        var outtime = 1000;
        var gritterTypeClass = "gritter-info";
        var gritterLightClass = "gritter-light";

        if ($.alert[type] == undefined) {
            console.log("提示类型只能为<error>, <warning> 和 <info>");
        }

        if (type == com.error) {
            gritterTypeClass = "gritter-error";
            gritterLightClass = "";
            outtime = 5000;
        } else if (type == com.warning) {
            gritterTypeClass = "gritter-warning";
            gritterLightClass = "";
            outtime = 3000;
        }

        $.gritter.add({
            title: $.alert[type],
            text: contents,
            class_name: gritterTypeClass + ' gritter-center ' + gritterLightClass,
            time: outtime
        });
    },
    showInfo: function (title, contents) {
        $.gritter.removeAll();

        setTimeout(function () {
            $.gritter.add({
                title: title,
                text: contents,
                class_name: 'gritter-info',
                time: 5000
            });
        }, 500)
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

        if ($("#homeNav .flpage.nav-tab a#tab_"+ menuId +"").length > 0 ) {
            $("#tab_"+ menuId +"").parent().siblings().removeClass("active");
            $("#tab_"+ menuId +"").parent().addClass("active");
            $("#"+ menuId +"").siblings().removeClass("active");
            $("#"+ menuId +"").addClass("active");
            return false;
        }

        var homeNav = $("#homeNav.nav.nav-tabs");
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

        homeNav.append(tabLi.append(taba));
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
            breadcrumb();
        });
        
        homeNav.bind({
            contextmenu: function() {
                return false;
            },
            mousedown: function(e) {
                if (3 == e.which) tabClose.css({'top': 1,'left': e.pageX - 190}).addClass('show');  // 右击
            }
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

        var breadcrumb = function(){
            var temp = [];
            if (tabPane.attr('parentText')) temp.push(tabPane.attr('parentText'));
            if (tabPane.attr('text')) temp.push(tabPane.attr('text'));
            $.breadcrumb(tabPane.attr('icon'), temp);
            $.showHelp('.breadcrumb', tabPane.attr('helpKey'));
        };
        breadcrumb();
    },
    focusPage: function(selecter, contianer){
        if(!contianer){ return $('.flpage.tab-pane.active').find(selecter); }
        else { return $('.flpage.tab-pane.active').find(contianer).find(selecter); }
    },
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
    calendardefault: {
        buttonText: {
            today: '今天', month: '月', week: '周', day: '日', prev: '上一月', next: '下一月'
        },
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    },
    initTypeahead: function (id, url, name, args, result, key, value, callback){
        
        var $ele = com.focusPage('#' + id).typeahead({
            url: url,
            list: [],
            postData: {},
            source: function (query, process) {
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
    updateTypeahead: function(id, key, value){
        com.focusPage('#' + id).val(value).attr('data-typeahead-key', key);
    },
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
                },success:function (index, layero) {
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
    showPopover: function ($obj, msg, placement) {
        $obj = com.focusPage($obj);
        $obj.css('border', '1px red solid');
        $obj.focus().select();
        $obj.removeAttr("data-placement").attr({
            "data-rel": "popover",
            "data-placement": placement,
            "data-content": msg.errorMsg
        }).removeAttr("data-toggle").popover('show');

    },
    checkNull: function (obj, rep) {
        return obj == null || obj == undefined || obj == "" ? rep : obj;
    },
    setCookie: function (name, value, minutes) {
        var expires = "";
        if (minutes) {
            var d = new Date();
            d.setTime(d.getTime() + (minutes * 60 * 1000));
            expires = "expires=" + d.toUTCString();
        }
        document.cookie = name + "=" + value + "; " + expires;
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    deleteCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = com.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
};

Array.prototype.formatArrayMapToStr = function (k, v) {
    var str = "";
    for (var i in this) {
        var _i = this[i];
        if (typeof _i === "object" && _i != null) {
            str += _i[k] + ":" + _i[v] + ";";
        }
    }
    return str;
};

Array.prototype.contains = function (v) {
    for (var i in this) {
        if (this[i] === v) {
            return this[i];
        }
    }
    return undefined;
};

$.extend($, {
    jsonToString: function (jsonObj) {
        var THIS = this;
        switch (typeof (jsonObj)) {
            case 'string':
                return '"' + jsonObj.replace(/(["\\])/g, '\\$1') + '"';
            case 'array':
                return '[' + jsonObj.map(THIS.jsonToString).join(',') + ']';
            case 'object':
                if (jsonObj instanceof Array) {
                    var strArr = [];
                    var len = jsonObj.length;
                    for (var i = 0; i < len; i++) {
                        strArr.push(THIS.jsonToString(jsonObj[i]));
                    }
                    return '[' + strArr.join(',') + ']';
                } else if (jsonObj == null) {
                    return 'null';
                } else {
                    var string = [];
                    for (var property in jsonObj) {
                        string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(jsonObj[property]));
                    }
                    return '{' + string.join(',') + '}';
                }
            case 'number':
                return jsonObj;
            case 'false':
                return jsonObj;
        }
    },
    breadcrumb: function (i, e) {
        $('.breadcrumb').empty();
        if ($.isArray(e)) {
            $.each(e, function (k, o) {
                if (o) {
                    $('.breadcrumb').append($('<li class="nav' + (k + 1) + '"></li>').append(k == 0 ? '<i class="fa fa-fw ' + i + '"></i>&nbsp;&nbsp;&nbsp;' + o : o, '&nbsp;&nbsp;'));
                }
            });
        } else {
            com.showAlert(com.warning, "使用breadcrumb必须传入数组!");
        }
    },
    /**
     * 显示帮助文档
     * @param container 显示帮助按钮的块级元素 (必须传入标识符, 例如：(".breadcrumb")符号不可省略)
     * @param key 显示帮助文档的内容关键词，与help.json中key值至少相同一个
     * 例：$.showHelp(".breadcrumb", "decoration-create")
     *  执行：从help.json中获取key为"decoration-create"的数据，将在标识为".breadcrumb"的元素之后显示帮助按钮并在点击帮助按钮后显示帮助信息
     */
    showHelp: function (container, key) {

        var o = function (v) {
            $(container).append(
                $('<span class="help-button">?</span>')
                    .on(ace.click_event, function () {
                        layer.open({
                            type: 1,
                            title: v.title,
                            area: ["40%", ( $(window).height() * 0.84 < 750 ? $(window).height() * 0.84 : 750 ) + "px"],
                            maxmin: false,
                            zIndex: 9000,
                            content: '<div class="help-content">'+ c(v.content) +'</div>'
                        });
                    })
                    .css({"cursor": "pointer", "line-height": "18px", "font-size": "15px"})
                    .attr({"data-rel": "popover", "data-trigger": "hover", "data-content": "对此页面有疑问 ?"}).popover('show')
            );
            var c = function (content) {
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

        var f = function (r) {
            if (r.constructor == String) return;
            $.each(r, function (i, v) {
                if (key == i) {
                    if (!v.hasOwnProperty("title")) {  // 字典类型不存在属性title
                        f(v)
                    } else {
                        o(v)
                    }
                } else {
                    f(v)
                }
            })
        };

        $.getJSON(api.ds.help.url, function (d) {
            f(d);
        })
    }
});

(function ($) {

    $.extend(true, $.jgrid, com.jgrid);
    $.alert = {
        error: "错误",
        warning: '警告',
        info: '成功'
    };

    $.fn.statement = function (title, detail) {
        return this.each(function () {
            $(this).empty().append("<div class='page-header'><h1>" + title + "<small><i class='icon-double-angle-right'></i> " + detail + "</small></h1></div>");
        });
    };

    $.fn.bindData = function (d, k, v, all, cb, o) {
        if (this[0] != undefined && this[0].nodeName.toLowerCase() == "select" && d != undefined) {
            this.empty();

            var optionHTML = "";

            if (all) {
                optionHTML = "<option value=''>全部</option>";
            }

            for (var i = 0; i < d.length; i++) {
                if (typeof d[i] == 'object') {
                    if (k == undefined || v == undefined || k == "" || v == "") {
                        console.log("该控件无法绑定列表数据");
                        return this;
                    }
                    var _o = o ? "other='" + d[i][o] + "'" : "";
                    optionHTML = optionHTML + "<option value='" + d[i][k] + "'" + _o + ">" + d[i][v] + "</option>";
                } else {
                    optionHTML = optionHTML + "<option value='" + d[i] + "' multikey='multikey'>" + d[i] + "</option>";
                }
            }

            $(optionHTML).appendTo(this);

            if (cb) {
                cb();
            }
        } else {
            console.log("该控件无法绑定列表数据");
        }
        return this;
    };
    $.fn.switchBtn = function (c) {
        return this.each(function () {
            $this = $(this);
            _c = c || "";

            if (this.type != "checkbox") {
                return;
            }

            $this.addClass('ace ace-switch ace-switch-5').after("<span class='lbl " + _c + "'></span>");
        });
    };

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

    bootbox.setDefaults({
        locale: "zh_CN",
        show: true,
        backdrop: true,
        closeButton: true,
        animate: true,
        className: "my-modal"
    });
})(jQuery);

