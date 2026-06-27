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
            field: "calcType",
            name: "计算方式",
            prop: function(v) { return "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : ""; },
            clazz: function(v) { return "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""; }
        }, {
            field: "calcValue",
            name: "计算值",
            prop: function(v) { return "1" == v.calcType ? v.point : "0" == v.calcType ? v.base : ""; },
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    editMaterial(v);
                }
            },
            advance: {
                name: "高级",
                clazz: "btn-success",
                handle: function(v) {
                    advanceMaterial(v);
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return !v.status;
                },
                handle: function(v, check) {
                    updateStatus(v.mmId, check ? 0 : 1, null);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        var $importa = $('<a></a>').addClass('btn btn-minier btn-warning pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $importi = $('<i></i>').addClass('icon-upload bigger-110').appendTo($importa);
        var $importspan = $('<span></span>').text('上传').appendTo($importa);

        return [$adda, $exporta, $importa];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.material.pageMaterialModelForAdvance, null, ['data-model-no', 'data-model-name', 'data-model-category', 'data-model-brand'], "materialModelAdvancePostData", null, false, buttons);
    searcher.line("materialModelName", lineprops, linebtns).render();

    var materialModel = {
        $nowLine: null,
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        saveAdvanceBtn: com.focusPage('#saveAdvanceBtn').on('click', advance),
        cancelBtn: com.focusPage("#cancelBtn"),
        modal: com.focusPage("#materialModelModal").on("show.bs.modal", function (a) {
            com.clearValidator();
            com.clearValidator("#materialModelName", !0);
            com.clearValidator("#materialModelNo", !0);
        }),
        advanceModal: com.focusPage('#advanceModelModal').on("show.bs.modal", function (a) {
            com.clearValidator();
        }),
        materialModelItems: {
            mmId: com.focusPage("#mmId"),
            materialModelNo: com.focusPage("#materialModelNo").on("blur", function () {
                $this = $(this);
                void 0 != $this.val() && "" != $this.val().trim() && com.post(api.material.queryMaterialModelByNo, {"materialModel.materialModelNo": $this.val()}, function (a) {
                    a.materialModel.mmId != null ? (com.showTips($this, "该型号编号已存在", true), materialModel.repeatFlg = false) : (com.clearValidator("#materialModelNo", true), materialModel.repeatFlg = true);
                });
            }),
            materialModelName: com.focusPage("#materialModelName"),
            materialTypeId: com.focusPage("#materialTypeId").change(function () {
                var b = materialModel.materialModelItems.materialTypeId.val();
                com.post(api.data.queryBrandByCid, {
                        "brand.cid": b
                    },
                    function (c) {
                        materialModel.data.materialBrandData[b] = c.brands;
                        com.focusPage("#materialBrandId").bindData(materialModel.data.materialBrandData[b + ""], "bid", "name");
                    });
            }),
            mmIda: com.focusPage("#mmIda"),
            materialModelNoa: com.focusPage('#materialModelNoa'),
            materialModelNamea: com.focusPage('#materialModelNamea'),
            materialBrandId: com.focusPage("#materialBrandId"),
            measurementUnitId: com.focusPage("#measurementUnitId"),
            materialUnitPrice: com.focusPage("#materialUnitPrice"),
            materialPurchasePrice: com.focusPage("#materialPurchasePrice"),
            discount: com.focusPage("#discount"),
            calcTypeSwitch: com.focusPage("#calcTypeSwitch").switchBtn("calcType").on("change", function () {
                materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? (materialModel.materialModelItems.pointDiv.css("display", "block"), materialModel.materialModelItems.baseDiv.css("display", "none")) : (materialModel.materialModelItems.pointDiv.css("display", "none"), materialModel.materialModelItems.baseDiv.css("display", "block"));
            }),
            calcType: com.focusPage("#calcType"),
            pointDiv: com.focusPage("#pointDiv"),
            point: com.focusPage("#point"),
            baseDiv: com.focusPage("#baseDiv"),
            base: com.focusPage("#base")
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

    // 添加按钮
    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        materialModel.editFlg = !1;

        com.cleanItems(materialModel.materialModelItems);

        materialModel.materialModelItems.materialModelNo.removeAttr("disabled");
        materialModel.materialModelItems.materialBrandId.html("");

        var b = materialModel.materialModelItems.materialTypeId.val();

        com.post(api.data.queryBrandByCid, {"brand.cid": b}, function (c) {
            materialModel.data.materialBrandData[b] = c.brands;
            com.focusPage("#materialBrandId").bindData(materialModel.data.materialBrandData[b + ""], "bid", "name");
        });

        materialModel.modal.modal("show");
    });

    com.focusPage('a[name="export"]', '#pagenation').click(function () {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 500) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        var materialModelAdvancePostData = params.materialModelAdvancePostData;
        com.post(api.material.pageMaterialModelForAdvance, $.extend({}, materialModelAdvancePostData, {"paging.noPage": 1}), function (res) {

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
                    ['计算方式', 'calcType'],
                    ['点位', 'point'],
                    ['底价', 'base'],
                ],
                list: res.paging.data,
            });
        });
    });

    com.focusPage('a[name="import"]', '#pagenation').click(function () {
        com.focusPage('#importModal').modal("show");
    });

    // 保存
    function saveData() {
        
        if(com.validate("materialModelModal") || !materialModel.editFlg) return false;

        var url = api.material.updateMaterialModel;
        
        if(materialModel.repeatFlg){
            url = api.material.addMaterialModel;
        }
        
        var params = {
            "materialModel.mmId": materialModel.materialModelItems.mmId.val(),
            "materialModel.materialModelNo": materialModel.materialModelItems.materialModelNo.val(),
            "materialModel.materialModelName": materialModel.materialModelItems.materialModelName.val(),
            "materialModel.materialBrandId": materialModel.materialModelItems.materialBrandId.val(),
            "materialModel.materialBrandName": materialModel.materialModelItems.materialBrandId.find("option:selected").text(),
            "materialModel.materialTypeName": materialModel.materialModelItems.materialTypeId.find("option:selected").text(),
            "materialModel.measurementUnitId": materialModel.materialModelItems.measurementUnitId.val(),
            "materialModel.measurementUnitName": materialModel.materialModelItems.measurementUnitId.find("option:selected").text(),
            "materialModel.materialUnitPrice": materialModel.materialModelItems.materialUnitPrice.val(),
            "materialModel.materialPurchasePrice": materialModel.materialModelItems.materialPurchasePrice.val(),
            "materialModel.discount": materialModel.materialModelItems.discount.val()
        };

        com.post(url, params, function (a) {
            materialModel.modal.modal("hide");
            searcher.doSearch();
        });

    }

    function advance() {

        if (com.validate("advanceModelModal")) return false;

        var options = {
            "materialModel.mmId": materialModel.materialModelItems.mmIda.val(),
            "materialModel.calcType": materialModel.materialModelItems.calcTypeSwitch.prop("checked") ? 1 : 0,
            "materialModel.point": "" == materialModel.materialModelItems.point.val() ? 0 : materialModel.materialModelItems.point.val(),
            "materialModel.base": "" == materialModel.materialModelItems.base.val() ? 0 : materialModel.materialModelItems.base.val()
        };

        com.post(api.material.updateMaterialModelForAdvance, options, function (res) {
            searcher.doSearch();
        });

        materialModel.advanceModal.modal("hide");
    }

    // 删除
    function deleteMaterial(mmid) {
        var c = {};

        c["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, c, function () {
            searcher.doSearch();
        });
    }

    // 编辑按钮
    function editMaterial(c) {
        materialModel.editFlg = !0;
        materialModel.materialModelItems.mmId.val(c.mmId);
        materialModel.materialModelItems.materialModelNo.val(c.materialModelNo).attr("disabled", !0);
        materialModel.materialModelItems.materialModelName.val(c.materialModelName);
        materialModel.materialModelItems.materialTypeId.val(c.materialTypeId);
        com.post(api.data.queryBrandByCid, {
                "brand.cid": c.materialTypeId
            },
            function (b) {
                materialModel.data.materialBrandData[c.materialTypeId] = b.brands;
                com.focusPage("#materialBrandId").bindData(materialModel.data.materialBrandData[c.materialTypeId + ""], "bid", "name");
                materialModel.materialModelItems.materialBrandId.val(c.materialBrandId);
            });
        materialModel.materialModelItems.measurementUnitId.val(c.measurementUnitId);
        materialModel.materialModelItems.materialUnitPrice.val(c.materialUnitPrice);
        materialModel.materialModelItems.materialPurchasePrice.val(c.materialPurchasePrice);
        materialModel.materialModelItems.discount.val(c.discount);

        materialModel.modal.modal("show");
    }

    function advanceMaterial(c) {

        materialModel.materialModelItems.mmIda.val(c.mmId);
        materialModel.materialModelItems.materialModelNoa.val(c.materialModelNo).attr("disabled", !0);
        materialModel.materialModelItems.materialModelNamea.val(c.materialModelName);
        materialModel.materialModelItems.base.val(c.base);
        materialModel.materialModelItems.point.val(c.point);

        if (c.calcType == 1) {
            materialModel.materialModelItems.calcTypeSwitch.prop("checked", !0);

            materialModel.materialModelItems.pointDiv.css("display", "block");
            materialModel.materialModelItems.baseDiv.css("display", "none");
        } else if (c.calcType == 0) {
            materialModel.materialModelItems.calcTypeSwitch.prop("checked", !1);

            materialModel.materialModelItems.pointDiv.css("display", "none");
            materialModel.materialModelItems.baseDiv.css("display", "block");
        }

        materialModel.advanceModal.modal("show");
    }

    // 启用禁用功能
    function updateStatus(mmid, status, failcallBack) {
        com.post(api.material.updateMaterialModelForStatus, {
            "materialModel.mmId": mmid,
            "materialModel.status": status
        }, function () {

        }, function () {
            failcallBack && failcallBack();
        });
    }
    
    com.uploadify("#import", "上传文件", api.material.importMaterialModule, 'btn btn-success col-sm-12', "*.xls;*.xlsx", {'uploadType': 4}, 1);

});
