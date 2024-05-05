$(function() {

    com.focusPage('#fl-statement').statement("功能区", "报价项");

    var functionAreaItem = {
        btns: {
            btnAdd: com.focusPage('#addBtn'),
            btnDel: com.focusPage('#delBtn'),
            btnUpdate: com.focusPage("#btnUpdate")
        },

        modals: {
            selectItemModal: com.focusPage("#selectItemModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {
            formula: com.focusPage("#formula", "#updateModal"),
        },

        postParam: {
            faid: params.data.functionArea.faid,
            versionId: params.data.functionArea.version.no
        }
    };

    var quotationItem = {

        btns: {
            saveBtn: com.focusPage("#saveSelectItemBtn")
        },
        history: [],
        postParam: {}
    };

    functionAreaItem.btns.btnUpdate.on("click", update);

    functionAreaItem.btns.btnAdd.on("click", function() {

        functionAreaItem.modals.selectItemModal.modal("show");
        initQuotationItemList();
    });

    functionAreaItem.btns.btnDel.on("click", function() {

        var ids = {};
        var aitems = $('input[type="checkbox"][name="areaItems"]:checked');

        if (!aitems || aitems.length == 0)
            return false;

        aitems.each(function(i) {

            ids["ids[" + i + "]"] = $(this).val();
        });

        removeFunctionAreaItem(ids);
    });

    quotationItem.btns.saveBtn.on("click", addSelectItem);

    initFunctionAreaItemList();

    // 显示报价项信息列表
    function initFunctionAreaItemList() {

        var options = {
            "functionAreaItem.functionArea.faid": functionAreaItem.postParam.faid,
        }

        // "faid 报价项编号 分类 大类 小类 名称 单位 工种 单价" itemList
        com.post(api.quotation.queryFunctionAreaItemByFunctionAreaId, options, function(data) {

            var $tableWrap = com.focusPage('#itemList', "#functionAreaQuotationItemList");
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            $tableWrap.empty();

            if (!data.functionAreaItems || data.functionAreaItems.length == 0)
                return false;

            $.each(data.functionAreaItems, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');

                var $label = $('<label></label>');
                var $input = $('<input>').attr({
                    "type": "checkbox",
                    "name": "areaItems",
                    "class": "ace ace-checkbox-2",
                }).val(v.faiid);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.quotationItem.name);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                var $btnUpdate = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-yellow btn-minier').html('更新'))

                $divBtnWrap.append($btnUpdate).appendTo($h3);

                v.formula = v.formula != null ? v.formula : ""

                var propertyArr = [["编号: ", v.quotationItem.no, "grey"], ["分类: ", v.quotationItem.classification.name, "red"], ["大类: ", v.quotationItem.bigCategory.name, "red"], ["小类: ", v.quotationItem.smallCategory.name, "red"], ["单位: ", v.quotationItem.unit.name, "red"], ["工种: ", v.quotationItem.workType.name, "red"], ["单价: ", v.quotationItem.unitPrice, "blue"], ["公式: ", paramToFormula(v.formula), "blue"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $btnUpdate.click(function() {

                    functionAreaItem.faiid = v.faiid;

                    functionAreaItem.items.formula.val(paramToFormula(v.formula));

                    functionAreaItem.modals.updateModal.modal("show");
                });

                $label.append($input).append($span).appendTo($h3);
                $liLine.append($h3).append($ulProperty);

                $liLine.appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        });
    }

    // 删除报价项
    function removeFunctionAreaItem(options) {

        com.showConfirm("是否确认删除报价项", function() {

            com.post(api.quotation.deleteFunctionAreaItemByIds, options, function(res) {

                functionAreaItem.modals.selectItemModal.modal("hide");
                com.showAlert(com.info, "操作成功");
                initFunctionAreaItemList();
            });
        });
    }

    // 初始化报价项目的按条件分页查询弹层
    function initQuotationItemList() {

        var extraParams = {
            "quotationItem.version.no": functionAreaItem.postParam.versionId
        };

        var quoDisplayFunc = (function() {

            var renderList = function(tableId, listData) {

                var $tableWrap = com.focusPage('#' + tableId);
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (listData && listData.length) {
                    $.each(listData, function(i, v) {

                        creatLine(v).appendTo($ul);
                    });

                    $ul.appendTo($tableWrap);

                    if (quotationItem.history.length) {
                        $.each(quotationItem.history, function(i, val) {

                            var $input = com.focusPage("input[name='quotations'][value='" + $(val).val() + "']");
                            $input.length && ($input.prop('checked', true));
                        });
                    }
                }
            };

            var creatLine = function(v) {

                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').css({
                    "margin-bottom": 0
                });

                var $label = $('<label></label>');
                var $input = $('<input>').attr({
                    "type": "checkbox",
                    "name": "quotations",
                    "class": "ace ace-checkbox-2",
                    "data-quotationClassification": v.quotationClassification,
                    "data-itemName": v.itemName
                }).val(v.qiid);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [["类型: ", v.category.name, "red"], ["分类: ", v.classification.name, "red"], ["大类: ", v.bigCategory.name, "red"], ["小类: ", v.smallCategory.name, "red"], ["单位: ", v.unit.name, "red"], ["工种: ", v.workType.name, "red"], ["单价: ", v.unitPrice, "blue"], ["版本: ", v.version.name, "grey"], ];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $label.append($input).append($span).appendTo($h3);
                $liLine.append($h3).append($ulProperty);

                $input.change(function() {

                    if ($(this).is(':checked')) {
                        quotationItem.history.push($(this));
                    } else {
                        quotationItem.history = $.map(quotationItem.history, function(v) {

                            return v.val() == $(this).val() ? null : v;
                        });
                    }
                });

                return $liLine;
            };

            return {
                init: function(tableId, listData) {

                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId, listData);
                },
                drawLine: function(v) {

                    return creatLine(v);
                }
            };
        })();

        var condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];

        var quotationSeacher = new Searcher();

        quotationSeacher.init(condArr, "quoCondList", api.quotation.pageQuotationItemByVersionId, function(data) {

            quoDisplayFunc.init('quoResultList', data);
        }, "quoPagenation", "quotationFuncAreaPostData", extraParams);

        quotationSeacher.base("quoCondList", "quoPagenation", 'quoResultList', api.quotation.pageQuotationItemByVersionId);
    }

    // 添加按钮
    function addSelectItem() {

        var $historys = quotationItem.history;

        if ($historys.length == 0) {
            com.showAlert(com.warning, "请选择要添加的报价项");
            return false;
        }

        var faid = com.focusPage("#selectFunctionAreaId").val();

        var _params = {
            "functionArea.faid": functionAreaItem.postParam.faid
        };

        $.each($historys, function(i, e) {

            _params["functionAreaItems[" + i + "].quotationItem.qiid"] = $(this).val();
        });

        com.post(api.quotation.addFunctionAreaItem, _params, function(res) {

            functionAreaItem.modals.selectItemModal.modal("hide");
            com.showAlert(com.info, "操作成功");
            initFunctionAreaItemList();
            quotationItem.history = [];
        });
    }

    function update() {

        if (com.validate("updateModal"))
            return false;

        var formula = functionAreaItem.items.formula.val();

        if (formula.replace(/(\u5468\u957f|\u9762\u79ef|\u4e3e\u67b6|\u6d1e\u9762|\u53c2\u6570|\u7a97\u9762|\u53d8\u91cf|\u6881\u957f|\u6881\u9ad8)/g, "").replace(/[\+\-\*\/\(\)]/g, "").replace(/[0-9]/g, "") != "") {

            com.showAlert(com.warning, "公式存在无效参数");

            return false;
        }

        if (evals(formulaToParam(formula))) {

            com.showAlert(com.warning, "公式运算结果失败");

            return false;
        }

        var options = {
            "functionAreaItem.faiid": functionAreaItem.faiid,
            "functionAreaItem.formula": formulaToParam(formula),
        }

        com.post(api.quotation.updateFunctionAreaItem, options, function(res) {

            com.showAlert(com.info, "操作成功");

            initFunctionAreaItemList();

            functionAreaItem.modals.updateModal.modal("hide");
        });

    }

    function formulaToParam(formula) {

        return formula.replace(/\u5468\u957f/g, "{a}").replace(/\u9762\u79ef/g, "{b}").replace(/\u4e3e\u67b6/g, "{c}").replace(/\u6d1e\u9762/g, "{d}").replace(/\u7a97\u9762/g, "{f}").replace(/\u6881\u957f/g, "{h}").replace(/\u6881\u9ad8/g, "{i}").replace(/\u53c2\u6570/g, "{e}").replace(/\u53d8\u91cf/g, "{g}");
    }

    function paramToFormula(param) {

        return param.replace(/\{a\}/g, "\u5468\u957f").replace(/\{b\}/g, "\u9762\u79ef").replace(/\{c\}/g, "\u4e3e\u67b6").replace(/\{d\}/g, "\u6d1e\u9762").replace(/\{f\}/g, "\u7a97\u9762").replace(/\{h\}/g, "\u6881\u957f").replace(/\{i\}/g, "\u6881\u9ad8").replace(/\{e\}/g, "\u53c2\u6570").replace(/\{g\}/g, "\u53d8\u91cf");
    }

    function evals(formula) {

        formula = com.format(formula, {
            "a": 1,
            "b": 1,
            "c": 1,
            "d": 1,
            "e": 1,
            "f": 1,
            "g": 1,
            "h": 1,
            "i": 1,
        });

        var res = new Function("return function(){return " + formula + "}")()();

        return isNaN(res) || !Number.isFinite(res);
    }

});
