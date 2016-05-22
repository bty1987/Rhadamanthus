$(function(){

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
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.itemName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["编号:", v.itemId, "grey"],
                ["类型:", v.quotationType, "grey"],
                ["分类:", v.quotationClassification, "grey"],
                ["大类:", v.quotationBigCategory, "grey"],

                ["小类:", v.quotationSmallCategory, "grey"],
                ["单位:", v.measurementUnit, "grey"],
                ["工种:", v.workType, "grey"],
                ["说明:", v.quotationItemDes, "grey"],
                ["单价:", v.unitPrice, "grey"],
                ["版本:", v.version, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                edit(v);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.autoId, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.villageId, 1,function(){$statusSwitch.prop("checked")}));
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

    var _condArr = ['itemName', 'quotationTypeId', 'quotationClassificationId', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'versionId'];

    Searcher.init( _condArr, "condList", api.quotation.pageQuotationItem, displayFunc, "resultList", "villagePostData");

    var quotationItem = {
        saveBtn: $("#saveBtn").on("click", saveData),
        cancelBtn: $("#cancelBtn"),
        modal: $("#quotationItemModal").on("shown.bs.modal",function(a) {
            com.clearValidator();
            com.clearValidator("#itemId", !0);
            0 == quotationItem.editFlg && (quotationItem.quotationItemItems.quotationType.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationClassification.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationBigCategory.get(0).selectedIndex = 0, quotationItem.quotationItemItems.quotationSmallCategory.get(0).selectedIndex = 0, quotationItem.quotationItemItems.workType.get(0).selectedIndex = 0, quotationItem.quotationItemItems.measurementUnit.get(0).selectedIndex = 0, quotationItem.quotationItemItems.version.get(0).selectedIndex = 0)
        }),
        quotationItemItems: {
            itemId: $("#itemId").on("blur", function () {
                $this = $(this);
                if ("" != $this.val()) {
                    var b = {
                        "quotationItem.itemId": $this.val(),
                        "quotationItem.versionId": $("#version").val()
                    };
                    com.post(api.quotation.queryQuotationItemByItemIdAVersionId, b,function (a) {
                            a.quotationItem && a.quotationItem.itemId ? (com.showTips($this, "\u8be5\u7248\u672c\u7684\u9879\u76ee\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationItem.repeatFlg = !0) : (com.clearValidator("#itemId", !0), quotationItem.repeatFlg = !1)
                    })
                }
            }),
            autoId: $("#autoId"),
            quotationType: $("#quotationType"),
            quotationClassification: $("#quotationClassification"),
            quotationBigCategory: $("#quotationBigCategory"),
            quotationSmallCategory: $("#quotationSmallCategory"),
            itemName: $("#itemName"),
            measurementUnit: $("#measurementUnit"),
            workType: $("#workType"),
            quotationItemDes: $("#quotationItemDes"),
            unitPrice: $("#unitPrice"),
            version: $("#version").on("change",function () {
                $this = $(this);
                if ("" != quotationItem.quotationItemItems.itemId.val()) {
                    var b = {
                        "quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
                        "quotationItem.versionId": $("#version").val()
                    };
                    com.post(api.quotation.queryQuotationItemByItemIdAVersionId, b, function (a) {
                        a.quotationItem && a.quotationItem.itemId ? (com.showTips(quotationItem.quotationItemItems.itemId, "\u8be5\u7248\u672c\u7684\u9879\u76ee\u7f16\u53f7\u5df2\u5b58\u5728", !0), quotationItem.repeatFlg = !0) : (com.clearValidator("#itemId", !0), quotationItem.repeatFlg = !1)
                    })
                }
            }),
        },
        data: {
            quotationTypeData: {},
            quotationClassificationData: {},
            quotationBigCategoryData: {},
            quotationSmallCategoryData: {},
            measurementUnitData: {},
            workTypeData: {},
            versionData: {}
        },
        editFlag: !1,
        repeatFlg: !1,
        validator: {
            region: {
                type: "v_itemId",
                regex: /^QI_\d{5}$/g,
                errorMsg: "\u8bf7\u4ee5QI_\u4f5c\u4e3a\u524d\u7f00 , \u4e4b\u540e\u4ee5\u4e94\u4e2a\u4f4d\u6570\u5b57\u7ec4\u6210(\u5982QI_00001)."
            }
        }
    };

    $.extend(com.validator, quotationItem.validator);


    com.post(api.quotation.queryQuotationType, {},function(a) {
        quotationItem.data.quotationTypeData = a.quotationTypes;
        $("#quotationType").bindData(quotationItem.data.quotationTypeData, "id", "name");
    });
    com.post(api.quotation.queryQuotationClassification, {}, function(a) {
        quotationItem.data.quotationClassificationData = a.quotationClassifications;
        $("#quotationClassification").bindData(quotationItem.data.quotationClassificationData, "id", "name");
    });
    com.post(api.quotation.queryQuotationBigCategory, {}, function(a) {
        quotationItem.data.quotationBigCategoryData = a.quotationBigCategorys;
        $("#quotationBigCategory").bindData(quotationItem.data.quotationBigCategoryData, "id", "name");
    });
    com.post(api.quotation.queryQuotationSmallCategory, {}, function(a) {
        quotationItem.data.quotationSmallCategoryData = a.quotationSmallCategorys;
        $("#quotationSmallCategory").bindData(quotationItem.data.quotationSmallCategoryData, "id", "name")
    });
    com.post(api.common.queryMeasurementUnit, {}, function(a) {
        quotationItem.data.measurementUnitData = a.measurementUnits;
        $("#measurementUnit").bindData(quotationItem.data.measurementUnitData, "id", "name")
    });
    com.post(api.common.queryWorkType, {}, function(a) {
        quotationItem.data.workTypeData = a.workTypes;
        $("#workType").bindData(quotationItem.data.workTypeData, "id", "name")
    });
    com.post(api.quotation.queryQuotationVersion, {}, function(a) {
        quotationItem.data.VersionData = a.quotationVersions;
        quotationItem.quotationItemItems.version.bindData(quotationItem.data.VersionData, "versionId", "versionName");
        $("#importVersion").bindData(quotationItem.data.VersionData, "versionId", "versionName");
    });

    //添加按钮
    $('a[name="add"]', '#pagenation').click(function () {
        quotationItem.editFlg = !1;
        com.cleanItems(quotationItem.quotationItemItems);
        quotationItem.quotationItemItems.itemId.prop("disabled", !1);
        quotationItem.quotationItemItems.version.prop("disabled", !1);
        quotationItem.modal.modal("show")
    });

    //编辑按钮
    function edit(b) {
        quotationItem.editFlg = !0;
        quotationItem.quotationItemItems.autoId.val(b.autoId);
        quotationItem.quotationItemItems.itemId.val(b.itemId);
        quotationItem.quotationItemItems.itemName.val(b.itemName);
        quotationItem.quotationItemItems.quotationType.val(b.quotationTypeId);
        quotationItem.quotationItemItems.quotationClassification.val(b.quotationClassificationId);
        quotationItem.quotationItemItems.quotationBigCategory.val(b.quotationBigCategoryId);
        quotationItem.quotationItemItems.quotationSmallCategory.val(b.quotationSmallCategoryId);
        quotationItem.quotationItemItems.workType.val(b.workTypeId);
        quotationItem.quotationItemItems.measurementUnit.val(b.measurementUnitId);
        quotationItem.quotationItemItems.quotationItemDes.val(b.quotationItemDes);
        quotationItem.quotationItemItems.unitPrice.val(b.unitPrice);
        quotationItem.quotationItemItems.version.val(b.versionId);
        quotationItem.quotationItemItems.itemId.prop("disabled", !0);
        quotationItem.quotationItemItems.version.prop("disabled", !0);
        quotationItem.modal.modal("show");
    }

    //保存
    function saveData() {
        if (!com.validate() && !quotationItem.repeatFlg) {
            var a, c = {
                "quotationItem.itemId": quotationItem.quotationItemItems.itemId.val(),
                "quotationItem.itemName": quotationItem.quotationItemItems.itemName.val(),
                "quotationItem.quotationTypeId": quotationItem.quotationItemItems.quotationType.val(),
                "quotationItem.quotationType": "",
                "quotationItem.quotationClassificationId": quotationItem.quotationItemItems.quotationClassification.val(),
                "quotationItem.quotationClassification": "",
                "quotationItem.quotationBigCategoryId": quotationItem.quotationItemItems.quotationBigCategory.val(),
                "quotationItem.quotationBigCategory": "",
                "quotationItem.quotationSmallCategoryId": quotationItem.quotationItemItems.quotationSmallCategory.val(),
                "quotationItem.quotationSmallCategory": "",
                "quotationItem.measurementUnitId": quotationItem.quotationItemItems.measurementUnit.val(),
                "quotationItem.measurementUnit": "",
                "quotationItem.workTypeId": quotationItem.quotationItemItems.workType.val(),
                "quotationItem.workType": "",
                "quotationItem.quotationItemDes": quotationItem.quotationItemItems.quotationItemDes.val(),
                "quotationItem.unitPrice": quotationItem.quotationItemItems.unitPrice.val()
            };
            quotationItem.editFlg ? (a = api.quotation.updateQuotationItem, c["quotationItem.versionId"] = quotationItem.quotationItemItems.version.val(), c["quotationItem.version"] = "", c["quotationItem.autoId"] = quotationItem.quotationItemItems.autoId.val()) : (c["quotationItem.versionId"] = quotationItem.quotationItemItems.version.val(), c["quotationItem.version"] = "", a = api.quotation.addQuotationItem);
            com.post(a, c, successCallback, failCallback);
            quotationItem.modal.modal("hide")
        }
    }

    //启用禁用功能
    function updateStatus(id, status, failcallBack) {
        com.post(api.quotation.updateQuotationItemForStatus, {
            "quotationItem.autoId": id,
            "village.status": status
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }

    function successCallback() {
        com.showAlert(com.info, "\u64cd\u4f5c\u6210\u529f");
        $('#condList button').click();
    };

    function failCallback() {}

});

