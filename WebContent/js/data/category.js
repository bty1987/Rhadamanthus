jQuery(function($) {

    var category = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        type: {},
        isCoupon: {},
        isCount: {},
        repeatFlg: false,

        validator: {
            categoryId: {
                type: "v_categoryId",
                regex: /^C_\d{3}$/g,
                errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
            }
        },
        
        cid: null,
    };

    category.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    category.cancelBtn = com.focusPage("#cancelBtn");

    category.modal = com.focusPage("#categoryModal").on('show.bs.modal', function(e) {

        com.clearValidator();
        com.clearValidator("#no", true);
    });

    category.items.cId = com.focusPage("#cId");
    category.items.no = com.focusPage("#no");
    category.items.categoryName = com.focusPage("#categoryName");
    category.items.kino = com.focusPage("#kino");
    category.items.kiname = com.focusPage("#kiname");
    category.items.type = com.focusPage("#type");
    category.items.isCoupon = com.focusPage("#isCoupon");
    category.items.isCount = com.focusPage("#isCount");
    category.items.isLimit = com.focusPage("#isLimit");

    // com.post(api.ds.data, {}, function(res) {
    //
    // category.items.type.bindData(res.categoryType, "key", "value");
    // });

    category.items.type.bindData(constant.data.category.type.datas, 'key', 'value');
    category.items.isCoupon.bindData(constant.data.category.isCoupon.datas, 'key', 'value');
    category.items.isCount.bindData(constant.data.category.isCount.datas, 'key', 'value');
    category.items.isLimit.bindData(constant.data.category.isLimit.datas, 'key', 'value');

    $.extend(com.validator, category.validator);

    var lineprops = (function() {

        return [{
            field: "type",
            name: "类型",
            prop: function(v) { return constant.data().category.type.keys[v.type]; },
            clazz: "red"
        }, {
            field: "isCoupon",
            name: "券标识",
            prop: function(v) { return constant.data().category.isCoupon.keys[v.isCoupon]; },
            clazz: "red"
        }, {
            field: "isCount",
            name: "统计标识",
            prop: function(v) { return constant.data().category.isCount.keys[v.isCount]; },
            clazz: "red"
        }, {
            field: "isLimit",
            name: "选材控制",
            prop: function(v) { return constant.data().category.isLimit.keys[v.isLimit]; },
            clazz: "red"
        }, {
            field: "kino",
            name: "金蝶编号",
            prop: function(v) { return com.checkNull(v.kino, "无"); },
            clazz: "grey"
        }, {
            field: "kiname",
            name: "金蝶名称",
            prop: function(v) { return com.checkNull(v.kiname, "无"); },
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {name: "编辑", clazz: "btn-yellow", handle: function(v) { editCategory(v); }},
            format: {name: "规格", clazz: "btn-purple", handle: function(v) { openCategoryFormatModal(v); }}
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var _condArr = ["data-category-name", "data-category-isCoupon", "data-category-isCount"];
    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageCategory, null, _condArr, "categoryPostData", null, false, buttons);
    searcher.line(function(v) {

        return v.no + " " + v.name;
    }, lineprops, linebtns).render();

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        category.cid = null;

        com.cleanItems(category.items);

        category.items.no.css("display", "none");

        category.modal.modal("show");
    });

    function editCategory(v) {

        category.cid = v.cid;

        category.items.cId.val(v.cid);
        category.items.no.val(v.no).attr("disabled", "true").css("display", "block");
        category.items.categoryName.val(v.name);
        category.items.kino.val(v.kino);
        category.items.kiname.val(v.kiname);
        category.items.type.val(v.type);
        category.items.isCoupon.val(v.isCoupon);
        category.items.isCount.val(v.isCount);
        category.items.isLimit.val(v.isLimit);

        category.modal.modal("show");
    }

    function saveData() {

        if (com.validate("categoryModal") || category.repeatFlg) {
            return false;
        }

        var url = api.data.addCategory;
        var options = {
            'category.no': category.items.no.val(),
            'category.name': category.items.categoryName.val(),
            'category.kino': category.items.kino.val(),
            'category.kiname': category.items.kiname.val(),
            'category.type': category.items.type.val(),
            'category.isCoupon': category.items.isCoupon.val(),
            'category.isCount': category.items.isCount.val(),
            'category.isLimit': category.items.isLimit.val(),
        };

        if (category.cid) {
            url = api.data.updateCategory;
            options['category.cid'] = category.items.cId.val();
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            var no = res.category.no;

            if (category.cid)
                no = category.items.no.val();

            var categoryData = {
                "no": no,
                "name": category.items.categoryName.val(),
                "companyName": "方林集团"
            };

            kingdeeUtils.category(categoryData);
        });

        category.modal.modal("hide");
    }

    // ==================== 品类规格范围维护 ====================

    var categoryFormat = {
        current: {}
    };

    // 打开品类规格弹窗并加载列表
    function openCategoryFormatModal(v) {

        categoryFormat.current = v;

        com.focusPage("#categoryFormatName").text(v.name);

        com.post(api.data.queryCategoryFormatByCid, {
            "categoryFormat.cid": v.cid
        }, function(res) {

            drawCategoryFormatList(res.categoryFormats || []);
        });

        com.focusPage("#categoryFormatModal").modal("show");
    }

    function drawCategoryFormatList(formats) {

        var $tbody = com.focusPage("#categoryFormatList").find("tbody").empty();

        if (formats.length == 0) {
            var $emptyTr = $('<tr></tr>').appendTo($tbody);
            $('<td></td>').attr("colspan", "3").css({"text-align": "center", "color": "#999", "padding": "14px 8px"}).text("暂无规格,可在下方添加").appendTo($emptyTr);
        }

        $.each(formats, function(i, cf) {
            drawCategoryFormatRow($tbody, cf);
        });

        drawCategoryFormatAddRow($tbody);
    }

    function cellInput(value, placeholder) {

        return $('<input type="text">').addClass("cell-input").attr("placeholder", placeholder).val(value == null ? '' : value);
    }

    // 已有规格行:行内编辑 + 保存/删除
    function drawCategoryFormatRow($tbody, cf) {

        var $tr = $('<tr></tr>').appendTo($tbody);

        var $formatInput = cellInput(cf.format).appendTo($('<td></td>').appendTo($tr));
        var $commentInput = cellInput(cf.comment, "备注").appendTo($('<td></td>').appendTo($tr));

        var $btnTd = $('<td></td>').appendTo($tr);

        $('<a></a>').addClass('btn btn-minier btn-yellow').text('保存').css("margin-right", "4px").appendTo($btnTd).on("click", function() {

            if (!$.trim($formatInput.val())) {
                com.showAlert(com.warning, "规格不能为空");
                return false;
            }

            com.post(api.data.updateCategoryFormat, {
                "categoryFormat.cfid": cf.cfid,
                "categoryFormat.format": $.trim($formatInput.val()),
                "categoryFormat.comment": $.trim($commentInput.val())
            }, function() {

                com.showAlert(com.info, "操作成功");
            });
        });

        $('<a></a>').addClass('btn btn-minier btn-danger').text('删除').appendTo($btnTd).on("click", function() {

            com.post(api.data.deleteCategoryFormat, {
                "categoryFormat.cfid": cf.cfid
            }, function() {

                com.showAlert(com.info, "操作成功");
                refreshCategoryFormatList();
            });
        });
    }

    // 新增规格行(表格底部)
    function drawCategoryFormatAddRow($tbody) {

        var $tr = $('<tr></tr>').addClass("add-row").appendTo($tbody);

        var $formatInput = cellInput("", "规格").appendTo($('<td></td>').appendTo($tr));
        var $commentInput = cellInput("", "备注").appendTo($('<td></td>').appendTo($tr));

        var $btnTd = $('<td></td>').appendTo($tr);

        $('<a></a>').addClass('btn btn-minier btn-success').text('添加').appendTo($btnTd).on("click", function() {

            if (!$.trim($formatInput.val())) {
                com.showAlert(com.warning, "规格不能为空");
                return false;
            }

            com.post(api.data.addCategoryFormat, {
                "categoryFormat.cid": categoryFormat.current.cid,
                "categoryFormat.format": $.trim($formatInput.val()),
                "categoryFormat.comment": $.trim($commentInput.val())
            }, function() {

                com.showAlert(com.info, "操作成功");
                refreshCategoryFormatList();
            });
        });
    }

    function refreshCategoryFormatList() {

        com.post(api.data.queryCategoryFormatByCid, {
            "categoryFormat.cid": categoryFormat.current.cid
        }, function(res) {

            drawCategoryFormatList(res.categoryFormats || []);
        });
    }

});
