jQuery(function($) {

    var decorationBelong = {
        decorationType: {},

        decorationOrderStatus: {}
    };

    decorationBelong.decorationOrderStatus = constant.decoration().decoration.status.keys;
    decorationBelong.decorationType = constant.decoration().decoration.typeness.keys;

    function getBelongPropertyArr(v) {

        return [["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"], ["客户名:", v.customer.name, "grey"], ["设计部:", v.designer.dept.name, "grey"], ["设计师:", v.designer.currentName, "grey"], ["业务部:", v.salesman.dept.name, "grey"], ["业务员:", v.salesman.currentName, "grey"], ["面积:", v.house.buildArea, "blue"], ["合同报价:", v.orderTotalPrice, "blue"], ["量房时间:", v.measureTime, "green"], ["类型:", decorationBelong.decorationType[v.type], "red"], ["状态:", decorationBelong.decorationOrderStatus[v.status], "red"]];
    }

    var lineprops = (function() {

        return [{
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
        }];
    })();

    var linebtns = (function() {

        return {
            look: {name: "查看", clazz: "btn-success", handle: function(v) { viewDecorationBelongDetail(v.orderId); }},
            design: {name: "设计", clazz: "btn-yellow", handle: function(v) { changeDecorationBelongDesigner(v.orderId); }},
            salesman: {name: "业务", clazz: "btn-primary", handle: function(v) { changeDecorationBelongBussiness(v.orderId); }}
        };
    })();

    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-houseArea', 'decoration-designer', 'decoration-salesman', 'decoration-type', 'decoration-salesType'];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationForBelong, null, _condArr, "decorationBelongPostData");
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

    /* ====================== 离职移交(BelongTran) ====================== */

    // 草稿=页面变量+sessionStorage 双层(翻页局刷变量存活; 菜单跳页/F5 靠 sessionStorage 恢复), TTL 24h 过期即弃
    var TRAN_DRAFT_KEY = "belongTranDraft";
    var TRAN_META_KEY = "belongTranDraftMeta";
    var TRAN_TTL = 24 * 60 * 60 * 1000;

    var tran = {
        userId: null,
        userName: "",
        belongType: 0, // 0设计 1业务
        page: 0,
        rows: 20,
        totalRecords: 0,
        list: [],
        checked: {},
        newUser: null,
        approverId: null,
        usersLoaded: false,
        users: []
    };

    var tranDrafts = JSON.parse(sessionStorage.getItem(TRAN_DRAFT_KEY)) || {};
    var tranMeta = JSON.parse(sessionStorage.getItem(TRAN_META_KEY)) || {};

    function tranGroupKey() {

        return tran.userId + "|" + tran.belongType;
    }

    function tranDraftKey(orderId) {

        return tranGroupKey() + "|" + orderId;
    }

    function tranSaveDrafts() {

        sessionStorage.setItem(TRAN_DRAFT_KEY, JSON.stringify(tranDrafts));
        sessionStorage.setItem(TRAN_META_KEY, JSON.stringify(tranMeta));
    }

    // 过期组惰性清理: 打开页面与每次存取时剔除超TTL的组条目, 防陈旧草稿跨天误提
    function tranPurgeExpired() {

        var now = new Date().getTime();

        for (var gk in tranMeta) {

            if (now - tranMeta[gk] > TRAN_TTL) {

                delete tranMeta[gk];

                for (var dk in tranDrafts) {

                    if (dk.indexOf(gk + "|") == 0) delete tranDrafts[dk];
                }
            }
        }

        tranSaveDrafts();
    }

    function tranGroupDraftCount() {

        var count = 0;
        var prefix = tranGroupKey() + "|";

        for (var dk in tranDrafts) {

            if (dk.indexOf(prefix) == 0) count++;
        }

        return count;
    }

    function tranCheckedOrders() {

        var orders = [];

        for (var orderId in tran.checked) {

            if (tran.checked[orderId]) orders.push(orderId);
        }

        return orders;
    }

    function tranSwitchMode(tranMode) {

        $("#dailyPanel").toggle(!tranMode);
        $("#tranPanel").toggle(tranMode);
        $("#dailyModeBtn").toggleClass("btn-primary", !tranMode).toggleClass("btn-default", tranMode);
        $("#tranModeBtn").toggleClass("btn-primary", tranMode).toggleClass("btn-default", !tranMode);

        if (tranMode) {

            tranPurgeExpired();

            if (!tran.usersLoaded) tranLoadUsers();
            else if (tran.userId) $("#tranUserListWrap").hide();
        }
    }

    function tranLoadUsers(keyword) {

        com.post(api.decoration.queryDecorationBelongForTran, keyword ? {
            "keyword": keyword
        } : {}, function(res) {

            tran.users = res.decorationBelongTranUsers || [];
            tran.usersLoaded = true;

            var $body = $("#tranUserList").empty();

            if (tran.users.length == 0) $body.append('<tr><td colspan="5" class="text-center grey">暂无可移交归属单</td></tr>');

            $.each(tran.users, function(i, v) {

                var $tr = $('<tr></tr>');

                $('<td></td>').text(v.userName).appendTo($tr);
                $('<td></td>').text(v.deptName || "").appendTo($tr);
                $('<td></td>').text(v.designCount + " 单").appendTo($tr);
                $('<td></td>').text(v.salesCount + " 单").appendTo($tr);
                $('<td></td>').append($('<button type="button" class="btn btn-xs btn-primary">选择</button>').on('click', function() { tranPickBelonger(v); })).appendTo($tr);

                $tr.appendTo($body);
            });
        });
    }

    function tranPickBelonger(u) {

        tran.userId = u.userId;
        tran.userName = u.userName;
        tran.page = 0;
        tran.checked = {};
        tran.newUser = null;

        $("#tranUserListWrap").hide();
        $("#tranOrderWrap").show();

        $("#tranBelongerInput").val(u.userName);
        $("#tranBelongerInfo").html(u.userName + "(" + (u.deptName || "") + ") · 设计" + u.designCount + "单/业务" + u.salesCount + "单" + ' <a href="javascript:void(0)" id="tranRepickLink" style="color:#2679b5">[重选移交人]</a>');

        $("#tranRepickLink").on('click', function() {

            $("#tranUserListWrap").show();
            $("#tranBelongerInput").val("").trigger('focus');
        });

        if (tranGroupDraftCount() > 0) com.showAlert(com.info, "本组存在未提交草稿 " + tranGroupDraftCount() + " 条(24小时内有效),列表中蓝色即草稿");

        tranLoadList();
    }

    function tranLoadList() {

        if (!tran.userId) return;

        com.post(api.decoration.pageDecorationForTranByBelonger, {
            "paging.page": tran.page,
            "paging.rows": tran.rows,
            "decorationBelong.belonger.userId": tran.userId,
            "decorationBelong.type": tran.belongType
        }, function(res) {

            var paging = res.paging || {};

            tran.list = paging.data || [];
            tran.totalRecords = paging.totalRecords || 0;

            // 翻页后越页回退
            if (tran.list.length == 0 && tran.page > 0) {

                tran.page = 0;
                tranLoadList();
                return;
            }

            tranRenderTable();
        });
    }

    function tranRenderTable() {

        var $body = $("#tranTableBody").empty();

        if (tran.list.length == 0) {
            $body.append('<tr><td colspan="8" class="text-center grey">无可移交单据(状态不符或已在途移交)</td></tr>');
            $("#tranAssignBtn").prop("disabled", true);
            tranUpdateDraftInfo();
            return;
        }

        $.each(tran.list, function(i, v) {

            var draft = tranDrafts[tranDraftKey(v.orderId)];
            var checked = !!tran.checked[v.orderId];

            var $tr = $('<tr></tr>');

            $('<td><input type="checkbox"/></td>').find("input").prop("checked", checked).on('change', function() {
                tran.checked[v.orderId] = this.checked;
                $("#tranAssignBtn").prop("disabled", tranCheckedOrders().length == 0);
            }).end().appendTo($tr);

            $('<td></td>').text(v.orderId).appendTo($tr);
            $('<td class="grey"></td>').text(v.customerName || "").appendTo($tr);
            $('<td class="red"></td>').text(decorationBelong.decorationOrderStatus[v.status] || v.status).appendTo($tr);
            $('<td></td>').text((v.rate / 10) + "%").appendTo($tr);
            $('<td></td>').text(v.defaultFlag == 1 ? "默认" : "否").appendTo($tr);

            var $draftTd = $('<td></td>');

            if (draft) $draftTd.append($('<span class="label label-primary"></span>').text(draft.userName + " " + Math.round(draft.rate * 100) + "%" + (draft.defaultFlag == 1 ? " 默认" : "")));
            else $draftTd.addClass("grey").text("-");

            $draftTd.appendTo($tr);

            $('<td></td>').append($('<button type="button" class="btn btn-xs btn-default">撤稿</button>').on('click', function() {

                delete tranDrafts[tranDraftKey(v.orderId)];
                tranSaveDrafts();
                tranRenderTable();
            })).appendTo($tr);

            $tr.appendTo($body);
        });

        $("#tranCheckAllHead").prop("checked", false);
        $("#tranAssignBtn").prop("disabled", tranCheckedOrders().length == 0);

        var totalPage = Math.max(Math.ceil(tran.totalRecords / tran.rows), 1);

        $("#tranPageInfo").text((tran.page + 1) + "/" + totalPage + " 页 共" + tran.totalRecords + "单");
        $("#tranPrevBtn").prop("disabled", tran.page <= 0);
        $("#tranNextBtn").prop("disabled", (tran.page + 1) >= totalPage);

        tranUpdateDraftInfo();
    }

    function tranUpdateDraftInfo() {

        $("#tranDraftInfo").text("当前组草稿 " + tranGroupDraftCount() + " 条");
    }

    $("#tranCheckAllHead").on('change', function() {

        var flag = this.checked;

        tran.checked = {};

        $("#tranTableBody input[type=checkbox]").prop("checked", flag).each(function(i) {

            if (flag) tran.checked[tran.list[i].orderId] = true;
        });

        $("#tranAssignBtn").prop("disabled", tranCheckedOrders().length == 0);
    });

    $("#tranPrevBtn").on('click', function() {

        if (tran.page > 0) {

            tran.page -= 1;
            tran.checked = {};
            tranLoadList();
        }
    });

    $("#tranNextBtn").on('click', function() {

        tran.page += 1;
        tran.checked = {};
        tranLoadList();
    });

    $("#tranClearBtn").on('click', function() {

        var prefix = tranGroupKey() + "|";

        for (var dk in tranDrafts) {

            if (dk.indexOf(prefix) == 0) delete tranDrafts[dk];
        }

        delete tranMeta[tranGroupKey()];

        tran.checked = {};
        tranSaveDrafts();
        tranRenderTable();
    });

    /* ---- 指派 modal ---- */

    com.initTypeahead('tranNewUserInput', api.personel.queryUserByPinyin, "pinyinName", {
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
                return;
            }

            tran.newUser = {
                userId: res.user.userId,
                uid: res.user.uid,
                currentName: res.user.currentName,
                deptName: res.user.dept.name,
                regionName: res.user.dept.fatherDept.name
            };

            $("#tranNewUserName").val(res.user.currentName);
            $("#tranNewUserDept").val(res.user.dept.name);
            $("#tranNewUserRegion").val(res.user.dept.fatherDept.name);
        });

        return value;
    });

    $("#tranAssignBtn").on('click', function() {

        var orders = tranCheckedOrders();

        if (orders.length == 0) return false;

        // 预填: 以首个勾选行推导推荐比例(签约3/重签4→0; 其余→1), 默认人=首行现行默认态
        var first = null;

        for (var i = 0; i < tran.list.length; i++) {

            if (tran.checked[tran.list[i].orderId]) {

                first = tran.list[i];
                break;
            }
        }

        if (first) {

            $("#tranRateInput").val(first.status == 3 || first.status == 4 ? 0 : 1);
            $("#tranDefaultFlagInput").prop("checked", first.defaultFlag == 1);
        }

        $("#tranAssignModal").modal("show");

        return false;
    });

    $("#tranAssignOkBtn").on('click', function() {

        if (tran.newUser == null) {

            com.showAlert(com.error, "请先选择接手人");
            return false;
        }

        var rate = parseFloat($("#tranRateInput").val());
        var defaultFlag = $("#tranDefaultFlagInput").prop("checked") ? 1 : 0;

        if (isNaN(rate) || rate < 0 || rate > 1) {

            com.showAlert(com.error, "归属比例须在0~1之间");
            return false;
        }

        var groupKey = tranGroupKey();
        tranMeta[groupKey] = new Date().getTime();

        $.each(tranCheckedOrders(), function(i, orderId) {

            tranDrafts[groupKey + "|" + orderId] = {
                userId: tran.newUser.userId,
                userName: tran.newUser.currentName,
                deptName: tran.newUser.deptName,
                regionName: tran.newUser.regionName,
                rate: rate,
                defaultFlag: defaultFlag
            };
        });

        tranSaveDrafts();

        $("#tranAssignModal").modal("hide");
        tranRenderTable();
    });

    $("#tranAssignModal").on('hide.bs.modal', function() {

        $("#tranNewUserName,#tranNewUserDept,#tranNewUserRegion").val("");
        $("#tranNewUserInput").val("");
        tran.newUser = null;
    });

    /* ---- 发起审批 modal ---- */

    com.initTypeahead('tranApproverInput', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', function(list, key, value) {

        if (value == null || value == "") {
            return false;
        }

        tran.approverId = key;

        return value;
    });

    // 提交口径=整组草稿(跨页指派累积), 勾选仅作为指派作用范围
    $("#tranSubmitBtn").on('click', function() {

        var groupPrefix = tranGroupKey() + "|";
        var drafted = [];

        for (var dk in tranDrafts) {

            if (dk.indexOf(groupPrefix) == 0) drafted.push(dk.substring(groupPrefix.length));
        }

        if (drafted.length == 0) {

            com.showAlert(com.error, "本组暂无指派草稿,请先勾选单据并指派接手人");
            return false;
        }

        // 默认人唯一性按"每单每类型"口径由后端240091校验(前端无从得知各单保留行默认态, 组内求和口径错误会挡死多单全给一人的主流程); modal预填=原移交人行属性, 常规操作天然合法

        var $sum = $("#tranSubmitSummary").empty();

        $sum.append('<div>移交人:<b>' + tran.userName + '</b> 类型:<b>' + (tran.belongType == 0 ? "设计" : "业务") + '</b> 单据:<b>' + drafted.length + '</b> 张(整组一次提交,通过=全批生效,驳回=零变更)</div>');

        $.each(drafted, function(i, orderId) {

            var d = tranDrafts[groupPrefix + orderId];

            $sum.append('<div style="margin-left:10px">' + orderId + ' → ' + d.userName + '(' + Math.round(d.rate * 100) + '%' + (d.defaultFlag == 1 ? ',默认' : '') + ')</div>');
        });

        approvalUtils.initqueryApprovalUser("tranApproveManSel", constant.approval().approval.TYPE_BELONG_TRAN_INT);

        $("#tranSubmitModal").modal("show");

        return false;
    });

    $("#tranSubmitOkBtn").on('click', function() {

        var receiverId = $("#tranApproveManSel").find('input:checked').attr("userid") || tran.approverId;

        if (receiverId == null || receiverId == "") {

            com.showAlert(com.error, "请选择审批人");
            return false;
        }

        var options = {};

        options["approval.receiver.userId"] = receiverId;
        options["approvalBelongTran.userId"] = tran.userId;
        options["approvalBelongTran.tranType"] = tran.belongType;
        options["approvalBelongTran.reason"] = $("#tranReasonInput").val() || "";

        var groupPrefix = tranGroupKey() + "|";
        var i = 0;

        for (var dk in tranDrafts) {

            if (dk.indexOf(groupPrefix) != 0) continue;

            var orderId = dk.substring(groupPrefix.length);
            var d = tranDrafts[dk];

            options["approvalBelongTranItems[" + i + "].orderId"] = orderId;
            options["approvalBelongTranItems[" + i + "].belongType"] = tran.belongType;
            options["approvalBelongTranItems[" + i + "].userId"] = d.userId;
            options["approvalBelongTranItems[" + i + "].rate"] = d.rate;
            options["approvalBelongTranItems[" + i + "].defaultFlag"] = d.defaultFlag;

            i++;
        }

        com.post(api.approval.submitApprovalForBelongTran, options, function() {

            for (var dk in tranDrafts) {

                if (dk.indexOf(groupPrefix) == 0) delete tranDrafts[dk];
            }

            delete tranMeta[tranGroupKey()];

            tran.checked = {};
            tranSaveDrafts();

            $("#tranSubmitModal").modal("hide");
            com.showAlert(com.info, "移交审批已提交,审批通过后全批生效");
            tranLoadList();
        });
    });

    /* ---- 移交人检索(接后端keyword: 姓名/拼音/工号) ---- */

    var tranSearchTimer = null;

    $("#tranBelongerInput").on('input', function() {

        var val = $(this).val();

        if (tranSearchTimer) clearTimeout(tranSearchTimer);

        tranSearchTimer = setTimeout(function() {

            $("#tranUserListWrap").show();
            tranLoadUsers(val);
        }, 300);
    });

    /* ---- 模式/类型切换 ---- */

    $("#dailyModeBtn").on('click', function() {

        tranSwitchMode(false);
    });

    $("#tranModeBtn").on('click', function() {

        tranSwitchMode(true);
    });

    $("#tranTypeDesignBtn").on('click', function() {

        tran.belongType = 0;
        $(this).removeClass("btn-default").addClass("btn-primary");
        $("#tranTypeSalesBtn").removeClass("btn-primary").addClass("btn-default");

        if (tran.userId) {

            tran.page = 0;
            tran.checked = {};
            if (tranGroupDraftCount() > 0) com.showAlert(com.info, "切换类型,原类型组草稿 " + tranGroupDraftCount() + " 条已保留,切回可继续");
            tranLoadList();
        }
    });

    $("#tranTypeSalesBtn").on('click', function() {

        tran.belongType = 1;
        $(this).removeClass("btn-default").addClass("btn-primary");
        $("#tranTypeDesignBtn").removeClass("btn-primary").addClass("btn-default");

        if (tran.userId) {

            tran.page = 0;
            tran.checked = {};
            tranLoadList();
        }
    });

});
