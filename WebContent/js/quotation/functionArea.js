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
            faId: com.focusPage("#faId"),
            functionAreaId: com.focusPage("#functionAreaId"),
            functionAreaName: com.focusPage("#functionAreaName"),
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
            btnDel: com.focusPage('#delBtn')
        },
	
        modals: {
            selectItemModal: com.focusPage("#selectItemModal")
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.functionAreaName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnAssign = $('<a></a>').addClass('btn btn-minier btn-warning').html('分配报价项');

            var propertyArr = [
                ["编号: ", v.functionAreaId, "grey"],
                ["报价版本: ", v.version, "grey"],
                ["类型: ", v.functionAreaType, "grey"],
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
                assignQuotationItemIndex(v.faId, v.versionId, v.functionAreaType);
            });

            $btnDel.click(function(){
                removeFunctionArea(v.faId);
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

    var _condArr = ['data-quotation-version'];

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
        
        functionArea.items.faId.val(0);
        
        functionArea.items.functionAreaId.css("display", "none");
        functionArea.items.versionId.removeAttr("disabled");

        functionArea.items.total.attr("disabled", "disabled").val(0);
        
        functionArea.modals.functionAreaModal.modal("show");
    });

    //功能区编辑按钮
    function editFunctionArea(v) {
        
        functionArea.items.faId.val(v.faId);
        functionArea.items.functionAreaId.val(v.functionAreaId);
        functionArea.items.functionAreaName.val(v.functionAreaName);
        functionArea.items.functionAreaOrder.val(v.functionAreaOrder);
        functionArea.items.functionAreaType.val(v.functionAreaType);
        functionArea.items.versionId.val(v.versionId);
        functionArea.items.type.val(v.type);
        
        if(v.type == 2){
            functionArea.items.total.val(v.total).removeAttr("disabled");
        } else {
            functionArea.items.total.attr("disabled", "disabled").val(0);
        }

        functionArea.items.functionAreaId.css("display", '').attr("disabled", "disabled");
        functionArea.items.versionId.attr("disabled", "disabled")
        
        functionArea.modals.functionAreaModal.modal("show");
    }
    
    //功能区保存按钮点击事件
    function saveFunctionArea() {
        
        if(com.validate("functionAreaModal")) return false;
        
        var functionAreaId = functionArea.items.functionAreaId.val();
        var versionId = functionArea.items.versionId.val();
        
        var url = api.quotation.addFunctionArea;
        var options = {
            "functionArea.functionAreaId": functionAreaId,
            "functionArea.functionAreaName": functionArea.items.functionAreaName.val(),
            "functionArea.functionAreaOrder": functionArea.items.functionAreaOrder.val(),
            "functionArea.functionAreaType": functionArea.items.functionAreaType.val(),
            "functionArea.versionId": versionId,
            "functionArea.type": functionArea.items.type.val(),
            "functionArea.total": functionArea.items.total.val()
        };
        
        if(functionArea.items.faId.val() != '0'){
            url = api.quotation.updateFunctionArea;
            options["functionArea.faId"] = functionArea.items.faId.val();
        }

        com.post(url, options, function(){
            com.showAlert(com.info, "操作成功");
            functionAreaSeacher.doSearch();
            functionArea.modals.functionAreaModal.modal("hide");
        });
    }
    
    //功能区删除事件
    function removeFunctionArea(faId) {
        com.showConfirm("是否确认删除", function() {
            com.post(api.quotation.deleteFunctionArea, {"functionArea.faId": faId}, function(){
                
                com.showAlert(com.info, "操作成功");
                
                functionAreaSeacher.doSearch();
            });
        });
    }
    
    //分配报价项
    function assignQuotationItemIndex(faId, versionId, functionAreaType) {
        
        com.focusPage("#selectFunctionAreaId").val(faId);
        com.focusPage("#selectVersionId").val(versionId);
        com.focusPage("#functionAreaList").addClass("hide");
        com.focusPage("#functionAreaQuotationItemList").removeClass("hide");
        
        quotationItem.postParam["quotationItem.versionId"] = versionId;
        
        functionAreaItem.postParam.functionAreaId = faId;
        functionAreaItem.postParam.functionAreaType = functionAreaType;
        functionAreaItem.postParam["functionAreaItem.functionArea.faId"] = faId;
        functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"] = functionAreaType;
        
        initFunctionAreaItemList();
    }
    
    //显示报价项信息列表
    function initFunctionAreaItemList() {

        //"faId 报价项编号 分类 大类 小类 名称 单位 工种 单价" itemList
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
                }).val(v.faiId);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.quotationItem.itemName);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["编号: ", v.quotationItem.itemId, "grey"],
                    ["分类: ", v.quotationItem.quotationClassification, "grey"],
                    ["大类: ", v.quotationItem.quotationBigCategory, "grey"],
                    ["小类: ", v.quotationItem.quotationSmallCategory, "grey"],
                    ["单位: ", v.quotationItem.measurementUnit, "grey"],
                    ["工种: ", v.quotationItem.workType, "grey"],
                    ["单价: ", v.quotationItem.unitPrice, "blue"],
                ];

                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
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

        var extraParams = {"quotationItem.versionId": quotationItem.postParam["quotationItem.versionId"]} ;

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
                }).val(v.qiId);
                var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.itemName);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var propertyArr = [
                    ["类型: ", v.quotationType, "grey"],
                    ["分类: ", v.quotationClassification, "grey"],
                    ["大类: ", v.quotationBigCategory, "grey"],
                    ["小类: ", v.quotationSmallCategory, "grey"],
                    ["单位: ", v.measurementUnit, "grey"],
                    ["工种: ", v.itemWorkType, "grey"],
                    ["单价: ", v.unitPrice, "blue"],
                    ["版本: ", v.version, "grey"],
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

        var condArr = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'data-worktype'];

        var quotationSeacher = new Searcher();

        quotationSeacher.init( condArr, "quoCondList", api.quotation.pageQuotationItemByVersionId, function(data){
            quoDisplayFunc.init('quoResultList', data);
        }, "quoPagenation", "quotationFuncAreaPostData", extraParams);
    }

    //添加按钮
    function addSelectItem() {

        var _params = {};

        var $historys = quotationItem.history;

        if ($historys.length == 0) {
            com.showAlert(com.warning, "请选择要添加的报价项");
            return false;
        }

        var faid = com.focusPage("#selectFunctionAreaId").val();

        $.each($historys, function(i, e){
            var functionAreaType = functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"];
            
            var quotationClassification = $(e).attr('data-quotationClassification');
            var qiid = $(this).val();

            _params["functionAreaItems[" + i + "].functionArea.faId"] = faid,
            _params["functionAreaItems[" + i + "].quotationItem.qiId"] = qiid,
            _params["functionAreaItems[" + i + "].quotationItem.quotationClassification"] = quotationClassification;
        });

        com.post(api.quotation.addFunctionAreaItem, _params, function(res){
            functionAreaItem.modals.selectItemModal.modal("hide");
            com.showAlert(com.info, "操作成功");
            initFunctionAreaItemList();
            quotationItem.history = [];
        });
    }
    
});
