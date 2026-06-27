$(function () {

    var lineprops = (function() {

        return [{
            field: "materialModelNo",
            name: "编号",
            prop: "materialModelNo",
            clazz: "grey"
        }, {
            field: "materialTypeName",
            name: "品类",
            prop: "materialTypeName",
            clazz: "grey"
        }, {
            field: "materialBrandName",
            name: "品牌",
            prop: "materialBrandName",
            clazz: "grey"
        }, {
            field: "measurementUnitName",
            name: "单位",
            prop: "measurementUnitName",
            clazz: "grey"
        }, {
            field: "materialPurchasePrice",
            name: "进价",
            prop: "materialPurchasePrice",
            clazz: "blue"
        }, {
            field: "materialUnitPrice",
            name: "标价",
            prop: "materialUnitPrice",
            clazz: "blue"
        }, {
            field: "discount",
            name: "折扣",
            prop: "discount",
            clazz: "blue"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 0 ? '启用' : '禁用'; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            delete: {
                name: "删除",
                clazz: "btn-success",
                handle: function(v) {
                    com.showConfirm("确定删除吗?", function () {
                        deleteMaterial(v.mmId);
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        return [$adda, $impa];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.material.pageMaterialModel, null, ['data-model-no', 'data-model-name', 'data-model-category', 'data-model-brand'], "materialModelPostData", null, false, buttons);
    searcher.line("materialModelName", lineprops, linebtns).render();

    var materialModel = {
        $nowLine: null,
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancelBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#materialModelModal").on("show.bs.modal", function (a) {
            com.clearValidator();
            com.clearValidator("#materialModelName", true);
            com.clearValidator("#materialModelNo", true);
        }),
        materialModelItems: {
            mmId: com.focusPage("#mmId"),
            materialModelNo: com.focusPage("#materialModelNo").on("blur", function () {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.material.queryMaterialModelByNo, {"materialModel.materialModelNo": $this.val()}, function (a) {
                    a.materialModel.mmId != null ? (com.showTips($this, "\u8be5\u578b\u53f7\u7f16\u53f7\u5df2\u5b58\u5728", !0), materialModel.repeatFlg = false) : (com.clearValidator("#materialModelNo", true), materialModel.repeatFlg = true);
                });
            }),
            materialModelName: com.focusPage("#materialModelName"),
            materialBrandId: com.focusPage("#materialBrandId"),
            measurementUnitId: com.focusPage("#measurementUnitId"),
            materialUnitPrice: com.focusPage("#materialUnitPrice"),
            materialPurchasePrice: com.focusPage("#materialPurchasePrice"),
            discount: com.focusPage("#discount")
        },
        data: {
            materialTypeData: {},
            materialBrandData: {},
            measurementUnitData: {}
        },
        editFlg: !1,
        repeatFlg: !1,
        validator: {
            materialBrandName: {
                type: "v_materialBrandName",
                regex: /^.{2,64}$/g,
                errorMsg: "主材型号名称格式错误."
            },
            point: {
                type: "v_point",
                regex: /^(1\.0{1,2}|1|0|0\.[0-9]{1,3})$/g,
                errorMsg: "点位内容输入错误."
            }
        }
    };

    $.extend(com.validator, materialModel.validator);

    com.post(api.data.queryCategory, {}, function (b) {
        materialModel.data.materialTypeData = b.categorys;
        com.focusPage("#materialTypeId").bindData(materialModel.data.materialTypeData, "cid", "name");
    });

    com.post(api.common.queryMeasurementUnit, {}, function (b) {
        materialModel.data.measurementUnitData = b.measurementUnits;
        com.focusPage("#measurementUnitId").bindData(materialModel.data.measurementUnitData, "id", "name");
    });

    com.post(api.right.queryBrandUserRightForLogin, {}, function (c) {

        var $brands = [];
        var brands = c.brandUserRight.brands;
        $.each(brands, function (i, v) {
            v.name = v.name + "-" + v.categoryName;
        });

        com.focusPage("#materialBrandId").bindData(c.brandUserRight.brands, "bid", "name");
    });

    //添加按钮
    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        materialModel.editFlg = !1;
        com.cleanItems(materialModel.materialModelItems);
        materialModel.materialModelItems.materialModelNo.removeAttr("disabled");

        materialModel.modal.modal("show");
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function () {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 500) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        var materialModelPostData = params.materialModelPostData;
        com.post(api.material.pageMaterialModel, $.extend({}, materialModelPostData, {"paging.noPage": 1}), function (res) {

            $.exceler({
                column: [
                    ["ID", "mmId"],
                    ["编号", "materialModelNo"],
                    ["名称", 'materialModelName'],
                    ['品类', 'materialTypeName'],
                    ['品牌', 'materialBrandName'],
                    ['单位', 'measurementUnitName'],
                    ['进价', 'materialPurchasePrice'],
                    ['标价', 'materialUnitPrice'],
                    ['折扣', 'discount'],
                    ['状态', 'status'],
                ],
                list: res.paging.data,
            });
        });
    });

    //保存
    function saveData() {
        
        if (com.validate("materialModelModal") || !materialModel.repeatFlg) return false;
        
        var _params = {
            "materialModel.mmId": materialModel.materialModelItems.mmId.val(),
            "materialModel.materialModelNo": materialModel.materialModelItems.materialModelNo.val(),
            "materialModel.materialModelName": materialModel.materialModelItems.materialModelName.val(),
            //"materialModel.materialTypeName": materialModel.materialModelItems.materialBrandId.find("option:selected").text().split('-')[1],
            "materialModel.materialBrandId": materialModel.materialModelItems.materialBrandId.val(),
            //"materialModel.materialBrandName": materialModel.materialModelItems.materialBrandId.find("option:selected").text().split('-')[0],
            "materialModel.measurementUnitId": materialModel.materialModelItems.measurementUnitId.val(),
            "materialModel.measurementUnitName": materialModel.materialModelItems.measurementUnitId.find("option:selected").text(),
            "materialModel.materialUnitPrice": materialModel.materialModelItems.materialUnitPrice.val(),
            "materialModel.materialPurchasePrice": materialModel.materialModelItems.materialPurchasePrice.val(),
            "materialModel.discount": materialModel.materialModelItems.discount.val(),
        };
        
        com.post(materialModel.editFlg ? api.material.updateMaterialModel : api.material.addMaterialModel, _params, function (a) {
            materialModel.modal.modal("hide");
            searcher.doSearch();
        });
    }

    //删除
    function deleteMaterial(mmid) {
        var c = {};

        c["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, c, function () {
            searcher.doSearch();
        });
    }

    //编辑按钮
    function editMaterial(c) {
        materialModel.editFlg = !0;

        materialModel.materialModelItems.mmId.val(c.mmId);
        materialModel.materialModelItems.materialModelNo.val(c.materialModelNo).attr("disabled", !0);
        materialModel.materialModelItems.materialModelName.val(c.materialModelName);
        materialModel.materialModelItems.measurementUnitId.val(c.measurementUnitId);
        materialModel.materialModelItems.materialUnitPrice.val(c.materialUnitPrice);
        materialModel.materialModelItems.materialPurchasePrice.val(c.materialPurchasePrice);
        materialModel.materialModelItems.discount.val(c.discount);

        materialModel.modal.modal("show");
    }

});
