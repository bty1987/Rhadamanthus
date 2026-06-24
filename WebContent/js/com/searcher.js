var Searcher = function() {

    var basicConf = {

        $searcher: null,
        $resulter: null, // 显示内容标签id
        $pager: null,

        url: null,
        conditions: null,
        buttons: [],

        historyName: null,// 保留搜索条件的参数名
        resultName: null,

        params: {},// 额外的查询参数

        displayFunc: null,
        isPage: false,

        lineprop: [],
        linevent: {},

        viewMode: null,
        defaultViewMode: null,
        viewTitle: null,
        viewModes: ["line", "card", "table"],
        viewEnable: false,
        preferEnable: true,
        preferName: null,
        lastData: null,

    };

    var searchCond = {

        /**
         * 根据查询条件的编号列表初始化页面查询条件区域
         *
         * @params:
         * @conditions:数组(查询条编号的数组)
         * @searcherId:放查询条件的div的id
         * @url:查询调用的URL
         * @displayFunc:向后台请求的回调函数
         */
        renderConds: function() {

            var that = this;

            var $searchBtn = $('<button></button>').addClass('btn btn-xs btn-info btn-search').html('查询');
            var $cleanBtn = $('<button></button>').addClass('btn btn-xs btn-danger btn-clean').css('margin', '0px 3px').html('重置');
            var $tendBtn = $('<button></button>').addClass('btn btn-xs btn-warning btn-clean').html('收|展');

            basicConf.$searcher.empty();

            if (!basicConf.conditions || basicConf.conditions.length == 0)
                return false;

            $.each(basicConf.conditions, function(i, val) {

                var condRule = Condition.getRuleByCondName(val);
                var $item = null;

                condRule && ($item = that.createCondItem(val, condRule));
                $item && $item.appendTo(basicConf.$searcher);
            });

            basicConf.$searcher.append($searchBtn).append($cleanBtn).append($tendBtn);

            $searchBtn.click(function() {

                if (basicConf.isPage) {
                    _params = getParams();
                    if (_params) {
                        queryData(_params);
                    }
                } else {

                    basicConf.$pager.hide();

                    paging.nowPage["paging.page"] = 0;
                    paging.nowPostParams = null;

                    var _params = paging.getParams();

                    if (_params) {
                        _params["paging.page"] += 1;
                        paging.getDataByPage(_params);
                    }
                }
            });

            $cleanBtn.click(function() {

                basicConf.$searcher.find('.fl-filter-inline').each(function(i, v) {

                    $($(v).children()[1]) && $($(v).children()[1]).removeAttr('data-typeahead-key').val('');
                });
            });

            $tendBtn.click(function() {

                basicConf.$searcher.find('.fl-filter-inline').each(function(i, v) {

                    if (i > 3) {
                        $(v).toggle();
                    }
                });
            });
        },
        /**
         * 根据查询条件名和查询条件的规则创建一个查询条件的标签并返回
         *
         * @params:
         * @condName:查询条件编号
         * @condRule:
         * @return: $item:一条查询条件的标签
         */
        createCondItem: function(condCode, condRule) {

            var $item = $('<span></span>').addClass('fl-filter-inline');
            var $label = $('<label></label>');

            var $showItem, $valueItem;

            var _rlabel = condRule['label'];// 查询条件对应的中文提示
            var _rtype = condRule['type'];// 标签类型

            var _rname = condRule['submitConfig']['name'];// 向后台提交提交时的参数名
            var _rop = condRule['submitConfig']['op'];// 提交给后台时的查询条件:等于或者包含
            var _ds = condRule['dataSource'];
            var _detail = condRule['detail'];

            if (_ds) {
                var _rurl = _ds['url'];// autofill和select标签获取可选值的接口
                var _rkey = _ds["keyPath"];// autofill和select取值时调用接口后处理返回值时用来作为提交项的参数名
                var _rvalue = _ds["valuePath"];// autofill和select取值时调用接口后处理返回值时用来显示的参数名
                var _rpostParam = _ds["postData"];// autofill和select取值时调用接口时传的参数
                var _rresult = _ds["listPath"];// autofill和select取值时调用接口后取值用的eg:data.deptList
                var _rquery = _ds["query"]; // 提交参数名称,默认为pinyinName
                var _rappr = _ds["appresult"] ? _ds["appresult"] : []; // 返回结果补充对象
            }

            var setOption = function(data) {

                data && data.length && ($.each(data, function(i, v) {

                    if ("object" !== typeof v) {
                        $('<option></option>').attr("value", v).html(v).appendTo($showItem);
                    } else {
                        $('<option></option>').attr("value", v[_rkey]).html(v[_rvalue]).appendTo($showItem);
                    }
                }));
            };

            $label.html(Array(_rlabel.length >= 4 ? 0 : 4 - _rlabel.length).fill("&emsp;").join("") + _rlabel + ':').appendTo($item);

            if (_rtype == "text") {
                $showItem = $('<input>').attr({
                    "type": "text",
                    // "placeholder" : "请输入" + _rlabel,
                    "name": condCode,
                    "data-rqs": _rname,
                    "data-op": _rop,
                    "data-type": _rtype
                }).appendTo($item);
                // $line.addClass("text");
            }

            if (_rtype == "dateRangePicker") {
                $showItem = $('<input>').attr({
                    "type": "text",
                    // "placeholder": "请输入" + _rlabel,
                    "name": condCode,
                    "data-op": _rop,
                    "data-rqs": _rname,
                    "readonly": true,
                    "data-type": _rtype
                }).appendTo($item);

                com.datetime($showItem, "date", true);
            }

            if (_rtype == "datePicker") {
                $showItem = $('<input>').attr({
                    "type": "text",
                    // "placeholder": "请输入" + _rlabel,
                    "name": condCode,
                    "data-op": _rop,
                    "data-rqs": _rname,
                    "data-date-format": "dd-mm-yyyy",
                    "readonly": true,
                    "data-type": _rtype
                }).appendTo($item);

                com.datetime($showItem);
            }

            if (_rtype == "autofill") {

                $showItem = $('<input>').attr({
                    "type": "text",
                    // "placeholder": "请输入" + _rlabel,
                    "name": condCode,
                    "autocomplete": "off",
                    "data-op": _rop,
                    "data-rqs": _rname,
                    "data-type": _rtype
                }).appendTo($item);

                $showItem.typeahead({
                    url: _rurl,
                    list: [],
                    postData: _rpostParam,
                    source: function(query, process) {

                        if (query.length < 2)
                            return false;

                        var _option = {};
                        if (_rquery != undefined) {
                            if (typeof _rquery == "object") {
                                $.each(_rquery, function(i, v) {

                                    _option[v] = query;
                                })
                            } else if (typeof _rquery == "string") {
                                _option[_rquery] = query;
                            }
                        } else {
                            _option["pinyinName"] = query;
                        }
                        var options = $.extend(_option, this.options.postData);
                        com.post(this.options.url, options, $.proxy(this.options.callback, this));
                    },
                    matcher: function(item) {

                        return true;
                    },
                    callback: function(data) {

                        this.options.list = _rappr.concat(data[_rresult]);
                        this.flprocess(this.options.list, [_rkey], [_rvalue]);
                    },
                    isResultTypeMap: true, // 必填值为true,获取key,value的标识,
                    flupdater: function(k, v) {// 下拉列表选中时的一些处理,必填对选中项的key和value做处理

                        if (v.indexOf('-') != -1) {
                            v = v.split('-')[0]
                        }
                        return v;
                    }
                });
            }

            if (_rtype == "select") {

                $showItem = $('<select></select>').attr({
                    "name": condCode,
                    "data-rqs": _rname,
                    "data-op": _rop,
                    "data-type": _rtype
                }).append('<option value="">全部</option>').appendTo($item);

                if (_rurl) {
                    com.post(_rurl, _rpostParam, function(result) {

                        var data = _rappr.concat(result[_rresult]);
                        setOption(data);
                    }, null, false);

                } else {
                    $.each(_rresult, function(i, v) {

                        if ("object" !== typeof v) {
                            $('<option></option>').attr("value", v).html(v).appendTo($showItem);
                        } else {
                            $('<option></option>').attr("value", v[_rkey]).html(v[_rvalue]).appendTo($showItem);
                        }
                    });
                }
            }

            if (_rtype == "selectCaching") {
                $showItem = $('<select></select>').attr({
                    "name": condCode,
                    "data-rqs": _rname,
                    "data-op": _rop,
                    "data-type": _rtype
                }).append('<option value="">全部</option>').appendTo($item);

                var data = {};

                if (_rurl) {
                    if (!jQuery.isEmptyObject(params.selectCaching[condCode])) {
                        data = params.selectCaching[condCode];
                    } else {
                        com.post(_rurl, _rpostParam, function(result) {

                            data = _rappr.concat(result[_rresult]);
                            params.selectCaching[condCode] = data;
                        }, null, false);
                    }
                }

                setOption(data);
            }

            if (_detail) {

                $item.addClass("input-icon input-icon-right");

                $('<i class="icon-filter"></i>').appendTo($item).dblclick(function(res) {

                    params.condition.item = $showItem;
                    params.condition.rkey = _detail.key;
                    params.condition.rvalue = _detail.value;

                    com.popup4page("#" + _detail.content, _detail.url, _rlabel, null, function() {

                        delete params.condition.item;
                        delete params.condition.rkey;
                        delete params.condition.rvalue;
                    });
                });
            }

            return $item;
        }
    };

    /** 分页 */
    var paging = {
        nowPage: {
            "paging.page": 1,
            "paging.rows": 10,
            "paging.totalRecords": 0,
            "paging.totalPage": 0
        },
        nowPostParams: null,
        /**
         * 获取请求参数方法
         */
        getParams: function() {

            var _count = 0;
            var _params = {};
            var _condArr = basicConf.conditions;

            if (this.nowPostParams)
                return this.nowPostParams;

            if (_condArr && _condArr.length) {

                $.each(_condArr, function(i, val) {

                    var $input = com.focusPage('[name=' + val + ']', basicConf.$searcher);
                    var _inputType = $input.attr("data-type");
                    var _postName = $input.attr("data-rqs");

                    var _rule = Condition.getRuleByCondName(val);

                    if (!_rule)
                        return true;

                    var _reg = _rule.submitConfig.validate;
                    var _alone = _rule.submitConfig.alone;

                    var _inputValue = $input.val();
                    var _inputKey = $input.attr("data-typeahead-key");
                    var _op = $('[name=' + val + ']', basicConf.$searcher).attr('data-op');

                    if (!_inputValue)
                        return true;

                    if (_reg && !(_reg.reg).test(_inputValue)) {

                        com.showTip($input, _reg.msg, "top");

                        return false;
                    }

                    if (_inputType == "autofill" && !_inputKey) {

                        com.showTip($input, "请选择选项", "top");

                        return false;
                    }

                    if (_alone) {

                        _params[_postName] = _inputValue;

                        return true;
                    }

                    $input.removeClass("tooltip-info").removeAttr("data-rel").removeAttr("data-placement").removeAttr("data-original-title");

                    _params['filters[' + _count + '].data'] = _inputType == "autofill" ? _inputKey : _inputValue;
                    _params['filters[' + _count + '].field'] = _postName;
                    _params['filters[' + _count + '].op'] = _op;
                    _params['filters[' + _count + '].inputValue'] = _inputValue;

                    _count += 1;
                });
            }

            if (_params) {
                _params["paging.page"] = this.nowPage["paging.page"];
                _params["paging.rows"] = this.nowPage["paging.rows"];
                _params = $.extend(true, {}, _params, basicConf.params);
            }

            return _params;
        },
        /**
         *
         * @param _params
         */
        getDataByPage: function(_params) {

            com.post(basicConf.url, _params, $.proxy(function(result) {

                this.nowPage["paging.page"] = result.paging.page;
                this.nowPage["paging.rows"] = result.paging.rows;
                this.nowPage["paging.totalRecords"] = result.paging.totalRecords;
                this.nowPage["paging.totalPage"] = result.paging.totalPage;

                this.showPagenation(result.paging.page, result.paging.rows, result.paging.totalPage, result.paging.totalRecords);

                // params全局变量,给全局变量赋当前查询条件的值
                if (basicConf.historyName)
                    params[basicConf.historyName] = _params;

                basicConf.lastData = result.paging.data || [];
                renderViewSwitcher();

                (result.paging.data && result.paging.data.length > 0) ? basicConf.displayFunc(result.paging.data) : emptyData();
            }, this), null, false);
        },
        /**
         *
         * @param page
         * @param rows
         * @param totalPage
         * @param totalRecords
         */
        showPagenation: function(page, rows, totalPage, totalRecords) {

            $('li[name="prev"]', basicConf.$pager).attr('class', page == 1 || totalPage == 0 ? 'previous disabled' : 'previous');
            $('li[name="next"]', basicConf.$pager).attr('class', page == totalPage || totalPage == 0 ? 'next disabled' : 'next');

            $('span[name="nowPage"]', basicConf.$pager).html(page);
            $('span[name="rows"]', basicConf.$pager).html(rows);
            $('span[name="totalPage"]', basicConf.$pager).html(totalPage);
            $('span[name="totalRecords"]', basicConf.$pager).html(totalRecords);

            $(basicConf.$pager).show();
        },

        /**
         *
         * @returns
         */
        init: function() {

            var _pagenation = this;

            // 增加分页操作元素
            basicConf.$pager.html('');

            basicConf.buttons && $.each(basicConf.buttons, function(i, v) {

                v.appendTo(basicConf.$pager);
            });

            var $infodiv = $('<div></div>').addClass('pager-info text-center').appendTo(basicConf.$pager);
            var $di = $('<span></span>').text('第').appendTo($infodiv);
            var $nowPage = $('<span></span>').addClass('bigger-120 blue').attr('name', 'nowPage').appendTo($infodiv);
            var $di = $('<span></span>').text('页, 共').appendTo($infodiv);
            var $totalPage = $('<span></span>').addClass('bigger-120 blue').attr('name', 'totalPage').appendTo($infodiv);
            var $di = $('<span></span>').text('页, 每页显示').appendTo($infodiv);
            var $rows = $('<span></span>').addClass('bigger-120 blue').attr('name', 'rows').appendTo($infodiv);
            var $di = $('<span></span>').text('条, 共').appendTo($infodiv);
            var $totalRecords = $('<span></span>').addClass('bigger-120 blue').attr('name', 'totalRecords').appendTo($infodiv);
            var $di = $('<span></span>').text('条, 前往').appendTo($infodiv);
            var $input = $('<input></input>').addClass('fl-page-input').attr('type', 'text').css('font-size', '10px').attr('id', 'pginput').appendTo($infodiv);
            var $di = $('<span></span>').text('页, 条数').appendTo($infodiv);
            var $select = $('<select></select>').addClass('fl-page-select').bindData([{
                'key': '10',
                'value': '10'
            }, {
                'key': '30',
                'value': '30'
            }], 'key', 'value').appendTo($infodiv);

            var $ul = $('<ul></ul>').addClass('pager pull-right').appendTo($infodiv);
            var $prevli = $('<li></li>').addClass('previous').attr('name', 'prev').appendTo($ul);
            var $preva = $('<a></a>').attr('href', 'javascript:void(0);').text('< 上一页').appendTo($prevli);
            var $nextli = $('<li></li>').addClass('next').attr('name', 'next').appendTo($ul);
            var $nexta = $('<a></a>').attr('href', 'javascript:void(0);').text('下一页 >').appendTo($nextli);

            basicConf.$pager.hide();

            // 上一页按钮
            $prevli.click(function() {

                var _params;

                if (_pagenation.nowPage["paging.page"] > 1) {

                    _params = _pagenation.getParams();

                    if (_params) {
                        _params["paging.page"] -= 1;
                        _pagenation.getDataByPage(_params)
                    }
                }
            });

            // 下一页按钮
            $nextli.click(function() {

                var _params;

                if (_pagenation.nowPage["paging.page"] < _pagenation.nowPage["paging.totalPage"]) {

                    _params = _pagenation.getParams();

                    if (_params) {
                        _params["paging.page"] += 1;
                        _pagenation.getDataByPage(_params);
                    }
                }
            });

            $input.bind('keypress', function(event) {

                var _p = $(this).val();

                if (event.keyCode == "13" && /\d+/.test(_p)) {

                    var _params;

                    if (_p <= _pagenation.nowPage["paging.totalPage"] && _p >= 1) {

                        _params = _pagenation.getParams();

                        if (_params) {
                            _params["paging.page"] = parseInt(_p);
                            _pagenation.getDataByPage(_params)
                        }
                    }
                }
            });

            $select.change(function() {

                _params = _pagenation.getParams();

                if (_params) {

                    _params["paging.rows"] = $(this).val();
                    _pagenation.getDataByPage(_params)
                }
            });

            return _pagenation;
        }
    };

    var emptyData = function() {

        var $resultList = com.focusPage('#' + basicConf.$resulter).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    };

    var queryData = function(_params) {

        com.post(basicConf.url, _params, $.proxy(function(result) {

            if (basicConf.historyName)
                params[basicConf.historyName] = _params;

            basicConf.lastData = result[basicConf.resultName] || [];
            renderViewSwitcher();

            (result[basicConf.resultName] && result[basicConf.resultName].length > 0) ? basicConf.displayFunc(result[basicConf.resultName]) : emptyData();
        }, this), null, false);
    };

    /**
     *
     */
    var getParams = function() {

        var _count = 0;
        var _params = {};
        var _condArr = basicConf.conditions;

        _condArr && _condArr.length && ($.each(_condArr, function(i, val) {

            var $input = com.focusPage('[name=' + val + ']', basicConf.$searcher);

            var _inputType = $input.attr("data-type");
            var _postName = $input.attr("data-rqs");

            var _rule = Condition.getRuleByCondName(val);

            if(!_rule) {
                console.log("Condition is not exist . " , val);
                return true;
            }

            var _reg = _rule.submitConfig.validate;
            var _alone = _rule.submitConfig.alone;

            var _inputValue = $input.val();
            var _inputKey = _inputValue != "" ? $input.attr("data-typeahead-key") : $input.removeAttr("data-typeahead-key");
            var _op = com.focusPage('[name=' + val + ']', basicConf.$searcher).attr('data-op');

            if (_inputValue) {

                if (_reg && !(_reg.reg).test(_inputValue)) {

                    com.showTip($input, _reg.msg, "top");

                    _params = null;
                    return false;
                }

                if (_alone) {
                    _params[_postName] = _inputValue;
                } else {
                    $input.removeClass("tooltip-info").removeAttr("data-rel").removeAttr("data-placement").removeAttr("data-original-title");
                    _params['filters[' + _count + '].data'] = _inputType == "autofill" ? _inputKey : _inputValue;
                    _params['filters[' + _count + '].field'] = _postName;
                    _params['filters[' + _count + '].op'] = _op;
                    _params['filters[' + _count + '].inputValue'] = _inputValue;
                    _count += 1;
                }
            }
        }));

        if (_params) {
            _params = $.extend(true, {}, _params, basicConf.params);
        }

        return _params;
    };

    /**
     *
     */
    var searchByPresentParams = function() {

        var _count = 0;
        var _params = params[basicConf.historyName] ? params[basicConf.historyName] : {};

        // 给查询条件赋值
        if (!$.isEmptyObject(_params)) {
            $.each(_params, function(key, val) {

                var _pname, _pvalue, _pkey;

                if (key.indexOf("field") != -1) {

                    _pname = val;
                    _pvalue = _params[key.substring(0, key.length - 5) + "inputValue"];
                    _pkey = _params[key.substring(0, key.length - 5) + "data"];

                    com.focusPage('[data-rqs="' + _pname + '"]', basicConf.$searcher).attr('data-typeahead-key', _pkey).val(_pvalue);

                    _count++;
                }
            });
        }

        if (!basicConf.isPage) {

            if ($.isEmptyObject(_params)) {
                _params["paging.page"] = paging.nowPage["paging.page"];
                _params["paging.rows"] = paging.nowPage["paging.rows"];
            }

            _params = $.extend({}, _params, basicConf.params);
            paging.nowPostParams = _params;

            com.focusPage('.fl-page-input').val(_params["paging.page"]);
            com.focusPage('.fl-page-select').val(_params["paging.rows"]);

            paging.getDataByPage(_params);
        } else {

            queryData($.extend({}, _params, basicConf.params));
        }
    };

    var getElement = function(o, props, dataset) {

        var prop = props.shift();

        if (props.length == 0) {
            return !dataset ? o[prop] : dataset[o[prop]];
        } else if (o[prop]) {
            return getElement(o[prop], props, dataset);
        }

        return "";
    }

    var getPropValue = function(o, prop, dataset) {

        if (typeof prop == 'function')
            return prop(o);

        if (!prop)
            return "";

        return getElement(o, prop.split('.'), dataset);
    };

    var getCheckboxProps = function(config, data) {

        var attrs = typeof config.attrs == 'function' ? config.attrs(data) : (config.attrs || {});
        var props = $.extend({}, attrs, {
            "type": "checkbox",
            "name": config.name || "check",
            "id": config.id || "check",
            "class": config.clazz || "ace ace-checkbox-2 searcher-checkbox"
        });

        if (config.field && config.prop)
            props[config.field] = getPropValue(data, config.prop, config.dataset);

        if (config.value)
            props.value = getPropValue(data, config.value, config.dataset);
        else if (config.prop)
            props.value = getPropValue(data, config.prop, config.dataset);

        return props;
    };

    var searcherApi = null;

    var getDefaultTitle = function(lineprop) {

        if (!lineprop || !lineprop.length) {
            return function() {
                return "详情";
            };
        }

        for (var i = 0; i < lineprop.length; i++) {

            var prop = lineprop[i];

            if (prop.type == "numbers" || prop.type == "checkbox")
                continue;

            if (prop.prop)
                return prop.prop;
        }

        return function() {
            return "详情";
        };
    };

    var getPreferName = function() {

        if (basicConf.preferName)
            return basicConf.preferName;

        if (basicConf.historyName)
            return basicConf.historyName;

        return window.location.pathname;
    };

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

    var renderViewSwitcher = function() {

        if (!basicConf.$pager || !basicConf.$pager.length)
            return false;

        com.focusPage('.searcher-view-switcher', basicConf.$pager).remove();

        return false;
    };

    var applyViewMode = function(mode, render) {

        if (!basicConf.viewEnable || !searcherApi || basicConf.viewModes.indexOf(mode) == -1)
            return false;

        basicConf.viewMode = mode;

        if (mode == "card") {
            searcherApi.card(basicConf.viewTitle, basicConf.lineprop, basicConf.linevent);
        } else if (mode == "table") {
            searcherApi.table(basicConf.lineprop, basicConf.linevent);
        } else {
            searcherApi.line(basicConf.viewTitle, basicConf.lineprop, basicConf.linevent);
        }

        basicConf.viewMode = mode;

        renderViewSwitcher();

        if (!render)
            return true;

        if (basicConf.lastData && basicConf.lastData.length) {
            basicConf.displayFunc(basicConf.lastData);
        } else {
            emptyData();
        }

        return true;
    };

    var switchView = function(mode) {

        if (basicConf.viewMode == mode)
            return false;

        if (!applyViewMode(mode, true))
            return false;

        saveUserPrefer(mode);
    };

    var loadUserPrefer = function(callback) {

        if (!basicConf.viewEnable || !basicConf.preferEnable) {
            callback && callback();
            return false;
        }

        var mode = getUserPrefer("searcher", "global", "viewMode") || getUserPrefer("searcher", getPreferName(), "viewMode");

        if (mode && basicConf.viewModes.indexOf(mode) != -1) {
            applyViewMode(mode, false);
        }

        callback && callback();
    };

    var saveUserPrefer = function(mode) {

        if (!basicConf.viewEnable || !basicConf.preferEnable)
            return false;

        setUserPrefer("searcher", getPreferName(), "viewMode", mode);

        if (!api.personel || !api.personel.updateUserPrefer)
            return false;

        try {
            com.post(api.personel.updateUserPrefer, {
                "userPrefer.module": "searcher",
                "userPrefer.page": getPreferName(),
                "userPrefer.pkey": "viewMode",
                "userPrefer.pvalue": mode
            });
        } catch (e) {
        }
    };

    searcherApi = {
        /**
         * 插件的初始化方法 params:
         *
         * @conditions: 查询条件编号的数组
         * @searcherId: 查询控件显示标签ID
         * @url: 分页查询路径
         * @displayFunc: 分页查询的回调函数(画列表)
         * @pagerId: 分页控件的标签id
         * @historyName: 保存历史查询条件的查询条件名
         * @params: 分页查询的其他查询参数{key:val}形式
         * @isPage: 不分页标识
         * @resultName: 响应结果数据名称
         * @buttons: 表格按钮
         * @resulterId: 查询结果显示标签ID
         *
         */
        init: function(conditions, searcherId, url, displayFunc, pagerId, historyName, params, isPage, resultName, buttons, resulterId) {

            basicConf.conditions = conditions;
            basicConf.$searcher = com.focusPage('#' + searcherId);
            basicConf.$pager = com.focusPage('#' + pagerId);
            basicConf.url = url;
            basicConf.historyName = historyName;
            basicConf.displayFunc = displayFunc;

            params && typeof params == "object" && (basicConf.params = params);
            isPage && (basicConf.isPage = isPage);

            basicConf.resultName = resultName;
            basicConf.$resulter = resulterId ? resulterId : "resultList";

            buttons && typeof buttons == "function" && (basicConf.buttons = buttons());

            !isPage && paging.init(); // 绑定上一页下一页事件

            searchCond.renderConds(); // 初始化查询条件

            searchByPresentParams();

            return this;
        },
        set: function(searcherId, pagerId, resulterId, url, params, conditions, historyName, resultName, isPage, buttons, displayFunc) {

            if (typeof searcherId == 'object') {
                basicConf = $.extend({}, basicConf, searcherId);
                return this;
            }

            basicConf.conditions = conditions;
            basicConf.$searcher = com.focusPage('#' + searcherId);
            basicConf.$pager = com.focusPage('#' + pagerId);
            basicConf.url = url;
            basicConf.historyName = historyName;
            basicConf.displayFunc = displayFunc;

            params && typeof params == "object" && (basicConf.params = params);
            isPage && (basicConf.isPage = isPage);

            basicConf.resultName = resultName;
            basicConf.$resulter = resulterId ? resulterId : "resultList";

            buttons && typeof buttons == "function" && (basicConf.buttons = buttons());

            return this;
        },
        base: function(searcherId, pagerId, resulterId, url) {

            basicConf.$searcher = com.focusPage('#' + searcherId);
            basicConf.$pager = com.focusPage('#' + pagerId);

            basicConf.$resulter = resulterId ? resulterId : "resultList";

            basicConf.url = url;

            return this;
        },

        condition: function(conditions) {

            basicConf.conditions = conditions;

            return this;
        },
        history: function(history) {

            basicConf.historyName = history;

            return this;
        },
        param: function(params) {

            basicConf.params = params;

            if (!params)
                return getParams();

            return this;
        },
        result: function(resultName) {

            if (resultName)
                basicConf.resultName = resultName;

            return this;
        },
        button: function(buttons) {

            buttons && typeof buttons == "function" && (basicConf.buttons = buttons());

            buttons && typeof $.isArray(buttons) && ($.each(buttons, function(i, b) {

                var $adda = $('<a></a>').addClass('btn btn-minier ' + b.clazz + ' pull-left').attr('id', b.id).attr("name", b.id).css("margin", "0px 3px");
                var $addi = $('<i></i>').addClass('bigger-110 ' + b.icon).appendTo($adda);
                var $addspan = $('<span ></span>').text(b.name).appendTo($adda);

                if (b.show && typeof b.show == 'function' && !b.show())
                    return true;

                basicConf.buttons.push($adda);
            }));

            return this;
        },

        line: function(title, lineprop, linevent) {

            basicConf.viewEnable = true;
            basicConf.defaultViewMode = basicConf.defaultViewMode || "line";
            basicConf.viewMode = basicConf.viewMode || "line";
            basicConf.viewTitle = title;
            basicConf.lineprop = lineprop;
            basicConf.linevent = linevent;

            basicConf.displayFunc = function(data) {

                var $tableWrap = com.focusPage('#' + basicConf.$resulter).html("");

                if (!data || data.length == 0) {
                    return this;
                }

                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);

                $.each(data, function(i, v) {

                    var _title = "";

                    if (typeof title == "string")
                        _title = getElement(v, title.split('.'));
                    else if (typeof title == "function")
                        _title = title(v);

                    var $liLine = $('<li></li>').addClass('item-orange clearfix').appendTo($ul);
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(_title)).appendTo($liLine);
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);

                    $.each(basicConf.lineprop, function(index, value) {

                        if (value.type == "newline") {
                            $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);
                            return true;
                        }

                        if (value.show && typeof value.show == 'function' && !value.show(v))
                            return true;

                        if (value.type == "checkbox") {

                            var props = getCheckboxProps(value, v);

                            var $label = $('<label></label>').prependTo($h3);
                            var $input = $('<input>').attr(props).appendTo($label);
                            var $span = $('<span></span>').addClass(value.lblClazz || 'lbl blue bigger-150').appendTo($label);

                            if (value.checked && typeof value.checked == 'function')
                                $input.prop("checked", value.checked(v));

                            if (value.click && typeof value.click == 'function')
                                $input.click(function() {
                                    value.click($(this), v);
                                });

                            if (value.change && typeof value.change == 'function')
                                $input.change(function() {
                                    value.change($(this), v);
                                });

                            return true;
                        }

                        if (value.type == "img") {
                            var $urldiv = $('<div style="border: 1px solid #ccc; float :left;"></div>').css({
                                "width": "75px",
                                "height": "75px",
                                "margin-right": "10px"
                            }).prependTo($liLine);
                            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
                            var url = com.showImg(img, getElement(v, value.prop.split('.')), 75, 75, '', null, 0);

                            return true;
                        }

                        if (value.type == "qrcode") {
                            var $imgDiv = $('<div style="border: 1px solid rgb(204, 204, 204); float: left; width: 75px; height: 75px; margin-right: 10px;"></div>');
                            $imgDiv.qrcode({
                                render: "canvas",
                                width: 75,
                                height: 75,
                                text: value.prop(v)
                            });

                            $liLine.prepend($imgDiv);

                            return true;
                        }

                        if (value.type == "custom" && value.render && typeof value.render == "function") {
                            value.render($liLine, v, $ulProperty, $h3);
                            return true;
                        }

                        if (value.type == "custom" && !value.prop)
                            return true;

                        var $liProperty = $('<li></li>').appendTo($ulProperty);

                        var info = "";

                        if (typeof value.prop == 'function')
                            info = value.prop(v);
                        else
                            info = getElement(v, value.prop.split('.'), value.dataset);

                        $('<strong></strong>').html(value.name + ": ").appendTo($liProperty);
                        $('<b></b>').html(info).addClass(value.clazz).appendTo($liProperty);

                        if (value.click && typeof value.click == "function") {
                            $liProperty.click(function() {

                                value.click($(this), v);
                            }).css("cursor", "pointer");
                        }
                    });

                    $.each(basicConf.linevent, function(index, button) {

                        if (button.show && !button.show(v))
                            return true;

                        if (button.type == "switch") {

                            var $btn = $('<div></div>').addClass('pull-right').appendTo($divBtnWrap);
                            var $switch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                                "type": "checkbox"
                            }).appendTo($btn);
                            var $span = $('<span></span>').addClass('lbl ' + button.clazz).appendTo($btn);

                            var check = $switch.prop("checked");

                            $switch.prop("checked", button.init && button.init(v));

                            $switch.switchBtn("status-lbl").on("click", function() {

                                var _check = $(this).prop("checked");
                                button.handle(v, _check);
                                (_check ? $switch.prop("checked") : $switch.removeAttr("checked"));
                            });
                        } else {
                            // 处理按钮名称：支持函数类型
                            var btnName = typeof button.name == 'function' ? button.name(v) : button.name;

                            // 如果按钮名称为null或undefined，不渲染该按钮
                            if (btnName == null || btnName == undefined) {
                                return true;
                            }

                            var btnClazz = typeof button.clazz == 'function' ? button.clazz(v) : button.clazz;

                            $('<a></a>').addClass('btn btn-minier ' + btnClazz).html(btnName).appendTo($divBtnWrap).click(function() {

                                button.handle(v, $(this));
                            });
                        }

                    });
                });
            }

            return this;
        },

        card: function(title, lineprop, linevent) {

            basicConf.viewEnable = true;
            basicConf.defaultViewMode = basicConf.defaultViewMode || "card";
            basicConf.viewMode = basicConf.viewMode || "card";
            basicConf.viewTitle = title;
            basicConf.lineprop = lineprop;
            basicConf.linevent = linevent;

            basicConf.displayFunc = function(data) {

                var $tableWrap = com.focusPage('#' + basicConf.$resulter).html("");

                if (!data || data.length == 0) {
                    return this;
                }

                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);

                $.each(data, function(i, v) {

                    var _title = "";

                    if (typeof title == "string")
                        _title = getElement(v, title.split('.'));
                    else if (typeof title == "function")
                        _title = title(v);

                    var $card = $('<div></div>').addClass("col-xs-12 col-md-3").appendTo($tableWrap);
                    var $widget = $('<div></div>').addClass("widget-box").appendTo($card);
                    var $header = $('<div></div>').addClass("widget-header header-color-blue").appendTo($widget);

                    var $title = $('<h4></h4>').append($("<span><span/>").text(_title)).appendTo($header);

                    var $body = $('<div></div>').addClass("widget-body").appendTo($widget);
                    var $main = $('<div></div>').addClass("widget-main").appendTo($body);
                    var $info = $('<div></div>').css("padding", "5px").appendTo($main);

                    var $btntools = $('<div></div>').addClass("action-buttons").css("padding", "1px 0").appendTo($main);

                    $.each(basicConf.lineprop, function(index, value) {

                        if (value.type == "checkbox") {

                            var props = getCheckboxProps(value, v);

                            var $label = $('<label></label>').prependTo($title);
                            var $input = $('<input>').attr(props).appendTo($label);
                            var $span = $('<span></span>').css({
                                "top": "-5px",
                                "left": "-5px"
                            }).addClass(value.lblClazz || 'lbl blue bigger-150').appendTo($label);

                            if (value.checked && typeof value.checked == 'function')
                                $input.prop("checked", value.checked(v));

                            if (value.click && typeof value.click == 'function')
                                $input.click(function() {
                                    value.click($(this), v);
                                });

                            if (value.change && typeof value.change == 'function')
                                $input.change(function() {
                                    value.change($(this), v);
                                });

                            return true;
                        }

                        if (value.type == "newline" || !value.prop)
                            return true;

                        if (value.show && typeof value.show == 'function' && !value.show(v))
                            return true;

                        var info = "";

                        if (typeof value.prop == 'function')
                            info = value.prop(v);
                        else
                            info = getElement(v, value.prop.split('.'), value.dataset);

                        $('<label></label>').attr('for', 'form-field').addClass(value.clazz).text(value.name + ": " + info).appendTo($('<div></div>').appendTo($info));
                    });

                    $.each(basicConf.linevent, function(index, button) {

                        if (button.show && !button.show(v))
                            return true;

                        if (button.type == "switch") {

                            var $btn = $('<div></div>').addClass('pull-right').appendTo($btntools);
                            var $switch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                                "type": "checkbox"
                            }).appendTo($btn);
                            var $span = $('<span></span>').addClass('lbl ' + button.clazz).appendTo($btn);

                            var check = $switch.prop("checked");

                            $switch.prop("checked", button.init && button.init(v));

                            $switch.switchBtn("status-lbl").on("click", function() {

                                var _check = $(this).prop("checked");
                                button.handle(v, _check);
                                (_check ? $switch.prop("checked") : $switch.removeAttr("checked"));
                            });
                        } else if (button.type == "newline") {
                            $btntools = $('<div></div>').addClass("action-buttons").css("padding", "1px 0").appendTo($main);
                        } else {
                            var btnName = typeof button.name == 'function' ? button.name(v) : button.name;

                            if (btnName == null || btnName == undefined) {
                                return true;
                            }

                            var btnClazz = typeof button.clazz == 'function' ? button.clazz(v) : button.clazz;

                            $('<a></a>').addClass('btn btn-minier ' + btnClazz).html(btnName).appendTo($btntools).click(function() {

                                button.handle(v, $(this));
                            });
                        }
                    });
                });
            }

            return this;
        },

        toble: function(lineprop, linevent) {

            basicConf.lineprop = lineprop;
            basicConf.linevent = linevent;

            basicConf.displayFunc = function(data) {

                var $tableWrap = com.focusPage('#' + basicConf.$resulter).html("");

                if (!data || data.length == 0) {
                    return this;
                }

                var $ulTitle = $('<ul></ul>').addClass('flex-table').appendTo($tableWrap);
                var $liTitle = $('<li></li>').addClass('line table-title').appendTo($ulTitle);

                var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>')).appendTo($liTitle);
                var $contentWrap = $('<div></div>').addClass('line-wrap content col' + basicConf.lineprop.length).appendTo($liTitle);

                $.each(basicConf.lineprop, function(i, v) {

                    $('<div></div>').addClass('cell').html(v.name).appendTo($contentWrap);
                });

                var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option')).appendTo($liTitle);

                $.each(data, function(i, v) {

                    var $liLine = $('<li></li>').addClass('line').appendTo($ulTitle);
                    var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1)).appendTo($liLine);
                    var $contentWrap = $('<div></div>').addClass('line-wrap content col' + basicConf.lineprop.length).appendTo($liLine);

                    $.each(basicConf.lineprop, function(index, value) {

                        $('<div></div>').addClass('cell ' + value.clazz).html(getElement(v, value.prop.split('.'), value.dataset)).appendTo($contentWrap);
                    });

                    var $optionGroup = $('<div></div>').addClass('line-wrap action').appendTo($liLine);
                    var $cellOption = $('<div></div>').addClass('cell option').appendTo($optionGroup);

                    var $btnGroup = $('<div></div>').addClass('btn-group').appendTo($cellOption);
                    var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>').appendTo($btnGroup);
                    var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass('bottom-up').appendTo($btnGroup);

                    $.each(basicConf.linevent, function(index, button) {

                        if (button.show && !button.show(v))
                            return true;

                        $('<li></li>').append($('<a></a>').html(button.name)).appendTo($btnUl).click(function() {

                            if (!button.handle)
                                return false;

                            button.handle(v);
                        });
                    });
                });
            }

            return this;
        },

        table: function(lineprop, linevent) {

            basicConf.viewEnable = true;
            basicConf.defaultViewMode = basicConf.defaultViewMode || "table";
            basicConf.viewMode = basicConf.viewMode || "table";
            basicConf.viewTitle = basicConf.viewTitle || getDefaultTitle(lineprop);
            basicConf.lineprop = lineprop;
            basicConf.linevent = linevent;

            basicConf.displayFunc = function(data) {

                var $tableWrap = com.focusPage('#' + basicConf.$resulter).html("");

                $('.searcher-table-more-menu').remove();

                var table = $("<table></table>").attr("lay-filter", basicConf.$resulter).appendTo($tableWrap);

                if (!data || data.length == 0) {
                    return this;
                }

                var rowLinevents = [];
                var maxLinevent = 0;

                var getTableCellText = function(lineprop, v) {

                    if (lineprop.show && typeof lineprop.show == 'function' && !lineprop.show(v))
                        return "";

                    if (lineprop.type == "checkbox")
                        return "";

                    var info = "";

                    if (typeof lineprop.prop == 'function')
                        info = lineprop.prop(v);
                    else
                        info = getElement(v, lineprop.prop.split('.'), lineprop.dataset);

                    return info == null || info == undefined ? "" : info;
                };

                var getTextLength = function(text) {

                    return String(text == null || text == undefined ? "" : text).replace(/[^\x00-\xff]/g, "aa").length;
                };

                var getTableWidth = function(lineprop, prop) {

                    if (prop.width)
                        return prop.width;

                    if (prop.type == "checkbox")
                        return 50;

                    var field = prop.field || "";
                    var maxLength = getTextLength(prop.name);
                    var minWidth = 80;
                    var maxWidth = 260;

                    if (/time|date/i.test(field)) {
                        minWidth = 140;
                        maxWidth = 180;
                    } else if (/no|orderid/i.test(field)) {
                        minWidth = 120;
                        maxWidth = 220;
                    } else if (/comment|content|remark|remake|info|desc/i.test(field)) {
                        maxWidth = 300;
                    }

                    $.each(data, function(i, row) {
                        maxLength = Math.max(maxLength, getTextLength(getTableCellText(lineprop, row)));
                    });

                    return Math.max(minWidth, Math.min(maxLength * 8 + 40, maxWidth));
                };

                var visibleLinevents = function(v) {

                    var linevents = [];

                    $.each(basicConf.linevent, function(k, button) {

                        if (button.type == "newline")
                            return true;

                        if (button.show && !button.show(v))
                            return true;

                        var btnName = typeof button.name == 'function' ? button.name(v) : button.name;

                        if (btnName == null || btnName == undefined)
                            return true;

                        linevents.push({
                            key: k,
                            button: button,
                            name: btnName
                        });
                    });

                    return linevents;
                };

                var renderLinevents = function($td, linevents, index) {

                    var directLinevents = linevents.slice(0, 2);
                    var moreLinevents = linevents.slice(2);

                    $.each(directLinevents, function(i, linevent) {

                        var data = basicConf.lastData && basicConf.lastData[index] ? basicConf.lastData[index] : null;
                        var btnClazz = typeof linevent.button.clazz == 'function' ? linevent.button.clazz(data) : linevent.button.clazz;

                        $('<a></a>').addClass('btn btn-minier ' + btnClazz + ' searcher-table-action').css('margin', '0px 1px').attr({
                            "href": "javascript:void(0);",
                            "data-index": index,
                            "data-event": linevent.key,
                            "data-resulter": basicConf.$resulter
                        }).html(linevent.name).appendTo($td);
                    });

                    if (!moreLinevents.length)
                        return false;

                    $('<a></a>').addClass('btn btn-minier btn-white searcher-table-more').css('margin', '0px 1px').attr({
                        "href": "javascript:void(0);",
                        "data-index": index,
                        "data-resulter": basicConf.$resulter
                    }).html('更多 <i class="icon-angle-down"></i>').appendTo($td);
                };

                $.each(data, function(i, v) {

                    rowLinevents[i] = visibleLinevents(v);
                    maxLinevent = Math.max(maxLinevent, rowLinevents[i].length);
                });

                var hasLinevent = maxLinevent > 0;
                var tableProps = [];

                $.each(basicConf.lineprop, function(i, v) {

                    if (v.type == "newline" || (!v.prop && v.type != "checkbox"))
                        return true;

                    var visible = true;

                    if (v.show && typeof v.show == 'function') {

                        visible = false;

                        $.each(data, function(j, row) {

                            if (v.show(row)) {
                                visible = true;

                                return false;
                            }
                        });
                    }

                    if (!visible)
                        return true;

                    var prop = $.extend({}, v);

                    if (!prop.field) {
                        prop.field = typeof prop.prop == 'string' ? prop.prop.replace(/[^A-Za-z0-9_]/g, '_') : "__searcherField" + i;
                    }

                    prop.width = getTableWidth(v, prop);

                    tableProps.push({
                        source: v,
                        prop: prop
                    });
                });

                // header handle
                var headerThead = $("<thead></thead>");
                var headerTr = $("<tr></tr>").appendTo(headerThead);

                $.each(tableProps, function(i, v) {

                    if (v.prop.toolbar)
                        v.prop.toolbar = "#" + basicConf.$resulter + "tools";
                    var headerTh = $('<th></th>').attr("lay-data", JSON.stringify(v.prop)).appendTo(headerTr);
                    var headerSpan = $('<span></span>').html(v.prop.name).appendTo(headerTh);
                });

                if (hasLinevent) {
                    var toolsTh = $('<th></th>').attr("lay-data", JSON.stringify({
                        field: "__searcherTools",
                        width: maxLinevent > 2 ? 180 : 140,
                        fixed: "right"
                    })).appendTo(headerTr);
                    $('<span></span>').html("功能").appendTo(toolsTh);
                }

                var dataTbody = $("<tbody></tbody>").appendTo(table);

                table.append(headerThead).append(dataTbody);

                // data line handle
                $.each(data, function(i, v) {

                    var $liLine = $('<tr></tr>').appendTo(dataTbody);

                    $.each(tableProps, function(i, d) {

                        var info = getTableCellText(d.source, v);
                        var clazz = typeof d.source.clazz == 'function' ? d.source.clazz(v) : d.source.clazz;
                        var $td = $('<td></td>').appendTo($liLine);

                        if (d.source.type == "checkbox") {
                            var props = getCheckboxProps(d.source, v);
                            var $label = $('<label></label>').appendTo($td);
                            var $input = $('<input>').attr(props).appendTo($label);
                            $('<span></span>').addClass(d.source.lblClazz || 'lbl blue bigger-150').appendTo($label);

                            if (d.source.checked && typeof d.source.checked == 'function')
                                $input.prop("checked", d.source.checked(v));

                            if (d.source.click && typeof d.source.click == 'function')
                                $input.click(function() {
                                    d.source.click($(this), v);
                                });

                            if (d.source.change && typeof d.source.change == 'function')
                                $input.change(function() {
                                    d.source.change($(this), v);
                                });

                            return true;
                        }

                        if (clazz) {
                            $('<span></span>').addClass(clazz).html(info).appendTo($td);
                        } else {
                            $td.html(info);
                        }
                    });

                    if (hasLinevent) {
                        var $tools = $('<td></td>').appendTo($liLine);

                        renderLinevents($tools, rowLinevents[i] || [], i);
                    }
                });

                laytable.init(basicConf.$resulter, {
                    cellMinWidth: 80,
                    limit: 30
                });

                var eventNamespace = '.searcherTable' + basicConf.$resulter.replace(/[^A-Za-z0-9]/g, '');
                var closeNamespace = '.searcherTableClose' + basicConf.$resulter.replace(/[^A-Za-z0-9]/g, '');

                $(document).off('click' + eventNamespace, '.searcher-table-more').on('click' + eventNamespace, '.searcher-table-more', function(e) {

                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).attr('data-resulter') != basicConf.$resulter)
                        return true;

                    $('.searcher-table-more-menu').remove();

                    var index = $(this).attr('data-index');
                    var linevents = (rowLinevents[index] || []).slice(2);

                    if (!linevents.length)
                        return false;

                    var offset = $(this).offset();
                    var $menu = $('<ul></ul>').addClass('dropdown-menu searcher-table-more-menu').css({
                        "display": "block",
                        "position": "absolute",
                        "top": offset.top + $(this).outerHeight(),
                        "left": offset.left,
                        "z-index": 9999
                    }).appendTo('body');

                    $.each(linevents, function(i, linevent) {

                        var $li = $('<li></li>').appendTo($menu);

                        $('<a></a>').addClass('searcher-table-action').attr({
                            "href": "javascript:void(0);",
                            "data-index": index,
                            "data-event": linevent.key,
                            "data-resulter": basicConf.$resulter
                        }).html(linevent.name).appendTo($li);
                    });

                    return false;
                });

                $(document).off('click' + eventNamespace, '.searcher-table-action').on('click' + eventNamespace, '.searcher-table-action', function(e) {

                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).attr('data-resulter') != basicConf.$resulter)
                        return true;

                    var index = $(this).attr('data-index');
                    var event = $(this).attr('data-event');
                    var linevent = basicConf.linevent[event];
                    var data = basicConf.lastData && basicConf.lastData[index] ? basicConf.lastData[index] : null;

                    $('.searcher-table-more-menu').remove();

                    if (!linevent || !linevent.handle || !data)
                        return false;

                    if (linevent.show && !linevent.show(data))
                        return false;

                    linevent.handle(data, $(this));

                    return false;
                });

                $(document).off('click' + closeNamespace).on('click' + closeNamespace, function(e) {

                    if ($(e.target).closest('.searcher-table-more-menu, .searcher-table-more').length)
                        return true;

                    $('.searcher-table-more-menu').remove();
                });
            }

            return this;
        },

        checks: function() {

            return com.focusPage('.searcher-checkbox:checked', "#" + basicConf.$resulter);
        },

        isPage: function(isPage) {

            basicConf.isPage = isPage;

            return this;
        },

        empty: function() {

            emptyData();

            return this;
        },

        render: function(callback) {

            basicConf.buttons && typeof basicConf.buttons == "function" && (basicConf.buttons = buttons());

            !basicConf.isPage && paging.init(); // 绑定上一页下一页事件

            if (basicConf.isPage) {
                basicConf.buttons && $.each(basicConf.buttons, function(i, v) {

                    v.appendTo(basicConf.$pager);
                });
            }

            renderViewSwitcher();

            searchCond.renderConds(); // 初始化查询条件

            setTimeout(function() {

                loadUserPrefer(function() {

                    renderViewSwitcher();

                    searchByPresentParams();

                    if (callback)
                        callback();
                });
            }, 500);

            return this;
        },
        /*
         * 根据当前条件查询分页信息
         */
        doSearch: function() {

            setTimeout(function() {

                searchByPresentParams()
            }, 500);
        }
    };

    return searcherApi;
};
