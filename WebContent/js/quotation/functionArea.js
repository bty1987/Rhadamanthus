$(function(){
	
	com.focusPage('#fl-statement').statement("子功能区", "报价项配置");
	
	var functionArea = {
        
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },
        
        modals: {
            functionAreaModal: com.focusPage("#functionAreaModal"),
        },
        
        items: {
            faid: com.focusPage("#faid"),
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            versionId: com.focusPage("#versionId"),
            functionAreaType: com.focusPage("#functionAreaType"),
            functionAreaOrder: com.focusPage("#functionAreaOrder"),
            type: com.focusPage("#type"),
            total: com.focusPage("#total")
        },
        
        postParam: {},
    };
	
	var functionAreaItem = {
        btns: {
            btnBack: com.focusPage("#btnBack"),
            btnAdd: com.focusPage('#addBtn'),
            btnDel: com.focusPage('#delBtn'),
            btnUpdate: com.focusPage("#btnUpdate")
        },
	
        modals: {
            selectItemModal: com.focusPage("#selectItemModal"),
            updateModal: com.focusPage("#updateModal")
        },
        
        items:{
        	formula: com.focusPage("#formula", "#updateModal"),
        },
        
        postParam: {}
    };

    var quotationItem = {
            
        btns: {
            saveBtn: com.focusPage("#saveSelectItemBtn")
        },
        history: [],
        postParam: {}
    };
    
    functionAreaItem.btns.btnUpdate.on("click", update);
    
    $.extend(com.validator, functionArea.validator);
    
	com.post(api.ds.quotation, {}, function(res){
        functionArea.items.type.bindData(res.functionType, 'key', 'value');
    });
	
	com.post(api.quotation.queryQuotationVersion, {}, function(res) {
        functionArea.items.versionId.bindData(res.quotationVersions, "no", "name");
    });
	
	functionArea.modals.functionAreaModal.on("hide.bs.modal",function(a) {
	    
        com.clearValidator();
        com.cleanItems(functionArea.items);
    });
	
	functionArea.btns.saveBtn.on("click", saveFunctionArea);
	functionAreaItem.btns.btnBack.on("click", showFunctionAreaList);
	
	functionAreaItem.btns.btnAdd.on("click", function(){
	    functionAreaItem.modals.selectItemModal.modal("show");
        initQuotationItemList();
	});
	
	functionAreaItem.btns.btnDel.on("click", function(){
	    var ids = {};
        var aitems = $('input[type="checkbox"][name="areaItems"]:checked');
        
        if(!aitems || aitems.length == 0) return false;

        aitems.each(function(i){
            ids["ids[" + i + "]"] = $(this).val();
        });
        
        removeFunctionAreaItem(ids);
    });
	
	quotationItem.btns.saveBtn.on("click", addSelectItem);
	
	functionArea.items.type.on('change', function(){
	    
	    if($(this).val() == "2"){
	        functionArea.items.total.addClass('v_required').removeAttr('disabled');
	    }else{
	        functionArea.items.total.removeClass('v_required').attr('disabled', 'disabled').val(0);
	    }
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnAssign = $('<a></a>').addClass('btn btn-minier btn-warning').html('分配报价项');

            var propertyArr = [
                ["编号: ", v.no, "grey"],
                ["报价版本: ", v.version.no, "grey"],
                ["类型: ", v.functionAreaType, "red"],
                ["总价: ", v.total, "blue"],
                ["排序: ", v.functionAreaOrder, "blue"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).append($btnAssign).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                com.showConfirm("功能区的类型修改,会清空以前包含的报价项,是否确认修改?", function() {
                    editFunctionArea(v);
                });
            });

            $btnAssign.click(function(){
                assignQuotationItemIndex(v.faid, v.version.no, v.functionAreaType);
            });

            $btnDel.click(function(){
                removeFunctionArea(v.faid);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    var _condArr = ['data-quotation-functionArea-name','data-quotation-version'];

    var functionAreaSeacher = new Searcher();
    functionAreaSeacher.init( _condArr, "condList", api.quotation.pageFunctionArea, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "functionAreaPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addFunctionArea').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    //功能区添加按钮
    com.focusPage('a[name="addFunctionArea"]', '#pagenation').on('click', function () {
        
        functionArea.items.faid.val(0);
        
        functionArea.items.no.css("display", "none");
        functionArea.items.versionId.removeAttr("disabled");

        functionArea.items.total.attr("disabled", "disabled").val(0);
        
        functionArea.modals.functionAreaModal.modal("show");
    });

    //功能区编辑按钮
    function editFunctionArea(v) {
        
        functionArea.items.faid.val(v.faid);
        functionArea.items.no.val(v.no);
        functionArea.items.name.val(v.name);
        functionArea.items.functionAreaOrder.val(v.functionAreaOrder);
        functionArea.items.functionAreaType.val(v.functionAreaType);
        functionArea.items.versionId.val(v.version.no);
        functionArea.items.type.val(v.type);
        
        if(v.type == 2){
            functionArea.items.total.val(v.total).removeAttr("disabled");
        } else {
            functionArea.items.total.attr("disabled", "disabled").val(0);
        }

        functionArea.items.no.css("display", '').attr("disabled", "disabled");
        functionArea.items.versionId.attr("disabled", "disabled")
        
        functionArea.modals.functionAreaModal.modal("show");
    }
    
    //功能区保存按钮点击事件
    function saveFunctionArea() {
        
        if(com.validate("functionAreaModal")) return false;
        
        var versionId = functionArea.items.versionId.val();
        
        var url = api.quotation.addFunctionArea;
        var options = {
            "functionArea.no": functionArea.items.no.val(),
            "functionArea.name": functionArea.items.name.val(),
            "functionArea.functionAreaOrder": functionArea.items.functionAreaOrder.val(),
            "functionArea.functionAreaType": functionArea.items.functionAreaType.val(),
            "functionArea.version.no": versionId,
            "functionArea.type": functionArea.items.type.val(),
            "functionArea.total": functionArea.items.total.val()
        };
        
        if(functionArea.items.faid.val() != '0'){
            url = api.quotation.updateFunctionArea;
            options["functionArea.faid"] = functionArea.items.faid.val();
        }

        com.post(url, options, function(){
            com.showAlert(com.info, "操作成功");
            functionAreaSeacher.doSearch();
            functionArea.modals.functionAreaModal.modal("hide");
        });
    }
    
    //功能区删除事件
    function removeFunctionArea(faid) {
        com.showConfirm("是否确认删除", function() {
            com.post(api.quotation.deleteFunctionArea, {"functionArea.faid": faid}, function(){
                
                com.showAlert(com.info, "操作成功");
                
                functionAreaSeacher.doSearch();
            });
        });
    }
    
    //分配报价项
    function assignQuotationItemIndex(faid, versionId, functionAreaType) {
        
        com.focusPage("#selectFunctionAreaId").val(faid);
        com.focusPage("#selectVersionId").val(versionId);
        com.focusPage("#functionAreaList").addClass("hide");
        com.focusPage("#functionAreaQuotationItemList").removeClass("hide");
        
        quotationItem.postParam["quotationItem.versionId"] = versionId;
        
        functionAreaItem.postParam.functionAreaId = faid;
        functionAreaItem.postParam.functionAreaType = functionAreaType;
        functionAreaItem.postParam["functionAreaItem.functionArea.faid"] = faid;
        functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"] = functionAreaType;
        
        initFunctionAreaItemList();
    }
    
    //显示报价项信息列表
    function initFunctionAreaItemList() {

        //"faid 报价项编号 分类 大类 小类 名称 单位 工种 单价" itemList
        com.post(api.quotation.queryFunctionAreaItemByFunctionAreaId, functionAreaItem.postParam, function(data){

            var $tableWrap = com.focusPage('#itemList');
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            $tableWrap.empty();
            
            if(!data.functionAreaItems || data.functionAreaItems.length == 0) return false;
            
            $.each(data.functionAreaItems, function(i, v){

                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');

                var $label = $('<label></label>');
                var $input = $('<input>').attr({
                    "type" : "checkbox",
                    "name" : "areaItems",
                    "class" : "ace ace-checkbox-2",
                }).val(v.faiid);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.quotationItem.name);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
                
                var $btnUpdate = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-yellow btn-minier').html('更新'))
                
                $divBtnWrap.append($btnUpdate).appendTo($h3);
                
                v.formula = v.formula != null ? v.formula : ""

                var propertyArr = [
                    ["编号: ", v.quotationItem.no, "grey"],
                    ["分类: ", v.quotationItem.classification.name, "red"],
                    ["大类: ", v.quotationItem.bigCategory.name, "red"],
                    ["小类: ", v.quotationItem.smallCategory.name, "red"],
                    ["单位: ", v.quotationItem.unit.name, "red"],
                    ["工种: ", v.quotationItem.workType.name, "red"],
                    ["单价: ", v.quotationItem.unitPrice, "blue"],
                    ["公式: ", paramToFormula(v.formula) , "blue"]
                ];
                
                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $btnUpdate.click(function(){
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
    
    //报价项信息列表返回按钮点击事件
    function showFunctionAreaList() {
        com.focusPage("#functionAreaQuotationItemList").addClass("hide");
        com.focusPage("#functionAreaList").removeClass("hide");
    }
    
    //删除报价项
    function removeFunctionAreaItem(options) {
        com.showConfirm("是否确认删除报价项", function() {
            com.post(api.quotation.deleteFunctionAreaItemByIds, options, function(res){
                functionAreaItem.modals.selectItemModal.modal("hide");
                com.showAlert(com.info, "操作成功");
                initFunctionAreaItemList();
            });
        });
    }

    //初始化报价项目的按条件分页查询弹层
    function initQuotationItemList() {

        var extraParams = {"quotationItem.version.no": quotationItem.postParam["quotationItem.versionId"]} ;

        var quoDisplayFunc = (function(){

            var renderList = function(tableId,listData){
                var $tableWrap = com.focusPage('#' + tableId);
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if(listData && listData.length){
                    $.each(listData,function(i, v){
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

            var creatLine = function(v){
                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

                var $label = $('<label></label>');
                var $input = $('<input>').attr({
                    "type" : "checkbox",
                    "name" : "quotations",
                    "class" : "ace ace-checkbox-2",
                    "data-quotationClassification" : v.quotationClassification,
                    "data-itemName" : v.itemName
                }).val(v.qiid);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["类型: ", v.category.name, "red"],
                    ["分类: ", v.classification.name, "red"],
                    ["大类: ", v.bigCategory.name, "red"],
                    ["小类: ", v.smallCategory.name, "red"],
                    ["单位: ", v.unit.name, "red"],
                    ["工种: ", v.workType.name, "red"],
                    ["单价: ", v.unitPrice, "blue"],
                    ["版本: ", v.version.name, "grey"],
                ];

                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $label.append($input).append($span).appendTo($h3);
                $liLine.append($h3).append($ulProperty);

                $input.change(function () {
                    if ($(this).is(':checked')) {
                        quotationItem.history.push($(this));
                    } else {
                        quotationItem.history = $.map(quotationItem.history, function (v) {
                            return v.val() == $(this).val() ? null : v;
                        });
                    }
                });

                return $liLine;
            };

            return {
                init: function(tableId,listData){
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId,listData);
                },
                drawLine: function(v){
                    return creatLine(v);
                }
            };
        })();

        var condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];

        var quotationSeacher = new Searcher();

        quotationSeacher.init( condArr, "quoCondList", api.quotation.pageQuotationItemByVersionId, function(data){
            quoDisplayFunc.init('quoResultList', data);
        }, "quoPagenation", "quotationFuncAreaPostData", extraParams);
    }

    //添加按钮
    function addSelectItem() {

        var $historys = quotationItem.history;

        if ($historys.length == 0) {
            com.showAlert(com.warning, "请选择要添加的报价项");
            return false;
        }

        var faid = com.focusPage("#selectFunctionAreaId").val();
        
        var _params = {
                "functionArea.faid": faid
            };

        $.each($historys, function(i, e){
            var functionAreaType = functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"];
            
            var quotationClassification = $(e).attr('data-quotationClassification');
            var qiid = $(this).val();

            _params["functionAreaItems[" + i + "].quotationItem.qiid"] = qiid,
            _params["functionAreaItems[" + i + "].quotationItem.quotationClassification"] = quotationClassification;
        });

        com.post(api.quotation.addFunctionAreaItem, _params, function(res){
            functionAreaItem.modals.selectItemModal.modal("hide");
            com.showAlert(com.info, "操作成功");
            initFunctionAreaItemList();
            quotationItem.history = [];
        });
    }
    
    function update() {
    	
    	if(com.validate("updateModal")) return false;
    	
    	var formula = functionAreaItem.items.formula.val();
    	
    	if(formula.replace(/(\u5468\u957f|\u9762\u79ef|\u4e3e\u67b6|\u6d1e\u53e3|\u95e8\u53e3)/g, "").replace(/[\+\-\*\/\(\)]/g, "") != ""){
    		
    		com.showAlert(com.warning, "公式存在无效参数");
    		
    		return false;
    	}
    	
    	var options = {
    		"functionAreaItem.faiid": functionAreaItem.faiid,
    		"functionAreaItem.formula": formulaToParam(formula),
    	}
    	
    	com.post(api.quotation.updateFunctionAreaItem, options, function(res){
    		com.closePopup();
    		com.showAlert(com.info, "操作成功");
            initFunctionAreaItemList();
        });
    	
    	functionAreaItem.modals.updateModal.modal("hide");
    }
    
    function formulaToParam(formula){
        return formula.replace(/\u5468\u957f/g, "{a}").replace(/\u9762\u79ef/g, "{b}").replace(/\u4e3e\u67b6/g, "{c}").replace(/\u6d1e\u53e3/g, "{d}").replace(/\u95e8\u53e3/g, "{e}");
    }
    
    function paramToFormula(param){
        return param.replace(/\{a\}/g, "\u5468\u957f").replace(/\{b\}/g, "\u9762\u79ef").replace(/\{c\}/g, "\u4e3e\u67b6").replace(/\{d\}/g, "\u6d1e\u53e3").replace(/\{e\}/g, "\u95e8\u53e3");
    }
    
});
