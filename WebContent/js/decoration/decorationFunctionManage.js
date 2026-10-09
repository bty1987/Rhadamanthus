jQuery(function($) {

    var decorationFunctionManage = {
        dfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项", 5: "节点配置", 6: "状态项", 7: "公司项"},
        typeOrder: [1, 2, 3, 4, 5, 6, 7, 0],
        modals: {
            decorationFunctionModal: com.focusPage("#decorationFunctionModal"),
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

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.decoration.queryDecorationFunction, {
            "decorationFunction.type": ""
        }, function(res) {

            decorationFunctionManage.functions = res.decorationFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#dfmCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + decorationFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(decorationFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#dfmCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == decorationFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(decorationFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentDfids(done) {

        if (!decorationFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.queryDecorationFunctionRightByName, {
            "decorationFunctionRight.name": decorationFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.decorationFunctionRights || [], function(i, va) {
                set[va.decorationFunction.dfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentDfids(function(dfidSet) {

            var kw = com.focusPage("#dfmFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(decorationFunctionManage.functions, function(i, v) {

                if (dfidSet && !dfidSet[v.dfid]) return true;
                if (kw && ((v.name || "") + " " + (v.key || "") + " " + (v.value || "") + " " + (v.comment || "")).toLowerCase().indexOf(kw) == -1) return true;

                (groups[v.type] = groups[v.type] || []).push(v);
                total++;
            });

            renderGroups(groups, total);
            renderHint(total);
        });
    }

    function renderGroups(groups, total) {

        var $list = com.focusPage("#dfmItemList").html(null);

        $.each(decorationFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('dfm-section').text(decorationFunctionManage.typeNames[t] + " · " + rows.length));

            $.each(rows, function(j, v) {

                var $line = $('<div></div>').addClass('dfm-line clearfix');
                $line.append($('<span></span>').addClass('dfm-dfid').text(v.dfid));
                $line.append($('<span></span>').addClass('dfm-name').text(v.name));
                $line.append($('<span></span>').addClass('dfm-kv').text(v.key + (v.value ? " = " + v.value : "")));
                if (v.comment) $line.append($('<span></span>').addClass('dfm-cmt').text("// " + v.comment));

                var $ops = $('<span></span>').addClass('dfm-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $line.append($ops);
                $list.append($line);

                $ops.children().eq(0).on("click", function() {
                    openEdit(v);
                });
                $ops.children().eq(1).on("click", function() {
                    deleteFunction(v);
                });
            });
        });

        if (!total) $list.append($('<div class="text-muted" style="padding: 16px 8px;">当前视图暂无条目</div>'));
    }

    function renderHint(total) {

        var $hint = com.focusPage("#dfmViewHint");

        if (decorationFunctionManage.category) {
            $hint.text("「" + categoryName(decorationFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 编辑/删除/添加 ----------

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

    com.focusPage("#dfmCategoryList").on("click", "li[data-key]", function() {

        decorationFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#dfmFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#dfmAddBtn").on("click", function() {

        openEdit(null);
    });

    decorationFunctionManage.btns = {
        saveBtn: com.focusPage("#saveDecorationFunctionBtn"),
    };

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
            refresh();

            decorationFunctionManage.modals.decorationFunctionModal.modal("hide");
        });
    });

    decorationFunctionManage.modals.decorationFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(decorationFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.decoration.queryDecorationFunction, {
        "decorationFunction.type": 0
    }, function(res) {

        decorationFunctionManage.categories = res.decorationFunctions || [];
        decorationFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
