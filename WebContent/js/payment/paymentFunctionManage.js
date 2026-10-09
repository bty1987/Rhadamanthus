jQuery(function($) {

    var paymentFunctionManage = {
        pfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项", 5: "功能项", 6: "功能项", 7: "功能项"},
        typeOrder: [1, 2, 3, 4, 5, 6, 7, 0],
        modals: {
            paymentFunctionModal: com.focusPage("#paymentFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#savePaymentFunctionBtn"),
        },
        items: {
            name: com.focusPage("#payName"),
            key: com.focusPage("#payKey"),
            value: com.focusPage("#payValue"),
            group: com.focusPage("#payGroup"),
            type: com.focusPage("#payType"),
            subtype: com.focusPage("#paySubtype"),
            sort: com.focusPage("#paySort"),
            comment: com.focusPage("#payComment"),
        },
    };

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.payment.queryPaymentFunction, {
            "paymentFunction.type": ""
        }, function(res) {

            paymentFunctionManage.functions = res.paymentFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#payCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + paymentFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(paymentFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#payCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == paymentFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(paymentFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentDfids(done) {

        if (!paymentFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.queryPaymentFunctionRight, {
            "paymentFunctionRight.name": paymentFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.paymentFunctionRights || [], function(i, va) {
                set[va.paymentFunction.pfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentDfids(function(dfidSet) {

            var kw = com.focusPage("#payFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(paymentFunctionManage.functions, function(i, v) {

                if (dfidSet && !dfidSet[v.pfid]) return true;
                if (kw && ((v.name || "") + " " + (v.key || "") + " " + (v.value || "") + " " + (v.comment || "")).toLowerCase().indexOf(kw) == -1) return true;

                (groups[v.type] = groups[v.type] || []).push(v);
                total++;
            });

            renderGroups(groups, total);
            renderHint(total);
        });
    }

    function renderGroups(groups, total) {

        var $list = com.focusPage("#payItemList").html(null);

        $.each(paymentFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('pay-section').text(paymentFunctionManage.typeNames[t] + " · " + rows.length));

            var $grid = $('<div></div>').addClass('pay-grid clearfix');

            $.each(rows, function(j, v) {

                var kvText = v.key + (v.value ? " = " + v.value : "");

                var $cell = $('<div></div>').addClass('col-md-4 col-sm-6');
                var $card = $('<div></div>').addClass('pay-card');

                var $head = $('<div></div>').addClass('clearfix');
                $head.append($('<span></span>').addClass('pay-dfid').text(v.pfid));
                $head.append($('<span></span>').addClass('pay-group').text("G" + (v.group == null ? 0 : v.group)));
                $head.append($('<span></span>').addClass('pay-name').text(v.name).attr("title", v.name));

                var $ops = $('<span></span>').addClass('pay-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $head.append($ops);

                $card.append($head);
                $card.append($('<div></div>').addClass('pay-kv').text(kvText).attr("title", kvText));
                if (v.comment) $card.append($('<div></div>').addClass('pay-cmt').text("// " + v.comment).attr("title", v.comment));

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

        var $hint = com.focusPage("#payViewHint");

        if (paymentFunctionManage.category) {
            $hint.text("「" + categoryName(paymentFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 编辑/删除/添加 ----------

    function openEdit(v) {

        paymentFunctionManage.pfid = v ? v.pfid : null;
        paymentFunctionManage.items.name.val(v ? v.name : "");
        paymentFunctionManage.items.key.val(v ? v.key : "");
        paymentFunctionManage.items.value.val(v ? v.value : "");
        paymentFunctionManage.items.group.val(v ? (v.group == null ? 0 : v.group) : 0);
        paymentFunctionManage.items.type.val(v ? v.type : "");
        paymentFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        paymentFunctionManage.items.sort.val(v ? v.sort : "");
        paymentFunctionManage.items.comment.val(v ? v.comment : "");

        paymentFunctionManage.modals.paymentFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.payment.deletePaymentFunction, {
            "paymentFunction.pfid": v.pfid
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

    com.focusPage("#payCategoryList").on("click", "li[data-key]", function() {

        paymentFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#payFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#payAddBtn").on("click", function() {

        openEdit(null);
    });

    paymentFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('paymentFunctionModal')) {
            return false;
        }

        var url = api.payment.addPaymentFunction;

        var option = {
            "paymentFunction.name": paymentFunctionManage.items.name.val().trim(),
            "paymentFunction.key": paymentFunctionManage.items.key.val().trim(),
            "paymentFunction.value": paymentFunctionManage.items.value.val().trim(),
            "paymentFunction.group": paymentFunctionManage.items.group.val(),
            "paymentFunction.type": paymentFunctionManage.items.type.val(),
            "paymentFunction.subtype": paymentFunctionManage.items.subtype.val(),
            "paymentFunction.sort": paymentFunctionManage.items.sort.val(),
            "paymentFunction.comment": paymentFunctionManage.items.comment.val(),
        };

        if (paymentFunctionManage.pfid != null) {
            url = api.payment.updatePaymentFunction;
            option["paymentFunction.pfid"] = paymentFunctionManage.pfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();

            paymentFunctionManage.modals.paymentFunctionModal.modal("hide");
        });
    });

    paymentFunctionManage.modals.paymentFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(paymentFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.payment.queryPaymentFunction, {
        "paymentFunction.type": 0
    }, function(res) {

        paymentFunctionManage.categories = res.paymentFunctions || [];
        paymentFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
