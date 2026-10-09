jQuery(function($) {

    var quotationFunctionManage = {
        qfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项"},
        typeOrder: [1, 2, 3, 4, 0],
        modals: {
            quotationFunctionModal: com.focusPage("#quotationFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveQuotationFunctionBtn"),
        },
        items: {
            name: com.focusPage("#qfName"),
            key: com.focusPage("#qfKey"),
            value: com.focusPage("#qfValue"),
            group: com.focusPage("#qfGroup"),
            type: com.focusPage("#qfType"),
            subtype: com.focusPage("#qfSubtype"),
            sort: com.focusPage("#qfSort"),
            comment: com.focusPage("#qfComment"),
        },
    };

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.quotation.queryQuotationFunction, {
            "quotationFunction.type": ""
        }, function(res) {

            quotationFunctionManage.functions = res.quotationFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#qfmCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + quotationFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(quotationFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#qfmCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == quotationFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(quotationFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentDfids(done) {

        if (!quotationFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.queryQuotationFunctionRight, {
            "quotationFunctionRight.name": quotationFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.quotationFunctionRights || [], function(i, va) {
                set[va.quotationFunction.qfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentDfids(function(dfidSet) {

            var kw = com.focusPage("#qfmFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(quotationFunctionManage.functions, function(i, v) {

                if (dfidSet && !dfidSet[v.qfid]) return true;
                if (kw && ((v.name || "") + " " + (v.key || "") + " " + (v.value || "") + " " + (v.comment || "")).toLowerCase().indexOf(kw) == -1) return true;

                (groups[v.type] = groups[v.type] || []).push(v);
                total++;
            });

            renderGroups(groups, total);
            renderHint(total);
        });
    }

    function renderGroups(groups, total) {

        var $list = com.focusPage("#qfmItemList").html(null);

        $.each(quotationFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('qfm-section').text(quotationFunctionManage.typeNames[t] + " · " + rows.length));

            var $grid = $('<div></div>').addClass('qfm-grid clearfix');

            $.each(rows, function(j, v) {

                var kvText = v.key + (v.value ? " = " + v.value : "");

                var $cell = $('<div></div>').addClass('col-md-4 col-sm-6');
                var $card = $('<div></div>').addClass('qfm-card');

                var $head = $('<div></div>').addClass('clearfix');
                $head.append($('<span></span>').addClass('qfm-dfid').text(v.qfid));
                $head.append($('<span></span>').addClass('qfm-group').text("G" + (v.group == null ? 0 : v.group)));
                $head.append($('<span></span>').addClass('qfm-name').text(v.name).attr("title", v.name));

                var $ops = $('<span></span>').addClass('qfm-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $head.append($ops);

                $card.append($head);
                $card.append($('<div></div>').addClass('qfm-kv').text(kvText).attr("title", kvText));
                if (v.comment) $card.append($('<div></div>').addClass('qfm-cmt').text("// " + v.comment).attr("title", v.comment));

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

        var $hint = com.focusPage("#qfmViewHint");

        if (quotationFunctionManage.category) {
            $hint.text("「" + categoryName(quotationFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 编辑/删除/添加 ----------

    function openEdit(v) {

        quotationFunctionManage.qfid = v ? v.qfid : null;
        quotationFunctionManage.items.name.val(v ? v.name : "");
        quotationFunctionManage.items.key.val(v ? v.key : "");
        quotationFunctionManage.items.value.val(v ? v.value : "");
        quotationFunctionManage.items.group.val(v ? (v.group == null ? 0 : v.group) : 0);
        quotationFunctionManage.items.type.val(v ? v.type : "");
        quotationFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        quotationFunctionManage.items.sort.val(v ? v.sort : "");
        quotationFunctionManage.items.comment.val(v ? v.comment : "");

        quotationFunctionManage.modals.quotationFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.quotation.deleteQuotationFunction, {
            "quotationFunction.qfid": v.qfid
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

    com.focusPage("#qfmCategoryList").on("click", "li[data-key]", function() {

        quotationFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#qfmFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#qfmAddBtn").on("click", function() {

        openEdit(null);
    });

    quotationFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('quotationFunctionModal')) {
            return false;
        }

        var url = api.quotation.addQuotationFunction;

        var option = {
            "quotationFunction.name": quotationFunctionManage.items.name.val().trim(),
            "quotationFunction.key": quotationFunctionManage.items.key.val().trim(),
            "quotationFunction.value": quotationFunctionManage.items.value.val().trim(),
            "quotationFunction.group": quotationFunctionManage.items.group.val(),
            "quotationFunction.type": quotationFunctionManage.items.type.val(),
            "quotationFunction.subtype": quotationFunctionManage.items.subtype.val(),
            "quotationFunction.sort": quotationFunctionManage.items.sort.val(),
            "quotationFunction.comment": quotationFunctionManage.items.comment.val(),
        };

        if (quotationFunctionManage.qfid != null) {
            url = api.quotation.updateQuotationFunction;
            option["quotationFunction.qfid"] = quotationFunctionManage.qfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();

            quotationFunctionManage.modals.quotationFunctionModal.modal("hide");
        });
    });

    quotationFunctionManage.modals.quotationFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(quotationFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.quotation.queryQuotationFunction, {
        "quotationFunction.type": 0
    }, function(res) {

        quotationFunctionManage.categories = res.quotationFunctions || [];
        quotationFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
