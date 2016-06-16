/**
 * Created by Administrator on 2016/4/7.
 * eval()方法使用，通过方法名字符串调用方法
 */


var Searcher = function(){

    /*各种设置*/
    var basicConf = {
        condCodeArrs : null,
        url : null,
        historyName : null,//保留搜索条件的参数名
        $searcher : null,
        $pager : null,
        displayFunc : null,
        extraParams : {},//额外的查询参数
    };

    /*查询条件各种操作*/
    var searchCond = {
        /**
         * 根据查询条件的编号列表初始化页面查询条件区域
         * params:
         *      condCodeArrs:数组（查询条编号的数组）
         *      searchId:放查询条件的div的id
         *      url:查询调用的URL
         *      displayFunc:向后台请求的回调函数
         * */
        renderConds : function(){
            var that = this;
            var $searchBtn = $('<button></button>').addClass('btn btn-xs btn-info btn-search').html('查询');

            basicConf.$searcher.empty();

            basicConf.condCodeArrs && basicConf.condCodeArrs.length &&(
                $.each(basicConf.condCodeArrs,function(i,val){
                    var condRule = Condition.getRuleByCondName(val);
                    var $item = null;
                    condRule && ($item = that.createCondItem(val,condRule));

                    $item && $item.appendTo(basicConf.$searcher);
                }),
                    basicConf.$searcher.append($searchBtn),
                    $searchBtn.click(function(){
                        basicConf.$pager.hide();

                        paging.nowPage["paging.page"] = 0;
                        paging.nowPostParams = null;
                        var _params = paging.getParams();
                        if(_params){
                            _params["paging.page"] += 1;
                            paging.getDataByPage( _params);
                        }
                    })
            );
        },
        /**
         * 根据查询条件名和查询条件的规则创建一个查询条件的标签并返回
         * params:
         *    condName:查询条件编号
         *    condRule:
         * return:
         *      $item:一条查询条件的标签
         * */
        createCondItem : function(condCode, condRule){


            var $item = $('<span></span>').addClass('inline');
            var $label = $('<label></label>');


            var $showItem,$valueItem;

            var _rlabel = condRule['label'];//查询条件对应的中文提示
            var _rtype = condRule['type'];//标签类型

            var _rname = condRule['submitConfig']['name'];//向后台提交提交时的参数名
            var _rop = condRule['submitConfig']['op'];//提交给后台时的查询条件：等于或者包含
            if(condRule['dataSource']){
                var _rurl = condRule['dataSource']['url'];//autofill和select标签获取可选值的接口
                var _rkey = condRule['dataSource']["keyPath"];//autofill和select取值时调用接口后处理返回值时用来作为提交项的参数名
                var _rvalue = condRule['dataSource']["valuePath"];//autofill和select取值时调用接口后处理返回值时用来显示的参数名
                var _rpostParam = condRule['dataSource']["postData"];//autofill和select取值时调用接口时传的参数
                var _rresult = condRule['dataSource']["listPath"];//autofill和select取值时调用接口后取值用的eg：data.deptList
            }

            $label.text(_rlabel + ':').appendTo($item);

            if(_rtype=="text"){
                $showItem = $('<input>').attr({
                    "type" : "text",
                    "placeholder" : "请输入" + _rlabel,
                    "name" : condCode,
                    "data-rqs" : _rname,
                    "data-op" : _rop
                }).appendTo($item);
                // $line.addClass("text");
            }

            if(_rtype == "dateRangePicker"){
                $showItem = $('<input>').attr({
                    "type" : "text",
                    "placeholder" : "请输入" + _rlabel,
                    "name" : condCode,
                    "data-op" : _rop,
                    "data-rqs" : _rname
                }).appendTo($item);

                $showItem.daterangepicker(com.dateramgepickerdefault).prev().on(ace.click_event, function(){
                    $(this).next().focus();
                });

            }

            if(_rtype=="autofill"){
                $showItem = $('<input>').attr({
                    "type" : "text",
                    "placeholder" : "请输入" + _rlabel,
                    "name" : condCode,
                    "autocomplete" : "off",
                    "data-op" : _rop,
                    "data-rqs" : _rname
                }).appendTo($item);

                $showItem.typeahead({
                    url: _rurl,
                    list: [],
                    postData: _rpostParam,
                    source: function (query, process) {
                        var options = $.extend({pinyinName: query}, this.options.postData);
                        com.post(this.options.url, options, $.proxy(this.options.callback, this));
                    }, matcher: function (item) {
                        return true;
                    }, callback: function(data){
                        this.options.list = data.autoFillList;
                        this.process(this.options.list);
                    }
                });
            }

            if(_rtype == "select"){

                $showItem = $('<select></select>').attr({
                    "name" : condCode,
                    "data-rqs" : _rname,
                    "data-op" : _rop,
                    "data-rqs" : _rname
                }).append('<option value="">全部</option>').appendTo($item);


                _rurl && com.post(_rurl, _rpostParam, function(result){
                    var data = result[_rresult];
                    data && data.length &&(
                        $.each(data,function(i,v){
                            if("object" !== typeof v){
                                $('<option></option>').attr("value" , v).html(v).appendTo($showItem);
                            }else{
                                $('<option></option>').attr("value" , v[_rkey]).html(v[_rvalue]).appendTo($showItem);
                            }

                        })
                    );
                }, null, false);
                //$line.addClass("select");
            }

            return $item;
        }
    };

    /**分页*/
    var paging = {
        nowPage : {
            "paging.page" : 1,
            "paging.rows" : 10,
            "paging.totalRecords" : 0,
            "paging.totalPage" : 0
        },
        nowPostParams : null,
        /*searchId:存放查询条件的div的id*/
        getParams : function(){
            var _count = 0;
            var _params = {};
            var _condArr = basicConf.condCodeArrs;

            if(this.nowPostParams){
                return this.nowPostParams;
            }

            _condArr && _condArr.length &&(
                $.each(_condArr,function(i,val){
                    var $input = $('[name=' + val + ']', basicConf.$searcher);
                    var _postName = $input.attr("data-rqs");
                    var _rule = Condition.getRuleByCondName( val);
                    var _reg = _rule.submitConfig.validate;
                    var _inputValue = $input.val();
                    var _op = $('[name=' + val + ']', basicConf.$searcher).attr('data-op');
                    if(_inputValue){

                        if(_reg){
                            if(!(_reg.reg).test(_inputValue)){
                                $input.addClass('tooltip-info').attr({
                                    "data-rel" : "tooltip",
                                    "data-placement" : "top",
                                    "data-original-title" : _reg.msg

                                }).tooltip('show');

                                _params = null;
                                return false;

                            }else{
                                $input.removeClass("tooltip-info").removeAttr("data-rel").removeAttr("data-placement").removeAttr("data-original-title");
                                _params['filters[' + _count + '].data'] = _inputValue;
                                _params['filters[' + _count + '].field'] = _postName;
                                _params['filters[' + _count + '].op'] = _op;
                                _count +=1;
                            }
                        }else{
                            $input.removeClass("tooltip-info").removeAttr("data-rel").removeAttr("data-placement").removeAttr("data-original-title");
                            _params['filters[' + _count + '].data'] = _inputValue;
                            _params['filters[' + _count + '].field'] = _postName;
                            _params['filters[' + _count + '].op'] = _op;
                            _count +=1;
                        }
                    }
                })
            );

            if(_params){
                _params["paging.page"] = this.nowPage["paging.page"];
                _params["paging.rows"] = this.nowPage["paging.rows"];
                _params = $.extend(true,{},_params,basicConf.extraParams);
            }

            return _params;
        },
        getDataByPage : function(_params){

            com.post(basicConf.url, _params, $.proxy(function(result){
                this.nowPage["paging.page"] = result.paging.page;
                this.nowPage["paging.rows"] = result.paging.rows;
                this.nowPage["paging.totalRecords"] = result.paging.totalRecords;
                this.nowPage["paging.totalPage"] = result.paging.totalPage;
                this.showPagenation(result.paging.page, result.paging.rows, result.paging.totalPage, result.paging.totalRecords);
                //params全局变量,给全局变量赋当前查询条件的值
                params[basicConf.historyName] = _params;

                basicConf.displayFunc(result.paging.data);

            }, this), null, false);
        },
        showPagenation : function(page, rows, totalPage, totalRecords ){

            $('li[name="prev"]', basicConf.$pager).attr('class',page == 1 ? 'previous disabled' : 'previous');
            $('li[name="next"]', basicConf.$pager).attr('class',page == totalPage ? 'next disabled' : 'next');

            $('span[name="nowPage"]', basicConf.$pager).html(page);
            $('span[name="rows"]', basicConf.$pager).html(rows);
            $('span[name="totalPage"]', basicConf.$pager).html(totalPage);
            $('span[name="totalRecords"]', basicConf.$pager).html(totalRecords);
            $(basicConf.$pager).show();
        },

        /*给分页的上一页下一页绑定点击事件*/
        init : function(){
            var _pagenation = this;
            //页面初始化的时候隐藏分页
            basicConf.$pager.hide();
            //上一页下一页绑定
            $('li[name="prev"]', basicConf.$pager).click(function(){
                var _params;
                _pagenation.nowPage["paging.page"] > 1 && (

                    _params = _pagenation.getParams(),
                    _params && (
                        _params["paging.page"] -= 1,
                            _pagenation.getDataByPage(_params)
                    )
                );
            });
            $('li[name="next"]', basicConf.$pager).click(function(){
                var _params;

                _pagenation.nowPage["paging.page"] < _pagenation.nowPage["paging.totalPage"] && (

                    _params = _pagenation.getParams(),
                    _params && (
                        _params["paging.page"] += 1,
                            _pagenation.getDataByPage(_params)
                    )
                );
            });
        }
    };

    var searchByPresentParams = function(){
        var _params = params[basicConf.historyName] ? params[basicConf.historyName] : {};

        $.each(_params, function(key, val){
            var _pname,_pvalue;
            key.indexOf("field") != -1 && (
                _pname = val,
                    _pvalue = _params[key.substring(0,key.length-5) + "data"],
                    $('[data-rqs="'+ _pname +'"]',basicConf.$searcher).val(_pvalue)
            );
        });
        jQuery.isEmptyObject( _params ) && ( _params["paging.page"] = paging.nowPage["paging.page"], _params["paging.rows"] = paging.nowPage["paging.rows"] );

        _params = $.extend({},_params,basicConf.extraParams);
        paging.nowPostParams = _params ;
        paging.getDataByPage(_params);
    };

    return{
        /**
         * 插件的初始化方法
         * params:
         *     condCodeArrs:查询条件编号的数组
         *     searchId:查询控件显示标签id
         *     url:分页查询路径
         *     displayFunc:分页查询的回调函数（画列表）
         *     pagerId:分页控件的标签id
         *     historyName:保存历史查询条件的查询条件名
         *     extraParams: 分页查询的其他查询参数{key:val}形式
         * */
        init : function(condCodeArrs, searchId, url, displayFunc, pagerId, historyName, extraParams){
            /*各种设置*/
            basicConf.condCodeArrs = condCodeArrs;
            basicConf.$searcher = $('#' + searchId);
            basicConf.$pager = $('#' + pagerId);
            basicConf.url = url;
            basicConf.historyName = historyName;
            basicConf.displayFunc = displayFunc;
            extraParams && typeof extraParams == "object" && (basicConf.extraParams = extraParams);

            paging.init();

            searchCond.renderConds();

            searchByPresentParams();
        },
        /*
         * 根据当前条件查询分页信息
         * */
        doSearch : function () {
            searchByPresentParams();
        }
    }
};
