jQuery(function($) {

    var salesFunctionManage = {
        sfid: null,
        category: "", // 当前视图(""=全部条目, 否则为type=0页面变体key)
        functions: [],
        categories: [],
        typeNames: {0: "功能区块", 1: "API数据源", 2: "查询条件", 3: "列字段", 4: "功能项", 6: "状态项"},
        typeOrder: [1, 2, 3, 4, 6, 0],
        // 分组位掩码(与salesFunction.js配置页 v.group & 变体group 匹配语义一致, 值=生产salesfunction.type=0变体族)
        groupBits: [{value: 1, name: "销售单"}, {value: 2, name: "仓储转单"}, {value: 4, name: "预结算"}, {value: 8, name: "结算"}, {value: 16, name: "对账"}, {value: 32, name: "配送"}, {value: 64, name: "活动"}],
        modals: {
            salesFunctionModal: com.focusPage("#salesFunctionModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveSalesFunctionBtn"),
        },
        items: {
            name: com.focusPage("#sfName"),
            key: com.focusPage("#sfKey"),
            value: com.focusPage("#sfValue"),
            groups: com.focusPage("#sfmGroups"),
            type: com.focusPage("#sfType"),
            subtype: com.focusPage("#sfSubtype"),
            sort: com.focusPage("#sfSort"),
            comment: com.focusPage("#sfComment"),
        },
    };

    // ---------- 数据加载 ----------

    function loadFunctions(done) {

        com.post(api.sales.querySalesFunction, {
            "salesFunction.type": ""
        }, function(res) {

            salesFunctionManage.functions = res.salesFunctions || [];
            done && done();
        });
    }

    // ---------- 左侧分类导航 ----------

    function renderSidebar() {

        var $ul = com.focusPage("#sfmCategoryList").html(null);

        var $all = $('<li data-key=""></li>').append($('<a></a>').html('全部条目<span class="badge pull-right" style="margin-top: 2px;">' + salesFunctionManage.functions.length + '</span>'));
        $ul.append($all);
        $ul.append($('<li class="nav-header"></li>').text("页面变体"));

        $.each(salesFunctionManage.categories, function(i, v) {

            $ul.append($('<li data-key="' + v.key + '" title="' + v.key + '"></li>').append($('<a></a>').text(v.name)));
        });

        markActive();
    }

    function markActive() {

        com.focusPage("#sfmCategoryList li").removeClass("active").each(function() {

            if ($(this).attr("data-key") == salesFunctionManage.category) $(this).addClass("active");
        });
    }

    function categoryName(key) {

        var name = key;

        $.each(salesFunctionManage.categories, function(i, v) {

            if (v.key == key) {
                name = v.name + " (" + v.key + ")";
                return false;
            }
        });

        return name;
    }

    // ---------- 右侧条目渲染 ----------

    function currentSfids(done) {

        if (!salesFunctionManage.category) {
            done(null);
            return;
        }

        com.post(api.right.querySalesFunctionRightByName, {
            "salesFunctionRight.name": salesFunctionManage.category
        }, function(res) {

            var set = {};

            $.each(res.salesFunctionRights || [], function(i, va) {
                set[va.salesFunction.sfid] = true;
            });

            done(set);
        });
    }

    function render() {

        currentSfids(function(sfidsSet) {

            var kw = com.focusPage("#sfmFilter").val().trim().toLowerCase();
            var groups = {}, total = 0;

            $.each(salesFunctionManage.functions, function(i, v) {

                if (sfidsSet && !sfidsSet[v.sfid]) return true;
                if (kw && ((v.name || "") + " " + (v.key || "") + " " + (v.value || "") + " " + (v.comment || "")).toLowerCase().indexOf(kw) == -1) return true;

                (groups[v.type] = groups[v.type] || []).push(v);
                total++;
            });

            renderGroups(groups, total);
            renderHint(total);
        });
    }

    function renderGroups(groups, total) {

        var $list = com.focusPage("#sfmItemList").html(null);

        $.each(salesFunctionManage.typeOrder, function(i, t) {

            var rows = groups[t];
            if (!rows || !rows.length) return true;

            rows.sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });

            $list.append($('<div></div>').addClass('sfm-section').text(salesFunctionManage.typeNames[t] + " · " + rows.length));

            var $grid = $('<div></div>').addClass('sfm-grid clearfix');

            $.each(rows, function(j, v) {

                var kvText = v.key + (v.value ? " = " + v.value : "");

                var $cell = $('<div></div>').addClass('col-md-4 col-sm-6');
                var $card = $('<div></div>').addClass('sfm-card');

                var $head = $('<div></div>').addClass('clearfix');
                $head.append($('<span></span>').addClass('sfm-sfid').text(v.sfid));
                $head.append($('<span></span>').addClass('sfm-group').text("G" + (v.group == null ? 0 : v.group)).attr("title", groupNames(v.group)));
                $head.append($('<span></span>').addClass('sfm-name').text(v.name).attr("title", v.name));

                var $ops = $('<span></span>').addClass('sfm-ops pull-right');
                $ops.append($('<a class="btn btn-minier btn-yellow">编辑</a>'));
                $ops.append($('<a class="btn btn-minier btn-danger" style="margin-left: 4px;">删除</a>'));
                $head.append($ops);

                $card.append($head);
                $card.append($('<div></div>').addClass('sfm-kv').text(kvText).attr("title", kvText));
                if (v.comment) $card.append($('<div></div>').addClass('sfm-cmt').text("// " + v.comment).attr("title", v.comment));

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

    // 分组位掩码 -> 族名串(如 3 -> "销售单+仓储转单")
    function groupNames(group) {

        var names = [];

        $.each(salesFunctionManage.groupBits, function(i, v) {

            if ((group & v.value) == v.value) names.push(v.name);
        });

        return names.length ? names.join("+") : "未分组";
    }

    function renderHint(total) {

        var $hint = com.focusPage("#sfmViewHint");

        if (salesFunctionManage.category) {
            $hint.text("「" + categoryName(salesFunctionManage.category) + "」绑定条目 " + total + " 条 · 公司级勾选在「功能配置」页维护");
        } else {
            $hint.text("共 " + total + " 条");
        }
    }

    // ---------- 分组勾选 ----------

    function renderGroupChecks(group) {

        salesFunctionManage.items.groups.html(null);

        $.each(salesFunctionManage.groupBits, function(i, v) {

            var $label = $('<label class="checkbox-inline"></label>');
            var $input = $('<input type="checkbox" name="sfGroupBits"/>').val(v.value).appendTo($label);
            $('<span class="lbl"></span>').text(v.name).appendTo($label);

            if ((group & v.value) == v.value) $input.prop("checked", true);

            salesFunctionManage.items.groups.append($label);
        });
    }

    function checkedGroupValue() {

        var value = 0;

        com.focusPage('input[name="sfGroupBits"]:checked').each(function() {
            value += Number($(this).val());
        });

        return value;
    }

    // ---------- 编辑/删除/添加 ----------

    function openEdit(v) {

        salesFunctionManage.sfid = v ? v.sfid : null;
        salesFunctionManage.items.name.val(v ? v.name : "");
        salesFunctionManage.items.key.val(v ? v.key : "");
        salesFunctionManage.items.value.val(v ? v.value : "");
        renderGroupChecks(v ? (v.group == null ? 0 : v.group) : 0);
        salesFunctionManage.items.type.val(v ? v.type : "");
        salesFunctionManage.items.subtype.val(v ? (v.subtype == null ? 0 : v.subtype) : 0);
        salesFunctionManage.items.sort.val(v ? v.sort : "");
        salesFunctionManage.items.comment.val(v ? v.comment : "");

        salesFunctionManage.modals.salesFunctionModal.modal("show");
    }

    function deleteFunction(v) {

        com.post(api.sales.deleteSalesFunction, {
            "salesFunction.sfid": v.sfid
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

    com.focusPage("#sfmCategoryList").on("click", "li[data-key]", function() {

        salesFunctionManage.category = $(this).attr("data-key") || "";
        markActive();
        render();
    });

    com.focusPage("#sfmFilter").on("keyup", function() {

        render();
    });

    com.focusPage("#sfmAddBtn").on("click", function() {

        openEdit(null);
    });

    salesFunctionManage.btns.saveBtn.on("click", function() {

        if (com.validate('salesFunctionModal')) {
            return false;
        }

        var group = checkedGroupValue();

        if (group == 0) {
            com.showAlert(com.warning, "请至少勾选一个分组");
            return false;
        }

        var url = api.sales.addSalesFunction;

        var option = {
            "salesFunction.name": salesFunctionManage.items.name.val().trim(),
            "salesFunction.key": salesFunctionManage.items.key.val().trim(),
            "salesFunction.value": salesFunctionManage.items.value.val().trim(),
            "salesFunction.group": group,
            "salesFunction.type": salesFunctionManage.items.type.val(),
            "salesFunction.subtype": salesFunctionManage.items.subtype.val(),
            "salesFunction.sort": salesFunctionManage.items.sort.val(),
            "salesFunction.comment": salesFunctionManage.items.comment.val(),
        };

        if (salesFunctionManage.sfid != null) {
            url = api.sales.updateSalesFunction;
            option["salesFunction.sfid"] = salesFunctionManage.sfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            refresh();

            salesFunctionManage.modals.salesFunctionModal.modal("hide");
        });
    });

    salesFunctionManage.modals.salesFunctionModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(salesFunctionManage.items);
    });

    // ---------- 初始化 ----------

    com.post(api.sales.querySalesFunction, {
        "salesFunction.type": 0
    }, function(res) {

        salesFunctionManage.categories = res.salesFunctions || [];
        salesFunctionManage.categories.sort(function(a, b) {
            return (a.sort || 0) - (b.sort || 0);
        });
        renderSidebar();
    });

    loadFunctions(render);

});
