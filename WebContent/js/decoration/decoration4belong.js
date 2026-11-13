jQuery(function($) {

    var decorationBelong = {
        decorationType: {},

        decorationOrderStatus: {}
    };

    decorationBelong.decorationOrderStatus = constant.decoration().decoration.status.keys;
    decorationBelong.decorationType = constant.decoration().decoration.typeness.keys;

    // 可移交装修单状态: 0初始/1定金/2预签/3签约/4重签 (废单5/终止6/决算7/完工8等排除), 与后端提交端240088口径一致
    var TRAN_DECORATION_STATUS = [0, 1, 2, 3, 4];

    /* ====================== 离职移交配置缓存(BelongTran) ====================== */

    // 配置直接挂在装修单上: 按单号单键, 每单同时容纳设计段+业务段(接手人/比例‰/默认标识);
    // 移交人=单数据自带的原设计师/原业务员快照; sessionStorage TTL 24h 过期即弃
    var TRAN_CONFIG_KEY = "belongTranConfigs";
    var TRAN_TTL = 24 * 60 * 60 * 1000;

    var tranConfigs = JSON.parse(sessionStorage.getItem(TRAN_CONFIG_KEY)) || {};

    var tranConfigModal = {
        mode: null, // single | batch
        orders: [], // single为1条行快照, batch为勾选快照
        design: null, // typeahead选中的接手设计师
        sales: null // typeahead选中的接手业务员
    };

    var tranSubmitState = null;

    // 勾选map(批量作用域, 跨页保存): orderId -> 单快照(designer/salesman/status), 供批量配置取各单现归属
    var tranChecked = {};

    function tranSaveConfigs() {

        sessionStorage.setItem(TRAN_CONFIG_KEY, JSON.stringify(tranConfigs));
    }

    // 过期条目惰性清理: 打开页面与每次存取时剔除超TTL的单条目, 防陈旧配置跨天误提
    function tranPurgeExpired() {

        var now = new Date().getTime();

        $.each(tranConfigs, function(orderId, config) {

            if (!config.time || now - config.time > TRAN_TTL) delete tranConfigs[orderId];
        });

        tranSaveConfigs();
    }

    function tranConfigCount() {

        var count = 0;

        $.each(tranConfigs, function() {
            count++;
        });

        return count;
    }

    // ‰ → "85%" / "85.5%"
    function tranRatePercentText(rate) {

        return (Math.round(rate / 10 * 10) / 10) + "%";
    }

    function tranSnapshotOrder(v) {

        return {
            orderId: v.orderId,
            status: v.status,
            customerName: v.customer && v.customer.name ? v.customer.name : "",
            designer: v.designer ? {
                userId: v.designer.userId || "",
                userName: v.designer.currentName || ""
            } : {
                userId: "",
                userName: ""
            },
            salesman: v.salesman ? {
                userId: v.salesman.userId || "",
                userName: v.salesman.currentName || ""
            } : {
                userId: "",
                userName: ""
            }
        };
    }

    function tranConfigText(v) {

        var config = tranConfigs[v.orderId];

        if (!config || (!config.design && !config.sales)) return "-";

        var parts = [];

        if (config.design) parts.push("设计→" + config.design.userName + " " + tranRatePercentText(config.design.rate) + (config.design.defaultFlag == 1 ? "默认" : ""));
        if (config.sales) parts.push("业务→" + config.sales.userName + " " + tranRatePercentText(config.sales.rate) + (config.sales.defaultFlag == 1 ? "默认" : ""));

        return parts.join(" / ");
    }

    /* ====================== 日常列表(查看/设计/业务/移交+勾选批量) ====================== */

    var lineprops = (function() {

        return [{
            type: "checkbox",
            name: "belongTranCheck",
            prop: "orderId",
            checked: function(v) {
                return !!tranChecked[v.orderId];
            },
            change: function($input, v) {

                if ($input.prop("checked")) tranChecked[v.orderId] = tranSnapshotOrder(v);
                else delete tranChecked[v.orderId];
            }
        }, {
            field: "address",
            name: "楼盘地址",
            prop: function(v) {

                return v.house.village.name + " " + v.house.houseNumber;
            },
            clazz: "grey"
        }, {
            field: "customer",
            name: "客户名",
            prop: "customer.name",
            clazz: "grey"
        }, {
            field: "designDepartment",
            name: "设计部",
            prop: "designer.dept.name",
            clazz: "grey"
        }, {
            field: "designer",
            name: "设计师",
            prop: "designer.currentName",
            clazz: "grey"
        }, {
            field: "salesmanDepartment",
            name: "业务部",
            prop: "salesman.dept.name",
            clazz: "grey"
        }, {
            field: "salesman",
            name: "业务员",
            prop: "salesman.currentName",
            clazz: "grey"
        }, {
            field: "houseArea",
            name: "面积",
            prop: "house.buildArea",
            clazz: "blue"
        }, {
            field: "orderTotalPrice",
            name: "合同报价",
            prop: "orderTotalPrice",
            clazz: "blue"
        }, {
            field: "measureTime",
            name: "量房时间",
            prop: "measureTime",
            clazz: "green"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) {

                return decorationBelong.decorationType[v.type];
            },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {

                return decorationBelong.decorationOrderStatus[v.status];
            },
            clazz: "red"
        }, {
            field: "tranConfig",
            name: "移交配置",
            prop: function(v) {

                return tranConfigText(v);
            },
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            look: {name: "查看", clazz: "btn-success", handle: function(v) { viewDecorationBelongDetail(v.orderId); }},
            design: {name: "设计", clazz: "btn-yellow", handle: function(v) { changeDecorationBelongDesigner(v.orderId); }},
            salesman: {name: "业务", clazz: "btn-primary", handle: function(v) { changeDecorationBelongBussiness(v.orderId); }},
            tran: {name: "移交", clazz: "btn-warning", handle: function(v) { tranOpenConfigModal("single", [tranSnapshotOrder(v)]); }}
        };
    })();

    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-houseArea', 'decoration-designer', 'decoration-salesman', 'decoration-type', 'decoration-salesType'];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationForBelong, null, _condArr, "decorationBelongPostData");

    searcher.button([{
        id: "belongTranConfigBatchBtn",
        name: "移交配置",
        clazz: "btn-warning",
        icon: "icon-exchange bigger-110"
    }, {
        id: "belongTranSubmitBtn",
        name: "发起移交审批",
        clazz: "btn-success",
        icon: "icon-ok bigger-110"
    }, {
        id: "belongTranClearBtn",
        name: "清空移交配置",
        clazz: "btn-white",
        icon: "icon-trash bigger-110"
    }]);

    searcher.line(function(v) {
        return ' ' + v.orderId;
    }, lineprops, linebtns).render();

    function viewDecorationBelongDetail(orderId) {

        params.decoration.orderId = orderId;

        // com.switchPage(api.index.decorationBelongInfoIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongInfoIndex.url, "装修单归属: " + orderId);
    }

    function changeDecorationBelongDesigner(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 0;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单设计归属: " + orderId);
    }

    function changeDecorationBelongBussiness(orderId) {

        params.decoration.orderId = orderId;
        params.decoration.orderBelongType = 1;

        // com.switchPage(api.index.decorationBelongDetailIndex.url);
        com.popup4page("#layerPopUp", api.index.decorationBelongDetailIndex.url, "装修单业务归属: " + orderId);
    }

    /* ====================== 移交配置 modal(单条/批量共用) ====================== */

    function tranResetConfigModal() {

        $("#belongTranDesignUserInput,#belongTranSalesUserInput").val("");
        $("#belongTranDesignUserName,#belongTranDesignUserDept,#belongTranDesignUserRegion").val("");
        $("#belongTranSalesUserName,#belongTranSalesUserDept,#belongTranSalesUserRegion").val("");
        $("#belongTranDesignRate,#belongTranSalesRate").val("");
        $("#belongTranDesignDefault,#belongTranSalesDefault").prop("checked", false);
        $("#belongTranDesignClear,#belongTranSalesClear").hide();
        $("#belongTranDesignCurrent,#belongTranSalesCurrent").empty().hide();

        tranConfigModal.design = null;
        tranConfigModal.sales = null;
    }

    function tranOpenConfigModal(mode, orders) {

        tranConfigModal.mode = mode;
        tranConfigModal.orders = orders;

        tranResetConfigModal();

        var orderId = orders[0].orderId;
        var config = tranConfigs[orderId];

        if (mode == "single") {

            var v = orders[0];

            $("#belongTranScopeInfo").html('<b>' + v.orderId + '</b> · ' + (v.customerName || "") + ' · ' + (decorationBelong.decorationOrderStatus[v.status] || v.status) + ' · 设计师 ' + v.designer.userName + ' · 业务员 ' + v.salesman.userName);

            tranLoadCurrentBelongs(orderId);

            if (config && config.design) tranFillSection("belongTranDesignUser", "design", config.design);
            if (config && config.sales) tranFillSection("belongTranSalesUser", "sales", config.sales);

            $("#belongTranDesignClear").toggle(!!(config && config.design));
            $("#belongTranSalesClear").toggle(!!(config && config.sales));

        } else {

            $("#belongTranScopeInfo").html('批量应用到勾选的 <b>' + orders.length + '</b> 单: 设计段移交各单现设计师, 业务段移交各单现业务员; 比例与默认人对勾选单统一生效');
        }

        $("#belongTranConfigModal").modal("show");
    }

    // 预填一段(缓存回显): 同步设置typeahead state, 否则不改直接保存会被"请选择接手人"误拦
    function tranFillSection(base, stateKey, section) {

        tranConfigModal[stateKey] = {
            userId: section.userId,
            currentName: section.userName,
            deptName: section.deptName,
            regionName: section.regionName
        };

        $("#" + base + "Input").val(section.userName);
        $("#" + base + "Name").val(section.userName);
        $("#" + base + "Dept").val(section.deptName || "");
        $("#" + base + "Region").val(section.regionName || "");
        $("#" + base + "Rate").val(Math.round(section.rate / 10 * 10) / 10);
        $("#" + base + "Default").prop("checked", section.defaultFlag == 1);
    }

    // 现归属行展示: 供默认标识/比例决策参考(queryDecorationBelong的rate经tranargs已÷1000, 此处×1000还原‰展示)
    function tranLoadCurrentBelongs(orderId) {

        com.post(api.decoration.queryDecorationBelong, {
            "decorationBelong.orderId": orderId
        }, function(res) {

            tranRenderCurrentBelongs("#belongTranDesignCurrent", 0, res.decorationBelongs || []);
            tranRenderCurrentBelongs("#belongTranSalesCurrent", 1, res.decorationBelongs || []);
        });
    }

    function tranRenderCurrentBelongs(selector, type, belongs) {

        var rows = $.grep(belongs || [], function(b) {
            return b.type == type && b.status == 0;
        });

        var $box = $(selector).empty().show();

        if (rows.length == 0) {
            $box.text("现归属: 无生效行");
            return;
        }

        var texts = $.map(rows, function(b) {

            return (b.belonger ? b.belonger.currentName : "?") + "(" + (b.department ? b.department.name : "") + ") " + tranRatePercentText(b.rate != null ? Math.round(b.rate * 1000) : 0) + (b.defaultFlag == 1 ? " 默认" : "");
        });

        $box.text("现归属: " + texts.join(" | "));
    }

    function tranBindReceiverTypeahead(base, stateKey) {

        com.initTypeahead(base + "Input", api.personel.queryUserByPinyin, "pinyinName", {
            "user.status": 0,
            "departmentType.name": ""
        }, 'autoFillKeyValue', 'key', 'value', function(list, key, value) {

            if (value == null || value == "") {
                return false;
            }

            com.post(api.personel.queryUserByUserId, {
                "user.userId": key
            }, function(res) {

                if (res.user.dept == null || res.user.dept.fatherDept == null) {

                    com.showAlert(com.error, "接手人部门未关联分区,请先完善部门数据");
                    tranConfigModal[stateKey] = null;
                    return;
                }

                tranConfigModal[stateKey] = {
                    userId: res.user.userId,
                    currentName: res.user.currentName,
                    deptName: res.user.dept.name,
                    regionName: res.user.dept.fatherDept.name
                };

                $("#" + base + "Name").val(res.user.currentName);
                $("#" + base + "Dept").val(res.user.dept.name);
                $("#" + base + "Region").val(res.user.dept.fatherDept.name);
            });

            return value;
        });
    }

    tranBindReceiverTypeahead("belongTranDesignUser", "design");
    tranBindReceiverTypeahead("belongTranSalesUser", "sales");

    // 读一段配置: 输入框空=该段不变更; 有文字但未选中下拉=报错; 选中则比例必填
    function tranReadSection(base, stateKey) {

        var $input = $("#" + base + "Input");
        var inputText = $.trim($input.val());

        if (inputText == "") return {
            section: null
        };

        var receiver = tranConfigModal[stateKey];

        if (receiver == null) return {
            error: "请从下拉列表中选择接手人"
        };

        var rate = tranParseRatePercent($("#" + base + "Rate"));

        if (isNaN(rate)) return {
            error: "归属比例须在0~100之间(可一位小数)"
        };

        return {
            section: {
                userId: receiver.userId,
                userName: receiver.currentName,
                deptName: receiver.deptName,
                regionName: receiver.regionName,
                rate: rate,
                defaultFlag: $("#" + base + "Default").prop("checked") ? 1 : 0
            }
        };
    }

    // % → ‰整数(空/非法返NaN)
    function tranParseRatePercent($input) {

        var val = $.trim($input.val());

        if (val == "") return NaN;

        var num = parseFloat(val);

        if (isNaN(num) || num < 0 || num > 100) return NaN;

        return Math.round(num * 10);
    }

    $("#belongTranConfigBatchBtn").on('click', function() {

        var orders = $.map(tranChecked, function(snapshot) {
            return snapshot;
        });

        if (orders.length == 0) {
            com.showAlert(com.warning, "请先勾选需要移交配置的装修单");
            return false;
        }

        tranOpenConfigModal("batch", orders);

        return false;
    });

    $("#belongTranConfigOkBtn").on('click', function() {

        var design = tranReadSection("belongTranDesignUser", "design");

        if (design.error) {
            com.showAlert(com.error, design.error);
            return false;
        }

        var sales = tranReadSection("belongTranSalesUser", "sales");

        if (sales.error) {
            com.showAlert(com.error, sales.error);
            return false;
        }

        if (tranConfigModal.mode == "single") tranSaveSingle(design.section, sales.section);
        else tranSaveBatch(design.section, sales.section);

        return false;
    });

    function tranSaveSingle(design, sales) {

        var v = tranConfigModal.orders[0];
        var orderId = v.orderId;

        if (TRAN_DECORATION_STATUS.indexOf(v.status) == -1) {
            com.showAlert(com.error, "该单状态不可移交(仅初始/定金/预签/签约/重签单可移交)");
            return false;
        }

        var config = tranConfigs[orderId] || {
            designer: $.extend({}, v.designer),
            salesman: $.extend({}, v.salesman),
            time: 0,
            design: null,
            sales: null
        };

        if (design) {

            if (!v.designer.userId) {
                com.showAlert(com.error, "该单现设计师数据缺失,不可配置设计移交");
                return false;
            }

            if (design.userId == v.designer.userId) {
                com.showAlert(com.error, "接手设计师与现设计师相同");
                return false;
            }

            config.design = design;
        }

        if (sales) {

            if (!v.salesman.userId) {
                com.showAlert(com.error, "该单现业务员数据缺失,不可配置业务移交");
                return false;
            }

            if (sales.userId == v.salesman.userId) {
                com.showAlert(com.error, "接手业务员与现业务员相同");
                return false;
            }

            config.sales = sales;
        }

        if (!config.design && !config.sales) {
            com.showAlert(com.error, "请至少配置一个接手人");
            return false;
        }

        config.time = new Date().getTime();

        tranConfigs[orderId] = config;
        tranSaveConfigs();

        $("#belongTranConfigModal").modal("hide");
        com.showAlert(com.info, "移交配置已缓存: " + orderId);
        searcher.doSearch();
    }

    function tranSaveBatch(design, sales) {

        if (!design && !sales) {
            com.showAlert(com.error, "请至少配置一个接手人");
            return false;
        }

        var now = new Date().getTime();
        var saved = 0;
        var skipMap = {};

        $.each(tranConfigModal.orders, function(i, v) {

            if (TRAN_DECORATION_STATUS.indexOf(v.status) == -1) {
                skipMap[v.orderId] = v.orderId + "(状态不可移交)";
                return true;
            }

            var config = tranConfigs[v.orderId] || {
                designer: $.extend({}, v.designer),
                salesman: $.extend({}, v.salesman),
                time: 0,
                design: null,
                sales: null
            };

            var touched = false;
            var reasons = [];

            if (design) {

                if (!v.designer.userId) reasons.push("现设计师数据缺失");
                else if (design.userId == v.designer.userId) reasons.push("接手人与现设计师相同");
                else {
                    config.design = $.extend({}, design);
                    touched = true;
                }
            }

            if (sales) {

                if (!v.salesman.userId) reasons.push("现业务员数据缺失");
                else if (sales.userId == v.salesman.userId) reasons.push("接手人与现业务员相同");
                else {
                    config.sales = $.extend({}, sales);
                    touched = true;
                }
            }

            if (touched) {

                config.time = now;
                tranConfigs[v.orderId] = config;
                saved++;

            } else if (reasons.length > 0) {
                skipMap[v.orderId] = v.orderId + "(" + reasons.join(";") + ")";
            }
        });

        var skipped = $.map(skipMap, function(reason) {
            return reason;
        });

        $("#belongTranConfigModal").modal("hide");

        if (saved > 0) {

            com.showAlert(skipped.length > 0 ? com.warning : com.info, "已缓存移交配置 " + saved + " 单" + (skipped.length > 0 ? "; 跳过 " + skipped.length + " 单: " + skipped.join("、") : ""));
            searcher.doSearch();

        } else {
            com.showAlert(com.error, "没有可保存的勾选单" + (skipped.length > 0 ? ": " + skipped.join("、") : ""));
        }
    }

    // 清除单条模式已存段配置(立即生效于缓存)
    function tranClearSection(base, key) {

        var orderId = tranConfigModal.orders.length > 0 ? tranConfigModal.orders[0].orderId : null;

        if (!orderId || !tranConfigs[orderId]) return false;

        var config = tranConfigs[orderId];

        config[key] = null;

        if (!config.design && !config.sales) delete tranConfigs[orderId];

        tranSaveConfigs();

        tranResetConfigModal();

        if (tranConfigs[orderId]) {

            if (tranConfigs[orderId].design) {
                tranFillSection("belongTranDesignUser", "design", tranConfigs[orderId].design);
                $("#belongTranDesignClear").show();
            }

            if (tranConfigs[orderId].sales) {
                tranFillSection("belongTranSalesUser", "sales", tranConfigs[orderId].sales);
                $("#belongTranSalesClear").show();
            }
        }

        com.showAlert(com.info, "已清除该段移交配置");
        searcher.doSearch();

        return false;
    }

    $("#belongTranDesignClear").on('click', function() {
        return tranClearSection("belongTranDesignUser", "design");
    });

    $("#belongTranSalesClear").on('click', function() {
        return tranClearSection("belongTranSalesUser", "sales");
    });

    $("#belongTranConfigModal").on('hide.bs.modal', function() {

        tranResetConfigModal();
        tranConfigModal.mode = null;
        tranConfigModal.orders = [];
    });

    $("#belongTranClearBtn").on('click', function() {

        tranPurgeExpired();

        var count = tranConfigCount();

        if (count == 0) {
            com.showAlert(com.info, "暂无移交配置");
            return false;
        }

        com.showConfirm("确定清空全部 " + count + " 条移交配置?", function() {

            tranConfigs = {};
            tranSaveConfigs();
            searcher.doSearch();
        });

        return false;
    });

    /* ====================== 发起移交审批 modal ====================== */

    // 按"移交人"分组: 设计段归各单现设计师, 业务段归各单现业务员, 同一人两类合并;
    // 一人一张审批(后端审批机制不变), 组内 tranType 按段型推导 0设计/1业务/2混合
    function tranGroupConfigs() {

        var groupMap = {};

        function groupOf(userId, userName) {

            if (!groupMap[userId]) groupMap[userId] = {
                userId: userId,
                userName: userName,
                designCount: 0,
                salesCount: 0,
                items: []
            };

            return groupMap[userId];
        }

        $.each(tranConfigs, function(orderId, config) {

            if (config.design && config.designer.userId) {

                var g = groupOf(config.designer.userId, config.designer.userName);

                g.designCount++;
                g.items.push(tranBuildItem(orderId, 0, config.design));
            }

            if (config.sales && config.salesman.userId) {

                var g = groupOf(config.salesman.userId, config.salesman.userName);

                g.salesCount++;
                g.items.push(tranBuildItem(orderId, 1, config.sales));
            }
        });

        var groups = $.map(groupMap, function(g) {

            g.tranType = g.designCount > 0 && g.salesCount > 0 ? 2 : (g.salesCount > 0 ? 1 : 0);

            g.items.sort(function(a, b) {
                return a.orderId < b.orderId ? -1 : 1;
            });

            return g;
        });

        groups.sort(function(a, b) {
            return a.userId < b.userId ? -1 : 1;
        });

        return groups;
    }

    function tranBuildItem(orderId, belongType, section) {

        return {
            orderId: orderId,
            belongType: belongType,
            userId: section.userId,
            userName: section.userName,
            rate: section.rate,
            defaultFlag: section.defaultFlag
        };
    }

    function tranRenderSubmitSummary(groups) {

        var itemCount = 0;

        $.each(groups, function(i, g) {
            itemCount += g.items.length;
        });

        var $sum = $("#belongTranSubmitSummary").empty();

        $sum.append('<div>共 <b>' + groups.length + '</b> 位移交人 / <b>' + itemCount + '</b> 条归属, 每位移交人一张审批, 通过后整批生效, 驳回零变更</div>');

        $.each(groups, function(i, g) {

            $sum.append('<div style="margin-top:6px"><b>' + g.userName + '</b> (' + (g.tranType == 0 ? "设计" : g.tranType == 1 ? "业务" : "设计+业务") + ' ' + g.items.length + ' 条)</div>');

            $.each(g.items, function(j, item) {

                $sum.append('<div style="margin-left:12px">' + item.orderId + ' ' + (item.belongType == 0 ? "设计" : "业务") + '→' + item.userName + '(' + tranRatePercentText(item.rate) + (item.defaultFlag == 1 ? ',默认' : '') + ')</div>');
            });
        });
    }

    $("#belongTranSubmitBtn").on('click', function() {

        tranPurgeExpired();

        var groups = tranGroupConfigs();

        if (groups.length == 0) {
            com.showAlert(com.error, "暂无移交配置,请先在列表行[移交]或勾选后[移交配置]中配置接手人");
            return false;
        }

        tranRenderSubmitSummary(groups);

        approvalUtils.initqueryApprovalUser("belongTranApproveManSel", constant.approval().approval.TYPE_BELONG_TRAN_INT);

        tranSubmitState = {
            groups: groups,
            approverId: null
        };

        $("#belongTranSubmitModal").modal("show");

        return false;
    });

    com.initTypeahead('belongTranApproverInput', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', function(list, key, value) {

        if (value == null || value == "") {
            return false;
        }

        if (tranSubmitState) tranSubmitState.approverId = key;

        return value;
    });

    // 逐组串行提交(api已配intercept绕过同端点5秒节流); 成功组即从缓存摘除, 失败组保留并逐组报错
    $("#belongTranSubmitOkBtn").on('click', function() {

        var receiverId = $("#belongTranApproveManSel").find('input:checked').attr("userid") || (tranSubmitState ? tranSubmitState.approverId : null);

        if (receiverId == null || receiverId == "") {
            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        var groups = tranSubmitState.groups;
        var reason = $("#belongTranReasonInput").val() || "";
        var successCount = 0;
        var failMessages = [];

        $("#belongTranSubmitOkBtn").prop("disabled", true);

        function submitAt(index) {

            if (index >= groups.length) {

                $("#belongTranSubmitOkBtn").prop("disabled", false);

                tranPurgeExpired();
                tranSaveConfigs();

                $("#belongTranSubmitModal").modal("hide");

                if (failMessages.length == 0) {
                    com.showAlert(com.info, "移交审批已全部提交: " + successCount + " 张, 审批通过后生效");
                } else {
                    com.showAlert(com.error, "移交审批提交完成: 成功 " + successCount + " 张, 失败 " + failMessages.length + " 张(失败组配置已保留)<br>" + failMessages.join("<br>"));
                }

                searcher.doSearch();
                return;
            }

            var g = groups[index];

            var options = {
                "approval.receiver.userId": receiverId,
                "approvalBelongTran.userId": g.userId,
                "approvalBelongTran.tranType": g.tranType,
                "approvalBelongTran.reason": reason
            };

            $.each(g.items, function(j, item) {

                options["approvalBelongTranItems[" + j + "].orderId"] = item.orderId;
                options["approvalBelongTranItems[" + j + "].belongType"] = item.belongType;
                options["approvalBelongTranItems[" + j + "].userId"] = item.userId;
                options["approvalBelongTranItems[" + j + "].rate"] = item.rate;
                options["approvalBelongTranItems[" + j + "].defaultFlag"] = item.defaultFlag;
            });

            com.post(api.approval.submitApprovalForBelongTran, options, function() {

                successCount++;

                $.each(g.items, function(j, item) {

                    var config = tranConfigs[item.orderId];

                    if (!config) return true;

                    if (item.belongType == 0) config.design = null;
                    else config.sales = null;

                    if (!config.design && !config.sales) delete tranConfigs[item.orderId];
                });

                submitAt(index + 1);

            }, function(res) {

                failMessages.push(g.userName + ": " + (res && res.errorCode != null ? (com.errorMap[res.errorCode] || res.errorMsg) : "提交失败"));

                submitAt(index + 1);
            });
        }

        submitAt(0);

        return false;
    });

    $("#belongTranSubmitModal").on('hide.bs.modal', function() {

        tranSubmitState = null;
        $("#belongTranReasonInput").val("");
        $("#belongTranApproverInput").val("");
    });

});
