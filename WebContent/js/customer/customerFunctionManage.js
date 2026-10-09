jQuery(function($) {

    var customerFunctionManage = {
        cfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项"},
        typeOrder: [1, 2, 3, 4, 0],
        modals: {
            customerFunctionModal: com.focusPage("#customerFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveCustomerFunctionBtn"),
        },
        items: {
            name: com.focusPage("#cfName"),
            key: com.focusPage("#cfKey"),
            value: com.focusPage("#cfValue"),
            type: com.focusPage("#cfType"),
            subtype: com.focusPage("#cfSubtype"),
            sort: com.focusPage("#cfSort"),
            comment: com.focusPage("#cfComment"),
        },
    };

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.customer.queryCustomerFunction, {
            "customerFunction.type": ""
        }, function(res) {

            customerFunctionManage.functions = res.customerFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#cfmCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + customerFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(customerFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#cfmCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == customerFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(customerFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentDfids(done) {

        if (!customerFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.queryCustomerFunctionRight, {
            "customerFunctionRight.name": customerFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.customerFunctionRights || [], function(i, va) {
                set[va.customerFunction.cfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentDfids(function(dfidSet) {

            var kw = com.focusPage("#cfmFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(customerFunctionManage.functions, function(i, v) {

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

        var $list = com.focusPage("#cfmItemList").html(null);

        $.each(customerFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('cfm-section').text(customerFunctionManage.typeNames[t] + " · " + rows.length));

            var $grid = $('<div></div>').addClass('cfm-grid clearfix');

            $.each(rows, function(j, v) {

                var kvText = v.key + (v.value ? " = " + v.value : "");

                var $cell = $('<div></div>').addClass('col-md-4 col-sm-6');
                var $card = $('<div></div>').addClass('cfm-card');

                var $head = $('<div></div>').addClass('clearfix');
                $head.append($('<span></span>').addClass('cfm-dfid').text(v.cfid));
                $head.append($('<span></span>').addClass('cfm-name').text(v.name).attr("title", v.name));

                var $ops = $('<span></span>').addClass('cfm-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $head.append($ops);

                $card.append($head);
                $card.append($('<div></div>').addClass('cfm-kv').text(kvText).attr("title", kvText));
                if (v.comment) $card.append($('<div></div>').addClass('cfm-cmt').text("// " + v.comment).attr("title", v.comment));

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

        var $hint = com.focusPage("#cfmViewHint");

        if (customerFunctionManage.category) {
            $hint.text("「" + categoryName(customerFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 编辑/删除/添加 ----------

    function openEdit(v) {

        customerFunctionManage.cfid = v ? v.cfid : null;
        customerFunctionManage.items.name.val(v ? v.name : "");
        customerFunctionManage.items.key.val(v ? v.key : "");
        customerFunctionManage.items.value.val(v ? v.value : "");
        customerFunctionManage.items.type.val(v ? v.type : "");
        customerFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        customerFunctionManage.items.sort.val(v ? v.sort : "");
        customerFunctionManage.items.comment.val(v ? v.comment : "");

        customerFunctionManage.modals.customerFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.customer.deleteCustomerFunction, {
            "customerFunction.cfid": v.cfid
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

    com.focusPage("#cfmCategoryList").on("click", "li[data-key]", function() {

        customerFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#cfmFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#cfmAddBtn").on("click", function() {

        openEdit(null);
    });

    customerFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('customerFunctionModal')) {
            return false;
        }

        var url = api.customer.addCustomerFunction;

        var option = {
            "customerFunction.name": customerFunctionManage.items.name.val().trim(),
            "customerFunction.key": customerFunctionManage.items.key.val().trim(),
            "customerFunction.value": customerFunctionManage.items.value.val().trim(),
            "customerFunction.type": customerFunctionManage.items.type.val(),
            "customerFunction.subtype": customerFunctionManage.items.subtype.val(),
            "customerFunction.sort": customerFunctionManage.items.sort.val(),
            "customerFunction.comment": customerFunctionManage.items.comment.val(),
        };

        if (customerFunctionManage.cfid != null) {
            url = api.customer.updateCustomerFunction;
            option["customerFunction.cfid"] = customerFunctionManage.cfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();

            customerFunctionManage.modals.customerFunctionModal.modal("hide");
        });
    });

    customerFunctionManage.modals.customerFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(customerFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.customer.queryCustomerFunction, {
        "customerFunction.type": 0
    }, function(res) {

        customerFunctionManage.categories = res.customerFunctions || [];
        customerFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
