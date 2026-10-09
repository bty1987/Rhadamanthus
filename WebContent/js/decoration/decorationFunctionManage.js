jQuery(function($) {

    var decorationFunctionManage = {
        dfid: null,
        category: null, // 当前分类变体key(null=全部)
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项", 5: "节点配置", 6: "状态项", 7: "公司项"},
        modals: {
            decorationFunctionModal: com.focusPage("#decorationFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveDecorationFunctionBtn"),
            cancelBtn: com.focusPage("#cancelDecorationFunctionBtn"),
        },
        items: {
            name: com.focusPage("#dfName"),
            key: com.focusPage("#dfKey"),
            value: com.focusPage("#dfValue"),
            type: com.focusPage("#dfType"),
            subtype: com.focusPage("#dfSubtype"),
            sort: com.focusPage("#dfSort"),
            comment: com.focusPage("#dfComment"),
        },
    };

    var searcher = new Searcher();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addDecorationFunction').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    searcher.set("decorationFunctionManageCondList", "decorationFunctionManagePagenation", "decorationFunctionManageResultList", api.decoration.pageDecorationFunction, null, ["decoration-decorationFunction-name", "decoration-decorationFunction-key", "decoration-decorationFunction-type", "decoration-decorationFunction-subtype"], "decorationFunctionManagePostData", null, false, buttons);

    var lineprops = [{
        field: "dfid",
        name: "编号",
        prop: "dfid",
        clazz: "grey"
    }, {
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "blue"
    }, {
        field: "key",
        name: "键",
        prop: "key",
        clazz: "grey"
    }, {
        field: "value",
        name: "值",
        prop: "value",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red"
    }, {
        field: "subtype",
        name: "子类型",
        prop: "subtype",
        clazz: "red"
    }, {
        field: "sort",
        name: "排序",
        prop: "sort",
        clazz: "grey"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            openEdit(v);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            deleteFunction(v);
        }
    }];

    searcher.table(lineprops, linebtns).render();

    // ---------- 编辑/删除(全部视图与分类视图共用) ----------

    function openEdit(v) {

        decorationFunctionManage.dfid = v ? v.dfid : null;
        decorationFunctionManage.items.name.val(v ? v.name : "");
        decorationFunctionManage.items.key.val(v ? v.key : "");
        decorationFunctionManage.items.value.val(v ? v.value : "");
        decorationFunctionManage.items.type.val(v ? v.type : "");
        decorationFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        decorationFunctionManage.items.sort.val(v ? v.sort : "");
        decorationFunctionManage.items.comment.val(v ? v.comment : "");

        decorationFunctionManage.modals.decorationFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.decoration.deleteDecorationFunction, {
            "decorationFunction.dfid": v.dfid
        }, function(e) {

            com.showAlert(com.info, "操作成功");
            refreshCurrent();
        });
    }

    function refreshCurrent() {

        if (decorationFunctionManage.category == null) {
            searcher.doSearch();
        } else {
            loadCategory();
        }
    }

    com.focusPage('a[name="addDecorationFunction"]', '#decorationFunctionManagePagenation').on("click", function() {

        openEdit(null);
    });

    decorationFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('decorationFunctionModal')) {
            return false;
        }

        var url = api.decoration.addDecorationFunction;

        var option = {
            "decorationFunction.name": decorationFunctionManage.items.name.val().trim(),
            "decorationFunction.key": decorationFunctionManage.items.key.val().trim(),
            "decorationFunction.value": decorationFunctionManage.items.value.val().trim(),
            "decorationFunction.type": decorationFunctionManage.items.type.val(),
            "decorationFunction.subtype": decorationFunctionManage.items.subtype.val(),
            "decorationFunction.sort": decorationFunctionManage.items.sort.val(),
            "decorationFunction.comment": decorationFunctionManage.items.comment.val(),
        };

        if (decorationFunctionManage.dfid != null) {
            url = api.decoration.updateDecorationFunction;
            option["decorationFunction.dfid"] = decorationFunctionManage.dfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refreshCurrent();

            decorationFunctionManage.modals.decorationFunctionModal.modal("hide");
        });
    });

    decorationFunctionManage.modals.decorationFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(decorationFunctionManage.items);
    });

    // ---------- 分类视图(type=0页面变体: 设计/业务/通用..., 条目经decorationfunctionright按name挂接) ----------

    var $categoryBar = com.focusPage("#dfmCategoryBar");
    var $categoryPanel = com.focusPage("#dfmCategoryPanel");

    com.post(api.decoration.queryDecorationFunction, {
        "decorationFunction.type": 0
    }, function(res) {

        decorationFunctionManage.categories = res.decorationFunctions || [];
        decorationFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        drawCategoryBar();
    });

    function drawCategoryBar() {

        $categoryBar.empty();

        var $all = $('<button type="button" class="btn btn-minier ' + (decorationFunctionManage.category == null ? "btn-info" : "btn-yellow") + '" style="margin: 0 3px 4px 0;"></button>').text("全部");
        $all.on("click", function() {
            switchMode(null);
        });
        $categoryBar.append($all);

        $.each(decorationFunctionManage.categories, function(i, v) {

            var $btn = $('<button type="button" class="btn btn-minier ' + (decorationFunctionManage.category == v.key ? "btn-info" : "btn-yellow") + '" style="margin: 0 3px 4px 0;" title="' + v.key + '"></button>').text(v.name);
            $btn.on("click", function() {
                switchMode(v.key);
            });
            $categoryBar.append($btn);
        });
    }

    function switchMode(key) {

        decorationFunctionManage.category = key;
        drawCategoryBar();

        var $cond = com.focusPage("#decorationFunctionManageCondList");
        var $result = com.focusPage("#decorationFunctionManageResultList");
        var $pager = com.focusPage("#decorationFunctionManagePagenation");

        if (key == null) {

            $categoryPanel.hide();
            $cond.show();
            $result.show();
            $pager.show();
        } else {

            $cond.hide();
            $result.hide();
            $pager.hide();
            $categoryPanel.show();
            loadCategory();
        }
    }

    function loadCategory() {

        com.post(api.right.queryDecorationFunctionRightByName, {
            "decorationFunctionRight.name": decorationFunctionManage.category
        }, function(res) {

            var dfids = {};

            $.each(res.decorationFunctionRights || [], function(i, va) {
                dfids[va.decorationFunction.dfid] = true;
            });

            com.post(api.decoration.queryDecorationFunction, {
                "decorationFunction.type": ""
            }, function(r2) {

                renderCategory(dfids, r2.decorationFunctions || []);
            });
        });
    }

    function renderCategory(dfids, functions) {

        var $list = com.focusPage("#dfmCategoryResultList").html(null);
        var groups = {};

        $.each(functions, function(i, v) {

            if (dfids[v.dfid]) (groups[v.type] = groups[v.type] || []).push(v);
        });

        $.each([1, 2, 3, 4, 5, 6, 7, 0], function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('blue').css("margin", "10px 0 4px 2px").text(decorationFunctionManage.typeNames[t] + " (" + rows.length + ")"));

            $.each(rows, function(j, v) {

                var $li = $('<li></li>').addClass('item-orange clearfix').css("padding", "4px 8px");
                var $h3 = $('<h3></h3>').addClass('oid');
                $h3.append($('<small></small>').addClass('blue').text(v.name + " [dfid:" + v.dfid + "]"));
                $h3.append($('<span></span>').css({"margin-left": "8px", "color": "#666", "font-size": "12px"}).text(v.key + (v.value ? " = " + v.value : "") + (v.comment ? "  // " + v.comment : "")));

                var $wrap = $('<div></div>').addClass('pull-right action-buttons');
                var $edit = $('<a class="btn btn-minier btn-yellow">编辑</a>');
                var $del = $('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>');
                $wrap.append($edit).append($del).appendTo($h3);

                $li.append($h3).appendTo($list);

                $edit.on("click", function() {
                    openEdit(v);
                });
                $del.on("click", function() {
                    deleteFunction(v);
                });
            });
        });

        if (!$list.children().length) {
            $list.append($('<div class="text-muted" style="padding: 12px;">该分类暂无绑定条目</div>'));
        }
    }

    com.focusPage("#dfmCategoryAddBtn").on("click", function() {

        openEdit(null);
    });

});
