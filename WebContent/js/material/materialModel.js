$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.materialModelName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [
                ["编号:", v.materialModelNo, "grey"],
                ["品类:", v.materialTypeName, "grey"],
                ["品牌:", v.materialBrandName, "grey"],
                ["单位:", v.measurementUnitName, "grey"],
                ["进价:", v.materialPurchasePrice, "blue"],
                ["标价:", v.materialUnitPrice, "blue"],
                ["折扣:", v.discount, "blue"],
                ["状态:", v.status == 0 ? '启用' : '禁用', v.status == 0 ? 'red' : "red"],
//                ["计算方式:", "1" == v.calcType ? "点位" : "0" == v.calcType ? "底价" : "", "1" == v.calcType ? "label label-success arrowed" : "0" == v.calcType ? "label label-danger arrowed" : ""],
//                ["计算值:", "1" == v.calcType ? v.point: "0" == v.calcType ? v.base : "", "blue"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDelete).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                materialModel.$nowLine = $liLine;
                editMaterial(v);
            });

            $btnDelete.click(function () {
                com.showConfirm("确定删除吗?", function () {
                    deleteMaterial(v.mmId);
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var _condArr = ['data-model-no', 'data-model-name', 'data-model-category', 'data-model-brand'];

    var searcher = new Searcher();

    searcher.init(_condArr, "condList", api.material.pageMaterialModel, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "materialModelPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
        var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
        var $impspan = $('<span></span>').text('导出').appendTo($impa);

        return [$adda, $impa];
    });

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
        if (!com.validate() && materialModel.repeatFlg) {
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
