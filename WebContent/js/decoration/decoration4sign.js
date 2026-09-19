// 签约准备弹窗页: 被装修单列表页 popup4page 加载, params.signPrepare = {orderId, mode(sign/presign), cid}
// 轻操作直调既有接口, 确认签约/预签与页面跳转通过 decoration:signprepare 事件桥回宿主页既有链路
jQuery(function($) {

    var signPrepare = {

        orderId: params.signPrepare.orderId,

        mode: params.signPrepare.mode,

        cid: params.signPrepare.cid,

        data: null,

        info: null
    };

    var DECORATION_STATUS = {
        0: "初始",
        1: "定金",
        2: "预签",
        3: "签约",
        4: "重签",
        5: "废单",
        6: "终止",
        7: "决算",
        8: "完工",
        20: "待审中",
        30: "可终止",
        32: "预签可终止",
        33: "签约可终止"
    };

    var QUOTATION_STATUS = {
        0: "初始",
        1: "锁定",
        2: "审批"
    };

    var QUOTATION_ATTSTATUS = {
        1: "提交",
        2: "审核",
        3: "完成"
    };

    var CONTRACT_STATUS = {
        0: "待签",
        1: "已签",
        2: "无效",
        3: "归档"
    };

    var PROTATION_STATUS = {
        0: "初始",
        2: "锁定",
        3: "审批"
    };

    com.focusPage("#pageTitle").text(signPrepare.mode == "presign" ? "预签准备" : "签约准备");

    queryData();

    // 数据拼装: 全部走既有接口(与后端聚合口径一致), 同步串行取数
    function queryData() {

        var data = {};

        com.post(api.decoration.queryDecorationForCommonByOrderId, {
            "decoration.orderId": signPrepare.orderId
        }, function(res) {

            var decoration = res.decoration || {};

            data.orderId = decoration.orderId;
            data.status = decoration.status;
            data.orderTotalPrice = decoration.orderTotalPrice;
            data.customerName = decoration.customer ? decoration.customer.name : null;
            data.houseNumber = decoration.house ? decoration.house.houseNumber : null;
            data.villageName = decoration.house && decoration.house.village ? decoration.house.village.name : null;
            data.designerName = decoration.designer ? decoration.designer.currentName : null;
        }, function() {
            com.showAlert(com.error, "装修单不存在");
        }, false);

        if (data.status == undefined) return false;

        // 款项: 与签约校验同源接口(收款+合同款+已付款/已确认)
        data.paymentReady = false;
        data.paymentMoney = 0;

        com.post(api.payment.queryDecorationPaymentForContractByOrderId, {
            "decorationPayment.decoration.orderId": signPrepare.orderId
        }, function(res) {

            var payments = res.decorationPayments || [];

            $.each(payments, function(i, payment) {
                data.paymentMoney = utils.accAdd(data.paymentMoney, payment.referMoney || 0);
            });

            data.paymentReady = payments.length > 0;
        }, null, false);

        // 款项明细(全单款项行, 就地展示)
        data.payments = [];

        com.post(api.payment.queryDecorationPaymentByOrderId, {
            "decorationPayment.decoration.orderId": signPrepare.orderId
        }, function(res) {

            data.payments = (res.decorationPayments || []).sort(function(a, b) {
                return (a.sort || 0) - (b.sort || 0);
            });
        }, null, false);

        // 报价: 默认报价
        data.quotationReady = false;

        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": signPrepare.orderId
        }, function(res) {

            var quotation = res.quotation || {};

            if (quotation.qid != null) {
                data.quotationReady = true;
                data.quotationQid = quotation.qid;
                data.quotationStatus = quotation.status;
                data.quotationAttstatus = quotation.attstatus;
                data.quotationTotalPrice = quotation.totalPrice;
                data.quotationVersionName = quotation.version ? quotation.version.name : null;
                data.quotationPriceParts = "优惠内 " + (quotation.disPrice || 0) + " / 优惠外 " + (quotation.undisPrice || 0) + " / 运费 " + (quotation.trafficPrice || 0) + " / 管理费 " + (quotation.managePrice || 0);
            }
        }, function() {}, false);

        // 活动: 存在任一未锁定行即视为未锁定(预签同口径)
        data.activityStatus = -1;

        com.post(api.decoration.queryDecorationActivityByOrderId, {
            "decorationActivity.orderId": signPrepare.orderId
        }, function(res) {

            var activitys = res.decorationActivitys || [];

            if (activitys.length > 0) {

                data.activityStatus = 1;

                $.each(activitys, function(i, activity) {

                    if (activity.daId) {
                        data.activityDaId = activity.daId;
                    }

                    if (activity.activity) {
                        data.activityName = activity.activity.name;
                        data.activityEndTime = activity.activity.endTime;
                    }

                    if (activity.status == 0) {
                        data.activityStatus = 0;
                    }
                });
            }
        }, null, false);

        // 合同: 取最新创建一份的状态
        data.contractStatus = -1;
        data.contractCount = 0;

        com.post(api.decoration.queryDecorationContractByOrderId, {
            "decorationContract.orderId": signPrepare.orderId
        }, function(res) {

            var contracts = res.decorationContracts || [];

            data.contractCount = contracts.length;

            var latest = null;

            $.each(contracts, function(i, contract) {
                if (!latest || contract.dcid > latest.dcid) {
                    latest = contract;
                }
            });

            if (latest != null) {
                data.contractStatus = latest.status;
                data.contractDcid = latest.dcid;
                data.comsignTime = latest.comsignTime;
                data.cussignTime = latest.cussignTime;
            }
        }, null, false);

        // 工程信息: 预计放线时间
        data.constructionInfoReady = false;

        com.post(api.construction.queryConstructionInfoByOrderId, {
            "constructionInfo.orderId": signPrepare.orderId
        }, function(res) {

            if (res.constructionInfo && res.constructionInfo.orderId) {
                data.constructionInfoReady = true;
                data.drawlineTime = res.constructionInfo.drawlineTime;
            }
        }, function() {}, false);

        // 审批: 未处理数(pageApproval 计数, 前端参考口径, 签约硬拦仍由后端 140037 兜底)
        data.approvalCount = 0;

        com.post(api.approval.pageApproval, {
            "paging.page": 1,
            "paging.rows": 1,
            "filters[0].field": "ident",
            "filters[0].data": signPrepare.orderId,
            "filters[0].op": "eq",
            "filters[1].field": "status",
            "filters[1].data": 0,
            "filters[1].op": "eq"
        }, function(res) {
            data.approvalCount = res.paging ? (res.paging.totalRecords || 0) : 0;
        }, null, false);

        // 预签报价
        data.protationStatus = -1;

        com.post(api.quotation.queryProtationForDefaultByOrderId, {
            "protation.orderId": signPrepare.orderId
        }, function(res) {

            var protation = res.protation || {};

            if (protation.pid != null) {
                data.protationPid = protation.pid;
                data.protationStatus = protation.status;
                data.protationTotalPrice = protation.totalPrice;
            }
        }, function() {}, false);

        // 就绪汇总: 与 sign/presign 校验零漂移
        data.signReady = [0, 1, 2, 4].indexOf(data.status) != -1 && data.paymentReady && data.quotationReady && data.constructionInfoReady && data.drawlineTime != null && data.approvalCount == 0;
        data.presignReady = [0, 1, 2].indexOf(data.status) != -1 && data.activityStatus == 1 && data.protationStatus == 2;

        signPrepare.data = data;

        renderSummary();
        renderCheckList();
        renderActionRow();
    }

    function renderSummary() {

        var data = signPrepare.data;

        var html = '';
        html += '<div class="row">';
        html += '<div class="col-sm-3"><strong>订单号:</strong>' + data.orderId + '</div>';
        html += '<div class="col-sm-2"><strong>状态:</strong>' + (DECORATION_STATUS[data.status] || data.status) + '</div>';
        html += '<div class="col-sm-2"><strong>客户:</strong>' + (data.customerName || '-') + '</div>';
        html += '<div class="col-sm-3"><strong>楼盘:</strong>' + (data.villageName || '-') + ' ' + (data.houseNumber || '') + '</div>';
        html += '<div class="col-sm-2"><strong>设计师:</strong>' + (data.designerName || '-') + '</div>';
        html += '</div>';
        html += '<div class="row">';
        html += '<div class="col-sm-4"><strong>订单总额:</strong>' + (data.orderTotalPrice || 0) + ' 元</div>';
        html += '<div class="col-sm-4"><strong>已收合同款:</strong>' + (data.paymentMoney || 0) + ' 元</div>';
        html += '<div class="col-sm-4">' + (signPrepare.mode == "presign" ? '<strong>预签报价:</strong>' + (data.protationTotalPrice || 0) + ' 元' : '<strong>默认报价:</strong>' + (data.quotationTotalPrice || 0) + ' 元') + '</div>';
        html += '</div>';

        com.focusPage("#summaryInfo").html(html);
    }

    function renderCheckList() {

        var data = signPrepare.data;

        var items = signPrepare.mode == "presign" ? buildPresignItems(data) : buildSignItems(data);

        var html = '';

        $.each(items, function(i, item) {
            html += buildItemHtml(item);
        });

        com.focusPage("#checkList").html(html);
    }

    // 正式签约 8 项, 硬条件与 signDecorationContract 校验零漂移
    function buildSignItems(data) {

        var items = [];

        items.push({
            state: [0, 1, 2, 4].indexOf(data.status) != -1 ? "ok" : "fail",
            title: "订单状态可签",
            value: "当前状态: " + (DECORATION_STATUS[data.status] || data.status),
            desc: "签约要求订单处于 初始/定金/预签/重签 状态"
        });

        var paymentStatusText = ["未付款", "已付款", "已确认", "审批中", "历史"];

        var paymentDetail = "";

        $.each(data.payments || [], function(i, payment) {
            paymentDetail += '<div style="font-size:12px;">' + (i + 1) + '. ' + (payment.paymentType || '-') + ' : 应收 ' + (payment.referMoney || 0) + ' 元 / ' + (paymentStatusText[payment.paymentStatus] || payment.paymentStatus) + '</div>';
        });

        if (paymentDetail == "") {
            paymentDetail = '<div style="font-size:12px;">该单尚无款项行</div>';
        }

        items.push({
            state: data.paymentReady ? "ok" : "fail",
            title: "合同款已收",
            value: data.paymentReady ? "已收合同款: " + (data.paymentMoney || 0) + " 元" : "尚无已付款/已确认的合同款",
            desc: "签约前必须存在已付款或已确认的合同款(收款类); 收款请在装修款页面完成",
            detail: paymentDetail,
            btns: [{
                act: "goto-payment",
                label: "去装修款页",
                clazz: "btn-info"
            }]
        });

        var quotationValue = "暂无默认报价";

        if (data.quotationReady) {
            quotationValue = "报价: " + (data.quotationVersionName || "-") + " / 总额 " + (data.quotationTotalPrice || 0) + " 元 / " + (QUOTATION_STATUS[data.quotationStatus] || data.quotationStatus) + "(审核" + (QUOTATION_ATTSTATUS[data.quotationAttstatus] || data.quotationAttstatus) + ")";
        }

        var quotationBtns = [];

        if (!data.quotationReady) {
            quotationBtns.push({
                act: "refresh-quotation",
                label: "刷新",
                clazz: "btn-info"
            });
        } else {
            if (data.quotationAttstatus == 3 && data.quotationStatus == 0) {
                quotationBtns.push({
                    act: "lock-quotation",
                    label: "锁定报价",
                    clazz: "btn-pink"
                });
            }
            if (data.quotationStatus == 1) {
                quotationBtns.push({
                    act: "unlock-quotation",
                    label: "解锁报价",
                    clazz: "btn-info"
                });
            }
        }

        items.push({
            state: data.quotationReady ? "ok" : "fail",
            title: "默认报价存在",
            value: quotationValue,
            desc: "签约要求存在默认报价; 签约时将自动锁定该单全部报价, 如需签约前锁定防改动可在此手动锁定(需审核完成)" + (data.quotationPriceParts ? "; 构成: " + data.quotationPriceParts : ""),
            btns: quotationBtns
        });

        var activityState = data.activityStatus == 1 ? "ok" : (data.activityStatus == 0 ? "warn" : "na");
        var activityValue = data.activityStatus == -1 ? "未参加活动" : "活动: " + (data.activityName || "-") + " / " + (data.activityStatus == 1 ? "已锁定" : "未锁定");

        var activityBtns = [];

        if (data.activityStatus == -1) {
            activityBtns.push({
                act: "join-activity",
                label: "参加活动",
                clazz: "btn-yellow"
            });
        }
        if (data.activityStatus == 0) {
            activityBtns.push({
                act: "lock-activity",
                label: "锁定活动",
                clazz: "btn-pink"
            }, {
                act: "change-activity",
                label: "换活动",
                clazz: "btn-yellow"
            });
        }
        if (data.activityStatus == 1) {
            activityBtns.push({
                act: "unlock-activity",
                label: "解锁活动",
                clazz: "btn-info"
            });
        }

        items.push({
            state: activityState,
            title: "活动已锁定(建议)",
            value: activityValue,
            desc: "正式签约不强制校验活动; 但活动锁定后不可误删误改, 且预签必须先锁定活动, 建议签约前完成锁定" + (data.activityEndTime ? "; 活动有效期至: " + String(data.activityEndTime).substring(0, 10) : ""),
            btns: activityBtns
        });

        var contractState = (data.contractStatus == 1 || data.contractStatus == 3) ? "ok" : "warn";
        var contractValue = data.contractStatus == -1 ? "尚未创建电子合同" : "合同: " + (CONTRACT_STATUS[data.contractStatus] || data.contractStatus) + (data.contractCount > 1 ? "(共" + data.contractCount + "份, 展示最新)" : "");

        var contractBtns = [];

        if (data.contractStatus == -1) {
            contractBtns.push({
                act: "create-contract",
                label: "创建合同",
                clazz: "btn-yellow"
            });
        } else if (data.contractStatus == 0) {
            contractBtns.push({
                act: "company-sign",
                label: "公司签",
                clazz: "btn-purple"
            }, {
                act: "customer-sign",
                label: "客户签",
                clazz: "btn-purple"
            }, {
                act: "affix-contract",
                label: "确认已签",
                clazz: "btn-success"
            }, {
                act: "expire-contract",
                label: "废止",
                clazz: "btn-inverse"
            });
        }
        if (data.contractStatus != -1) {
            contractBtns.push({
                act: "view-contract",
                label: "查看合同",
                clazz: "btn-white"
            });
        }

        items.push({
            state: contractState,
            title: "电子合同已签署(建议)",
            value: contractValue,
            desc: "电子合同与订单签约相互独立, 签约不校验合同; 建议签约前完成合同创建与签署(公司签选择签章, 客户签打开签署页)",
            btns: contractBtns
        });

        var drawlineBtns = [{
            act: "set-drawlinetime",
            label: data.drawlineTime ? "修改放线时间" : "设置放线时间",
            clazz: "btn-yellow"
        }, {
            act: "applay-drawline",
            label: "申请放线",
            clazz: "btn-yellow"
        }];

        items.push({
            state: data.drawlineTime ? "ok" : "fail",
            title: "预计放线时间已配置",
            value: data.drawlineTime ? "预计放线时间: " + String(data.drawlineTime).substring(0, 10) : "工程信息中未配置预计放线时间",
            desc: "签约硬性要求; 可在此直接设置, 或在放线处理页配置",
            btns: drawlineBtns
        });

        items.push({
            state: data.constructionInfoReady ? "ok" : "fail",
            title: "工程信息存在",
            value: data.constructionInfoReady ? "工程信息已存在" : "工程信息不存在",
            desc: "签约硬性要求, 缺失请在工程信息页补建"
        });

        items.push({
            state: data.approvalCount == 0 ? "ok" : "fail",
            title: "审批已清零",
            value: data.approvalCount == 0 ? "无未处理审批" : "存在 " + data.approvalCount + " 条未处理审批",
            desc: "签约要求订单无未处理审批项, 请先处理完相关审批后再回本页签约"
        });

        return items;
    }

    // 预签 6 项, 硬条件与 presignDecorationContract 校验零漂移
    function buildPresignItems(data) {

        var items = [];

        items.push({
            state: [0, 1, 2].indexOf(data.status) != -1 ? "ok" : "fail",
            title: "订单状态可预签",
            value: "当前状态: " + (DECORATION_STATUS[data.status] || data.status),
            desc: "预签要求订单处于 初始/定金/预签 状态"
        });

        var activityBtns = [];

        if (data.activityStatus == -1) {
            activityBtns.push({
                act: "join-activity",
                label: "参加活动",
                clazz: "btn-yellow"
            });
        }
        if (data.activityStatus == 0) {
            activityBtns.push({
                act: "change-activity",
                label: "换活动",
                clazz: "btn-yellow"
            });
        }

        items.push({
            state: data.activityStatus != -1 ? "ok" : "fail",
            title: "已参加活动",
            value: data.activityStatus == -1 ? "尚未参加活动" : "活动: " + (data.activityName || "-"),
            desc: "预签要求订单已参加活动(每单限一个活动)",
            btns: activityBtns
        });

        var lockBtns = [];

        if (data.activityStatus == 0) {
            lockBtns.push({
                act: "lock-activity",
                label: "锁定活动",
                clazz: "btn-pink"
            });
        }
        if (data.activityStatus == 1) {
            lockBtns.push({
                act: "unlock-activity",
                label: "解锁活动",
                clazz: "btn-info"
            });
        }

        items.push({
            state: data.activityStatus == 1 ? "ok" : "fail",
            title: "活动已锁定",
            value: data.activityStatus == -1 ? "未参加活动" : (data.activityStatus == 1 ? "活动已锁定" : "活动未锁定"),
            desc: "预签硬性要求, 活动锁定后不可删除不可再申领物品",
            btns: lockBtns
        });

        items.push({
            state: data.protationStatus != -1 ? "ok" : "fail",
            title: "预签报价存在",
            value: data.protationStatus != -1 ? "预签报价总额: " + (data.protationTotalPrice || 0) + " 元" : "尚无预签报价",
            desc: "预签要求存在默认预签报价(protation), 请在预签报价页完成创建与编辑"
        });

        var protationBtns = [];

        if (data.protationStatus == 0) {
            protationBtns.push({
                act: "lock-protation",
                label: "锁定预签报价",
                clazz: "btn-pink"
            });
        }
        if (data.protationStatus == 2) {
            protationBtns.push({
                act: "unlock-protation",
                label: "解锁预签报价",
                clazz: "btn-info"
            });
        }

        items.push({
            state: data.protationStatus == 2 ? "ok" : "fail",
            title: "预签报价已锁定",
            value: data.protationStatus != -1 ? "预签报价状态: " + (PROTATION_STATUS[data.protationStatus] || data.protationStatus) : "尚无预签报价",
            desc: "预签要求预签报价处于锁定状态, 可在此直接锁定",
            btns: protationBtns
        });

        var paymentStatusText = ["未付款", "已付款", "已确认", "审批中", "历史"];

        var paymentDetail = "";

        $.each(data.payments || [], function(i, payment) {
            paymentDetail += '<div style="font-size:12px;">' + (i + 1) + '. ' + (payment.paymentType || '-') + ' : 应收 ' + (payment.referMoney || 0) + ' 元 / ' + (paymentStatusText[payment.paymentStatus] || payment.paymentStatus) + '</div>';
        });

        if (paymentDetail == "") {
            paymentDetail = '<div style="font-size:12px;">该单尚无款项行</div>';
        }

        items.push({
            state: data.paymentReady ? "ok" : "warn",
            title: "款项参考(建议)",
            value: data.paymentReady ? "已收合同款: " + (data.paymentMoney || 0) + " 元" : "尚无已收合同款",
            desc: "预签不强制校验收款, 仅作签约进度参考; 收款请在装修款页面完成",
            detail: paymentDetail,
            btns: [{
                act: "goto-payment",
                label: "去装修款页",
                clazz: "btn-info"
            }]
        });

        return items;
    }

    function buildItemHtml(item) {

        var stateClass = item.state == "ok" ? "alert-success" : (item.state == "fail" ? "alert-danger" : (item.state == "warn" ? "alert-warning" : ""));
        var stateIcon = item.state == "ok" ? "✓" : (item.state == "fail" ? "✗" : (item.state == "warn" ? "!" : "—"));

        var html = '';
        html += '<div class="alert ' + stateClass + '" style="margin-bottom:8px;padding:8px 12px;">';
        html += '<div><strong style="font-size:14px;">' + stateIcon + ' ' + item.title + '</strong>&nbsp;&nbsp;<span>' + item.value + '</span></div>';
        html += '<div style="color:#999;font-size:12px;margin:2px 0 4px 0;">' + item.desc + '</div>';

        if (item.detail) {
            html += '<div style="margin:0 0 4px 8px;">' + item.detail + '</div>';
        }

        if (item.btns && item.btns.length > 0) {
            html += '<div>';
            $.each(item.btns, function(i, btn) {
                html += '<button type="button" class="btn btn-minier ' + btn.clazz + '" style="margin-right:6px;" data-act="' + btn.act + '">' + btn.label + '</button>';
            });
            html += '</div>';
        }

        html += '</div>';

        return html;
    }

    function renderActionRow() {

        var data = signPrepare.data;

        var html = '';

        if (signPrepare.mode == "presign") {
            if (data.presignReady) {
                html += '<button type="button" class="btn btn-danger btn-sm" data-act="do-presign"><i class="icon-edit bigger-110"></i> 确认预签</button>';
                html += '&nbsp;&nbsp;<span class="green">前置条件全部满足, 可以预签</span>';
            } else {
                html += '<button type="button" class="btn btn-danger btn-sm disabled" disabled="disabled"><i class="icon-edit bigger-110"></i> 确认预签</button>';
                html += '&nbsp;&nbsp;<span class="red">存在未满足的硬性条件(红色项), 满足后方可预签</span>';
            }
        } else {
            if (data.signReady) {
                html += '<button type="button" class="btn btn-danger btn-sm" data-act="do-sign"><i class="icon-edit bigger-110"></i> 确认签约</button>';
                html += '&nbsp;&nbsp;<span class="green">硬性条件全部满足, 可以签约</span>';
            } else {
                html += '<button type="button" class="btn btn-danger btn-sm disabled" disabled="disabled"><i class="icon-edit bigger-110"></i> 确认签约</button>';
                html += '&nbsp;&nbsp;<span class="red">存在未满足的硬性条件(红色项), 满足后方可签约</span>';
            }
        }

        com.focusPage("#actionRow").html(html);
    }

    // 轻操作与动作分发(事件委托)
    com.focusPage("#checkList").add(com.focusPage("#actionRow")).on("click", "button[data-act]", function() {

        var act = $(this).attr("data-act");

        var data = signPrepare.data;

        if (act == "lock-quotation") {

            com.post(api.quotation.lockQuotation, {
                "quotation.qid": data.quotationQid
            }, function() {
                com.showAlert(com.info, "报价已锁定");
                queryData();
            });

        } else if (act == "unlock-quotation") {

            com.post(api.quotation.unlockQuotation, {
                "quotation.qid": data.quotationQid
            }, function() {
                com.showAlert(com.info, "报价已解锁");
                queryData();
            });

        } else if (act == "lock-activity") {

            com.post(api.decoration.lockDecorationActivity, {
                "decorationActivity.daId": data.activityDaId
            }, function() {
                com.showAlert(com.info, "活动已锁定");
                queryData();
            });

        } else if (act == "unlock-activity") {

            com.post(api.decoration.unlockDecorationActivity, {
                "decorationActivity.daId": data.activityDaId
            }, function() {
                com.showAlert(com.info, "活动已解锁");
                queryData();
            });

        } else if (act == "change-activity") {

            com.showConfirm("更换活动需先删除当前活动(未锁定), 删除后可重新参加, 确认删除?", function() {

                com.post(api.decoration.deleteDecorationActivity, {
                    "decorationActivity.daId": data.activityDaId
                }, function() {
                    com.showAlert(com.info, "活动已删除, 可重新参加");
                    queryData();
                });
            });

        } else if (act == "refresh-quotation") {

            queryData();

        } else if (act == "company-sign") {

            com.post(api.data.querySignet, {}, function(res) {

                com.focusPage("#signetSel").bindData(res.signets, "sid", "name", false);

                com.focusPage("#companySignModal").modal("show");
            }, null, false);

        } else if (act == "view-contract") {

            com.post(api.decoration.viewDecorationContract, {
                "decorationContract.dcid": data.contractDcid
            }, function(res) {
                com.popup4frame("合同查看", res.redirect);
            });

        } else if (act == "lock-protation") {

            com.post(api.quotation.lockProtation, {
                "protation.pid": data.protationPid
            }, function() {
                com.showAlert(com.info, "预签报价已锁定");
                queryData();
            });

        } else if (act == "unlock-protation") {

            com.post(api.quotation.unlockProtation, {
                "protation.pid": data.protationPid
            }, function() {
                com.showAlert(com.info, "预签报价已解锁");
                queryData();
            });

        } else if (act == "join-activity") {

            com.post(api.information.queryActivityForValid, {
                "activity.type": 1
            }, function(res) {

                var activityData = [{
                    aid: -1,
                    activityName: ""
                }];

                $.each(res.activitys || [], function(i, activity) {
                    activityData.push({
                        aid: activity.aid,
                        activityName: activity.name
                    });
                });

                com.focusPage("#activityInfo").bindData(activityData, "aid", "activityName", false);
            }, null, false);

            com.focusPage("#joinActivityModal").modal("show");

        } else if (act == "create-contract") {

            params.decoration = params.decoration || {};
            params.decoration.orderId = signPrepare.orderId;
            params.customer = params.customer || {};
            params.customer.cid = signPrepare.cid;

            com.popup4page("#signLayerPopUp", "/views/decoration/decorationContract2create.html", "创建合同", null, function() {
                queryData();
            });

        } else if (act == "customer-sign") {

            com.post(api.decoration.signDecorationContractForCustomer, {
                "decorationContract.dcid": data.contractDcid,
                "customer.cid": signPrepare.cid
            }, function(res) {
                com.popup4frame("客户签", res.redirect);
            });

        } else if (act == "affix-contract") {

            com.showConfirm("是否已签合同?", function() {
                com.post(api.decoration.affixDecorationContract, {
                    "decorationContract.dcid": data.contractDcid
                }, function() {
                    com.showAlert(com.info, "操作成功");
                    queryData();
                });
            });

        } else if (act == "expire-contract") {

            com.showConfirm("是否失效合同?", function() {
                com.post(api.decoration.expireDecorationContract, {
                    "decorationContract.dcid": data.contractDcid
                }, function() {
                    com.showAlert(com.info, "操作成功");
                    queryData();
                });
            });

        } else if (act == "set-drawlinetime") {

            com.post(api.construction.queryConstructionInfoByOrderId, {
                "constructionInfo.orderId": signPrepare.orderId
            }, function(res) {

                signPrepare.info = res.constructionInfo;

                com.focusPage("#drawlineTime").val(signPrepare.info.drawlineTime ? signPrepare.info.drawlineTime.substring(0, 10) : "");
                com.focusPage("#drawlineTimeModal").modal("show");
            }, null, false);

        } else if (act == "applay-drawline") {

            com.focusPage("#applayDes").val("");
            com.focusPage("#applayTime").val("");
            com.focusPage("#applayDrawLineModal").modal("show");

        } else if (act == "do-sign" || act == "do-presign") {

            $(document).trigger("decoration:signprepare", {
                action: act == "do-sign" ? "sign" : "presign"
            });

        } else if (act.indexOf("goto-") == 0) {

            $(document).trigger("decoration:signprepare", {
                action: "goto",
                page: act.substring(5)
            });
        }
    });

    // 设置预计放线时间: 先查回填再全量回传(drawline4apply 同款口径)
    com.focusPage("#drawlineTimeSaveBtn").on("click", function() {

        var drawlineTime = com.focusPage("#drawlineTime");

        if (drawlineTime.val() == "") {
            com.showAlert(com.error, "请选择预计放线时间");
            return false;
        }

        var info = signPrepare.info || {};

        var options = {
            "constructionInfo.orderId": signPrepare.orderId,
            "constructionInfo.decoration.orderId": signPrepare.orderId,
            "constructionInfo.timeLimit": info.timeLimit,
            "constructionInfo.ishovel": info.ishovel,
            "constructionInfo.iskey": info.iskey,
            "constructionInfo.isCeremony": info.isCeremony,
            "constructionInfo.finishTime": info.finishTime,
            "constructionInfo.keyTime": info.keyTime,
            "constructionInfo.designTime": info.designTime,
            "constructionInfo.comment": info.comment,
            "constructionInfo.drawlineTime": drawlineTime.val() + " 00:00:00"
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function() {
            com.showAlert(com.info, "预计放线时间已保存");
            com.focusPage("#drawlineTimeModal").modal("hide");
            queryData();
        });
    });

    // 申请放线
    com.focusPage("#applayDrawLineBtn").on("click", function() {

        if (com.validate("applayDrawLineModal")) {
            return false;
        }

        com.showConfirm("确认申请放线吗?", function() {

            com.post(api.construction.applayDrawLine, {
                "drawLine.content": com.focusPage("#applayDes").val(),
                "drawLine.applayTime": com.focusPage("#applayTime").val() + " 00:00:00",
                "drawLine.decoration.orderId": signPrepare.orderId
            }, function() {
                com.showAlert(com.info, "放线申请已提交");
                com.focusPage("#applayDrawLineModal").modal("hide");
            });
        });
    });

    // 公司签: 选签章后提交
    com.focusPage("#companySignSaveBtn").on("click", function() {

        if (com.validate("companySignModal")) {
            return false;
        }

        com.post(api.decoration.signDecorationContractForCompany, {
            "decorationContract.dcid": signPrepare.data.contractDcid,
            "signet.sid": com.focusPage("#signetSel").val()
        }, function() {
            com.showAlert(com.info, "公司签已完成");
            com.focusPage("#companySignModal").modal("hide");
            queryData();
        });
    });

    // 保存参加活动
    com.focusPage("#submitDecorationActivityBtn").on("click", function() {

        var aid = com.focusPage("#activityInfo").val();

        if (aid == -1 || aid == null) {
            com.showAlert(com.error, "请选择活动");
            return false;
        }

        com.post(api.decoration.addDecorationActivity, {
            "decorationActivity.orderId": signPrepare.orderId,
            "decorationActivity.activity.aid": aid
        }, function() {
            com.showAlert(com.info, "参加活动成功");
            com.focusPage("#joinActivityModal").modal("hide");
            queryData();
        });
    });
});
