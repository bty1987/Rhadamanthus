jQuery(function($) {

    var constructionFunctionManage = {
        cfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项"},
        typeOrder: [1, 2, 3, 4, 0],
        modals: {
            constructionFunctionModal: com.focusPage("#constructionFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveConstructionFunctionBtn"),
        },
        items: {
            name: com.focusPage("#conName"),
            key: com.focusPage("#conKey"),
            value: com.focusPage("#conValue"),
            type: com.focusPage("#conType"),
            subtype: com.focusPage("#conSubtype"),
            sort: com.focusPage("#conSort"),
            comment: com.focusPage("#conComment"),
        },
    };

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.construction.queryConstructionFunction, {
            "constructionFunction.type": ""
        }, function(res) {

            constructionFunctionManage.functions = res.constructionFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#conCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + constructionFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(constructionFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#conCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == constructionFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(constructionFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentDfids(done) {

        if (!constructionFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.queryConstructionFunctionRightByName, {
            "constructionFunctionRight.name": constructionFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.constructionFunctionRights || [], function(i, va) {
                set[va.constructionFunction.cfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentDfids(function(dfidSet) {

            var kw = com.focusPage("#conFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(constructionFunctionManage.functions, function(i, v) {

                if (dfidSet && !dfidSet[v.cfid]) return true;
                if (kw && ((v.name || "") + " " + (v.key || "") + " " + (v.value || "") + " " + (v.comment || "")).toLowerCase().indexOf(kw) == -1) return true;

                (groups[v.type] = groups[v.type] || []).push(v);
                total++;
            });

            renderGroups(groups, total);
            renderHint(total);
        });
    }

    function renderGroups(groups, total) {

        var $list = com.focusPage("#conItemList").html(null);

        $.each(constructionFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('con-section').text(constructionFunctionManage.typeNames[t] + " · " + rows.length));

            var $grid = $('<div></div>').addClass('con-grid clearfix');

            $.each(rows, function(j, v) {

                var kvText = v.key + (v.value ? " = " + v.value : "");

                var $cell = $('<div></div>').addClass('col-md-4 col-sm-6');
                var $card = $('<div></div>').addClass('con-card');

                var $head = $('<div></div>').addClass('clearfix');
                $head.append($('<span></span>').addClass('con-dfid').text(v.cfid));
                $head.append($('<span></span>').addClass('con-name').text(v.name).attr("title", v.name));

                var $ops = $('<span></span>').addClass('con-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $head.append($ops);

                $card.append($head);
                $card.append($('<div></div>').addClass('con-kv').text(kvText).attr("title", kvText));
                if (v.comment) $card.append($('<div></div>').addClass('con-cmt').text("// " + v.comment).attr("title", v.comment));

                $cell.append($card);
                $grid.append($cell);

                $ops.children().eq(0).on("click", function() {
                    openEdit(v);
                });
                $ops.children().eq(1).on("click", function() {
                    deleteFunction(v);
                });
            });

            $list.append($grid);
        });

        if (!total) $list.append($('<div class="text-muted" style="padding: 16px 8px;">当前视图暂无条目</div>'));
    }

    function renderHint(total) {

        var $hint = com.focusPage("#conViewHint");

        if (constructionFunctionManage.category) {
            $hint.text("「" + categoryName(constructionFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 编辑/删除/添加 ----------

    function openEdit(v) {

        constructionFunctionManage.cfid = v ? v.cfid : null;
        constructionFunctionManage.items.name.val(v ? v.name : "");
        constructionFunctionManage.items.key.val(v ? v.key : "");
        constructionFunctionManage.items.value.val(v ? v.value : "");
        constructionFunctionManage.items.type.val(v ? v.type : "");
        constructionFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        constructionFunctionManage.items.sort.val(v ? v.sort : "");
        constructionFunctionManage.items.comment.val(v ? v.comment : "");

        constructionFunctionManage.modals.constructionFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.construction.deleteConstructionFunction, {
            "constructionFunction.cfid": v.cfid
        }, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();
        });
    }

    function refresh() {

        loadFunctions(function() {

            renderSidebar();
            render();
        });
    }

    // ---------- 事件绑定 ----------

    com.focusPage("#conCategoryList").on("click", "li[data-key]", function() {

        constructionFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#conFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#conAddBtn").on("click", function() {

        openEdit(null);
    });

    constructionFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('constructionFunctionModal')) {
            return false;
        }

        var url = api.construction.addConstructionFunction;

        var option = {
            "constructionFunction.name": constructionFunctionManage.items.name.val().trim(),
            "constructionFunction.key": constructionFunctionManage.items.key.val().trim(),
            "constructionFunction.value": constructionFunctionManage.items.value.val().trim(),
            "constructionFunction.type": constructionFunctionManage.items.type.val(),
            "constructionFunction.subtype": constructionFunctionManage.items.subtype.val(),
            "constructionFunction.sort": constructionFunctionManage.items.sort.val(),
            "constructionFunction.comment": constructionFunctionManage.items.comment.val(),
        };

        if (constructionFunctionManage.cfid != null) {
            url = api.construction.updateConstructionFunction;
            option["constructionFunction.cfid"] = constructionFunctionManage.cfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();

            constructionFunctionManage.modals.constructionFunctionModal.modal("hide");
        });
    });

    constructionFunctionManage.modals.constructionFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(constructionFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.construction.queryConstructionFunction, {
        "constructionFunction.type": 0
    }, function(res) {

        constructionFunctionManage.categories = res.constructionFunctions || [];
        constructionFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
