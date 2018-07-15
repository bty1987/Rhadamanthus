$(function(){
	
	$('#fl-statement').statement("子功能区", "报价项配置");

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
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
                ["编号:", v.functionAreaId, "blue"],
                ["报价版本:", v.version, "blue"],
                ["类型:", v.functionAreaType, "red"],
                ["排序:", v.functionAreaOrder, "blue"],
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
                editFunctionArea(v);
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
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var _condArr = ['versionId'];

    var functionAreaSeacher = new Searcher();
    functionAreaSeacher.init( _condArr, "condList", api.quotation.pageFunctionArea, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "functionAreaPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addFunctionArea').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    var functionArea = {
            saveBtn: $("#saveBtn").on("click", saveFunctionArea),
            cancellBtn: null,
            modal: $("#functionAreaModal").on("shown.bs.modal",function(a) {
                com.clearValidator();
                0 == functionArea.editFlg && (functionArea.functionAreaItems.functionAreaType.get(0).selectedIndex = 0)
            }),
            functionAreaItems: {
                faId: $("#faId"),
                functionAreaId: $("#functionAreaId").on("blur", function () {
                    $this = $(this);
                    "" != $this.val() && com.post(api.quotation.queryFunctionAreaByIdAVersionId, {
                        "functionArea.functionAreaId": $this.val(),
                        "functionArea.versionId": $("#versionId").val()
                    },function (a) {
                        a.functionArea && a.functionArea.functionAreaId ? (com.showTips($this, "该版本的功能区编号已存在", !0), functionArea.repeatFunctionIdFlg = !0) : (com.clearValidator("#functionAreaId", !0), functionArea.repeatFunctionIdFlg = !1)
                    })
                }),
                functionAreaName: $("#functionAreaName"),
                versionId: $("#versionId").on("change", function () {
                    $this = $(this);
                    "" != functionArea.functionAreaItems.functionAreaId.val() && com.post(api.quotation.queryFunctionAreaByIdAVersionId, {
                        "functionArea.functionAreaId": $("#functionAreaId").val(),
                        "functionArea.versionId": $("#versionId").val()
                    },function (b) {
                        b.functionArea && b.functionArea.functionAreaId ? (com.showTips($("#functionAreaId"), "该版本的功能区编号已存在", !0), functionArea.repeatFunctionIdFlg = !0) : (com.clearValidator("#functionAreaId", !0), functionArea.repeatFunctionIdFlg = !1)
                    })
                }),
                functionAreaType: $("#functionAreaType"),
                functionAreaOrder: $("#functionAreaOrder"),
                type : $("#type").on('change', function(){
                    if($(this).val() == 2)
                    $("#total").addClass('v_required').removeAttr('readonly');
                    else $("#total").removeClass('v_required').attr('readonly', true).val(null);
                }),
                total : $("#total"),
            },
            oldFunctionAreaType: null,
            quotationVersionList: [],
            quotationVersionKey: "versionId",
            quotationVersionValue: "versionName",
            postParam: {},
            validator: {
                region: {
                    type: "v_functionAreaId",
                    regex: /^D_\d{3}$/g,
                    errorMsg: "请以D_作为前缀 , 之后以三个位数字组成(如D_001)."
                }
            },
            editFlg: !1,
            repeatFunctionIdFlg: !1
        };

    var functionAreaItem = {
            btnBack: $("#btnBack").on("click", showFunctionAreaList),
            modal: $("#selectItemModal").on("show.bs.modal", function(a) {}),
            btnAdd : $('#addBtn').on('click',function(){
                functionAreaItem.modal.modal("show");
                initQuotationItemList();
            }),
            btnDel : $('#delBtn').on('click',function(){

                var ids = {};
                var aitems = $('input[type="checkbox"][name="areaItems"]:checked');

                aitems.length && (aitems.each(function(i){
                    ids["ids[" + i + "]"] = $(this).val()
                }),removeFunctionAreaItem(ids));

            }),
            listInitFlag: !1,
            postParam: {}
        };

    var quotationItem = {
            saveBtn: $("#saveSelectItemBtn").on("click", addSelectItem),
            cancelBtn: $("#cancelSelectItemBtn").on("click", function(a) {
                functionAreaItem.modal.modal("hide")
            }),
            modal: null,
            quotationItemItems: {},
            data: {
                quotationTypeData: {},
                quotationClassificationData: {},
                quotationBigCategoryData: {},
                quotationSmallCategoryData: {}
            },
            listInitFlag: !1,
            postParam: {}
        };

    $.extend(com.validator, functionArea.validator);

    com.post(api.ds.quotation, {}, function(res){
        $('#type').bindData(res.functionType, 'key', 'value');

    });


    //功能区添加按钮
    $('a[name="addFunctionArea"]', '#pagenation').on('click', function () {
        functionArea.editFlg = !1;
        com.cleanItems(functionArea.functionAreaItems);
        bindVersion();
        functionArea.functionAreaItems.functionAreaId.css("display", "none");
        functionArea.functionAreaItems.versionId.prop("disabled", !1);

        functionArea.functionAreaItems.type.find('option:eq(0)').attr('selected', true);
        functionArea.functionAreaItems.total.attr('disabled', true);
        functionArea.modal.modal("show")
    });

    //功能区编辑按钮
    function editFunctionArea(a) {
        functionArea.editFlg = !0;
        bindVersion(a.versionId);
        functionArea.functionAreaItems.faId.val(a.faId);
        functionArea.functionAreaItems.functionAreaId.val(a.functionAreaId);
        functionArea.functionAreaItems.functionAreaName.val(a.functionAreaName);
        functionArea.functionAreaItems.functionAreaOrder.val(a.functionAreaOrder);
        functionArea.functionAreaItems.functionAreaType.val(a.functionAreaType);
        functionArea.oldFunctionAreaType = a.functionAreaType;
        functionArea.functionAreaItems.versionId.val(a.versionId);

        functionArea.functionAreaItems.type.val(a.type);
        if(a.type ==2)functionArea.functionAreaItems.total.val(a.total).removeAttr('readonly').addClass('v_required');

        functionArea.functionAreaItems.functionAreaId.prop("disabled", !0).css("display", "block");
        functionArea.functionAreaItems.versionId.prop("disabled", !0), functionArea.modal.modal("show");
    }
    //功能区保存按钮点击事件
    function saveFunctionArea() {
        if (!com.validate("functionAreaModal") && !functionArea.repeatFunctionIdFlg) {
            var a, b = {
                "functionArea.functionAreaId": functionArea.functionAreaItems.functionAreaId.val(),
                "functionArea.functionAreaName": functionArea.functionAreaItems.functionAreaName.val(),
                "functionArea.functionAreaOrder": functionArea.functionAreaItems.functionAreaOrder.val(),
                "functionArea.functionAreaType": functionArea.functionAreaItems.functionAreaType.val(),
                "functionArea.versionId": functionArea.functionAreaItems.versionId.val(),
                "functionArea.type": functionArea.functionAreaItems.type.val(),
                "functionArea.total": functionArea.functionAreaItems.total.val() ? functionArea.functionAreaItems.total.val() : 0
            };
            functionArea.editFlg ? (
                a = api.quotation.updateFunctionArea,
                b["functionArea.faId"] = functionArea.functionAreaItems.faId.val(),
                functionArea.oldFunctionAreaType != functionArea.functionAreaItems.functionAreaType.val() ? bootbox.confirm("功能区的类型修改，会清空以前包含的报价项，确认修改吗？",function(c) {
                    c && (com.post(a, b, successFunctionAreaCallback), functionArea.modal.modal("hide"))
                }) : (com.post(a, b, successFunctionAreaCallback), functionArea.modal.modal("hide"))) : (a = api.quotation.addFunctionArea, com.post(a, b, successFunctionAreaCallback), functionArea.modal.modal("hide"))
        }
    }
    //功能区删除事件
    function removeFunctionArea(id) {

        bootbox.confirm("确认删除报价项吗？",function(flag) {

            var c = {"ids[0]" : id};

            flag && com.post(api.quotation.deleteFunctionArea, c, successFunctionAreaCallback);
        });
    }
    //分配报价项
    function assignQuotationItemIndex(a, b, c) {
        $("#selectFunctionAreaId").val(a);
        $("#selectVersionId").val(b);
        $("#functionAreaList").addClass("hide");
        $("#functionAreaQuotationItemList").removeClass("hide");
        quotationItem.postParam["quotationItem.versionId"] = b;
        functionAreaItem.postParam.functionAreaId = a;
        functionAreaItem.postParam.functionAreaType = c;
        functionAreaItem.postParam["functionAreaItem.functionArea.faId"] = a;
        functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"] = c;
        initFunctionAreaItemList();

    }
    //功能区弹窗向下拉列表绑定数据
    function bindVersion(a) {
        com.post(api.quotation.queryQuotationVersion, {}, function(b) {
            functionArea.quotationVersionList = b.quotationVersions;
            functionArea.functionAreaItems.versionId.bindData(functionArea.quotationVersionList, functionArea.quotationVersionKey, functionArea.quotationVersionValue);
            "undefined" == typeof a || null == a ? functionArea.functionAreaItems.versionId.get(0).selectedIndex = 0 : functionArea.functionAreaItems.versionId.val(a)
        })
    }
    //功能区弹窗保存成功回调函数
    function successFunctionAreaCallback() {
        com.showAlert(com.info, "操作成功");
        functionAreaSeacher.doSearch();
    }

    //显示报价项信息列表
    function initFunctionAreaItemList() {

        //"faId 报价项编号 分类 大类 小类 名称 单位 工种 单价" itemList
        com.post( api.quotation.queryFunctionAreaItemByFunctionAreaId, functionAreaItem.postParam, function(data){

            var $tableWrap = $('#itemList');
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            $tableWrap.empty();

            if(data.functionAreaItems && data.functionAreaItems.length){
                $.each(data.functionAreaItems,function(i, v){

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
                        ["报价项编号:", v.quotationItem.itemId, "grey"],
                        ["分类:", v.quotationItem.quotationClassification, "grey"],
                        ["大类:", v.quotationItem.quotationBigCategory, "grey"],
                        ["小类:", v.quotationItem.quotationSmallCategory, "grey"],
                        ["单位:", v.quotationItem.measurementUnit, "grey"],
                        ["工种:", v.quotationItem.workType, "grey"],
                        ["单价:", v.quotationItem.unitPrice, "grey"],
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.append($input).append($span).appendTo($h3);
//                    $h3.append($('<small></small>').addClass('blue').html(' ' + v.quotationItem.itemName));
                    $liLine.append($h3).append($ulProperty);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        })
    }
    //报价项信息列表返回按钮点击事件
    function showFunctionAreaList() {
        $("#functionAreaQuotationItemList").addClass("hide");
        $("#functionAreaList").removeClass("hide");
    }
    //删除报价项
    function removeFunctionAreaItem(c) {
        bootbox.confirm("确认删除报价项吗？",function(flag) {

            flag && com.post(api.quotation.deleteFunctionAreaItemByIds, c, successFunctionAreaItemCallback);
        })
    }

    function successFunctionAreaItemCallback() {
        functionAreaItem.modal.modal("hide");
        com.showAlert(com.info, "操作成功");
        initFunctionAreaItemList();
    }

    //初始化报价项目的按条件分页查询弹层
    function initQuotationItemList() {

        var extraParams  = {"quotationItem.versionId": quotationItem.postParam["quotationItem.versionId"]} ;

        var quoDisplayFunc  = (function(){

            var renderList = function(tableId,listData){
                var $tableWrap = $('#' + tableId);
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if(listData && listData.length){
                    $.each(listData,function(i, v){
                        var $liLine = creatLine(v);

                        $liLine.appendTo($ul);

                    });

                    $ul.appendTo($tableWrap);
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
                    ["类型:", v.quotationType, "grey"],
                    ["分类:", v.quotationClassification, "grey"],
                    ["大类:", v.quotationBigCategory, "grey"],
                    ["小类:", v.quotationSmallCategory, "grey"],
                    ["单位:", v.measurementUnit, "grey"],
                    ["工种:", v.itemWorkType, "grey"],
                    ["单价:", v.unitPrice, "grey"],
                    ["版本:", v.version, "grey"],
                ];

                $.each(propertyArr, function (index,value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $label.append($input).append($span).appendTo($h3);
//                $h3.append($('<small></small>').addClass('blue').html(' ' + v.itemName));
                $liLine.append($h3).append($ulProperty);

                return $liLine;
            };

            return {
                init : function(tableId,listData){
                    $('#' + tableId).html(null);
                    renderList(tableId,listData);
                },
                drawLine : function(v){
                    return creatLine(v);
                }
            }
        })();

        var condArr = ['itemName', 'quotationTypeId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId'];

        var quotationSeacher = new Searcher();

        quotationSeacher.init( condArr, "quoCondList", api.quotation.pageQuotationItemByVersionId, function(data){
            quoDisplayFunc.init('quoResultList', data);
        }, "quoPagenation", "quotationFuncAreaPostData", extraParams);

    }

    //添加按钮
    function addSelectItem() {

        var _params = {};
        var $quos = $('input[type="checkbox"][name="quotations"]:checked');

        $quos.length && ($quos.each(function(i){
            var functionAreaType = functionAreaItem.postParam["functionAreaItem.functionArea.functionAreaType"];
            var quotationClassification,itemName;
            quotationClassification = $(this).attr('data-quotationClassification');
            itemName = $(this).attr('data-itemName');
            _params["functionAreaItems[" + i + "].functionArea.faId"] = $("#selectFunctionAreaId").val(),
            _params["functionAreaItems[" + i + "].quotationItem.qiId"] = $(this).val(),
            _params["functionAreaItems[" + i + "].quotationItem.quotationClassification"] = quotationClassification;
        }), !jQuery.isEmptyObject(_params) && com.post(api.quotation.addFunctionAreaItem, _params, successFunctionAreaItemCallback));
    }
});
