$(function() {

    com.focusPage('#fl-statement').statement("功能区", "品类规格");

    var functionAreaCategory = {

        postParam: {
            faid: params.data.functionArea.faid
        },

        current: {},
    };

    var categoryIds = com.focusPage("#categoryId");

    com.post(api.data.queryCategory, {}, function(res) {

        categoryIds.bindData(res.categorys, "cid", "name", "请选择品类");
    });

    // 添加品类:弹窗选择后保存
    com.focusPage("#saveCategoryBtn").on("click", function() {

        var cid = categoryIds.val();

        if (!cid) {
            com.showAlert(com.warning, "请选择品类");
            return false;
        }

        com.post(api.quotation.addFunctionAreaCategory, {
            "functionAreaCategory.faid": functionAreaCategory.postParam.faid,
            "functionAreaCategory.cid": cid
        }, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            com.focusPage("#categoryModal").modal("hide");
        });
    });

    com.focusPage("#categoryModal").on("hide.bs.modal", function() {

        categoryIds.val("");
    });

    var lineprops = [{
        field: "categoryName",
        name: "品类",
        prop: "categoryName",
        clazz: "grey"
    }, {
        field: "formatCount",
        name: "规格数",
        prop: function(v) {
            return v.formats ? v.formats.length : 0;
        },
        clazz: "blue"
    }];

    var linebtns = {
        format: {
            name: "规格维护",
            clazz: "btn-purple",
            handle: function(v) {

                openFormatModal(v);
            }
        },
        remove: {
            name: "移除",
            clazz: "btn-danger",
            handle: function(v) {

                com.showConfirm("移除品类将同时删除其下规格,是否确认?", function() {

                    com.post(api.quotation.deleteFunctionAreaCategory, {
                        "functionAreaCategory.fcid": v.fcid
                    }, function() {

                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                });
            }
        }
    };

    var searcher = new Searcher();

    searcher.set("categoryCondList", "categoryPagenation", "categoryResultList",
        api.quotation.queryFunctionAreaCategoryByFaid,
        {"functionAreaCategory.faid": functionAreaCategory.postParam.faid},
        [], null, "functionAreaCategorys", true, null);
    searcher.button([{id: "addCategory", name: "添加品类", clazz: "btn-success", icon: "icon-plus"}]);
    searcher.line("categoryName", lineprops, linebtns).render();

    // 添加品类按钮:打开弹窗并清空上次选择
    com.focusPage('a[name="addCategory"]', '#categoryPagenation').on('click', function() {

        categoryIds.val("");
        com.focusPage("#categoryModal").modal("show");
    });

    // 打开规格维护弹窗
    function openFormatModal(v) {

        functionAreaCategory.current = v;

        com.focusPage("#formatCategoryName").text(v.categoryName);

        initFormatList();

        com.focusPage("#formatModal").modal("show");
    }

    // 渲染弹窗内规格表格
    function initFormatList() {

        var $tbody = com.focusPage("#formatList").find("tbody").empty();
        var formats = functionAreaCategory.current.formats || [];

        if (formats.length == 0) {
            var $emptyTr = $('<tr></tr>').appendTo($tbody);
            $('<td></td>').attr("colspan", "4").css({"text-align": "center", "color": "#999", "padding": "14px 8px"}).text("暂无规格,可在下方添加").appendTo($emptyTr);
        }

        $.each(formats, function(i, f) {

            drawFormatRow($tbody, f);
        });

        drawFormatAddRow($tbody);
    }

    function cellInput(value, placeholder) {

        return $('<input type="text">').addClass("cell-input").attr("placeholder", placeholder).val(value == null ? '' : value);
    }

    // 已有规格行:行内编辑 + 保存/删除
    function drawFormatRow($tbody, f) {

        var $tr = $('<tr></tr>').attr("ffid", f.ffid).appendTo($tbody);

        var $formatInput = cellInput(f.format).appendTo($('<td></td>').appendTo($tr));
        var $companyInput = cellInput(f.company).appendTo($('<td></td>').appendTo($tr));
        var $commentInput = cellInput(f.comment).appendTo($('<td></td>').appendTo($tr));

        var $btnTd = $('<td></td>').appendTo($tr);

        $('<a></a>').addClass('btn btn-minier btn-yellow').text('保存').css("margin-right", "4px").appendTo($btnTd).on("click", function() {

            if (!$.trim($formatInput.val())) {
                com.showAlert(com.warning, "规格不能为空");
                return false;
            }

            com.post(api.quotation.updateFunctionAreaFormat, {
                "functionAreaFormat.ffid": f.ffid,
                "functionAreaFormat.format": $.trim($formatInput.val()),
                "functionAreaFormat.company": $.trim($companyInput.val()),
                "functionAreaFormat.comment": $.trim($commentInput.val())
            }, function() {

                com.showAlert(com.info, "操作成功");
            });
        });

        $('<a></a>').addClass('btn btn-minier btn-danger').text('删除').appendTo($btnTd).on("click", function() {

            com.post(api.quotation.deleteFunctionAreaFormat, {
                "functionAreaFormat.ffid": f.ffid
            }, function() {

                com.showAlert(com.info, "操作成功");
                refreshCurrentCategory();
            });
        });
    }

    // 新增规格行(表格底部)
    function drawFormatAddRow($tbody) {

        var $tr = $('<tr></tr>').addClass("add-row").appendTo($tbody);

        var $formatInput = cellInput("", "规格").appendTo($('<td></td>').appendTo($tr));
        var $companyInput = cellInput("", "公司").appendTo($('<td></td>').appendTo($tr));
        var $commentInput = cellInput("", "备注").appendTo($('<td></td>').appendTo($tr));

        var $btnTd = $('<td></td>').appendTo($tr);

        $('<a></a>').addClass('btn btn-minier btn-success').text('添加').appendTo($btnTd).on("click", function() {

            if (!$.trim($formatInput.val())) {
                com.showAlert(com.warning, "规格不能为空");
                return false;
            }

            com.post(api.quotation.addFunctionAreaFormat, {
                "functionAreaFormat.fcid": functionAreaCategory.current.fcid,
                "functionAreaFormat.format": $.trim($formatInput.val()),
                "functionAreaFormat.company": $.trim($companyInput.val()),
                "functionAreaFormat.comment": $.trim($commentInput.val())
            }, function() {

                com.showAlert(com.info, "操作成功");
                refreshCurrentCategory();
            });
        });
    }

    // 重查当前品类规格并同步列表规格数
    function refreshCurrentCategory() {

        com.post(api.quotation.queryFunctionAreaCategoryByFaid, {
            "functionAreaCategory.faid": functionAreaCategory.postParam.faid
        }, function(data) {

            $.each(data.functionAreaCategorys || [], function(i, c) {

                if (c.fcid == functionAreaCategory.current.fcid)
                    functionAreaCategory.current = c;
            });

            initFormatList();
            searcher.doSearch();
        });
    }
});
