jQuery(function($) {

    var approvalTrack = {

        aid: null,
        url: null,
        postData: null,
        condition: [],

        type: ["劵", "物品", "红包"],
        stateType: ["到店", "定金", "签单", "抽奖", "特批", "购买", "其他", "升级"],

        btns: {
            submitBtn: com.focusPage("#submitBtn")
        },

        modals: {
            itemModel: com.focusPage('#itemModel'),
            approveModal: com.focusPage("#approveModal"),
        },

        items: {
            result: com.focusPage('#result'),
            annotate: com.focusPage('#annotate'),
        },

        approvalItemInfo: {
            "6": {
                "api": api.approval.queryApprovalMaterialRefundItem,
                "title": "主材信息",
                "resultname": "approvalMaterialRefundItems",
                "args": [['10', '型号  : ', "materialItem.name"], ['40', '品类  : ', "materialItem.category"], ['40', '品牌  : ', "materialItem.brand"], ['10', '售价  : ', "materialItem.price"], ['40', '退货数量  : ', "num"], ['40', '退货金额  : ', "total"]],
                "caleTotal": ["total"]
            },
            "8": {
                "api": api.approval.queryApprovalDecorationActivity,
                "title": "活动信息",
                "resultname": "approvalDecorationActivityItems",
                "args": [['10', '活动名称  : ', "activityName"], ['40', '活动项  : ', "activityItemName"], ['40', '物品类型  : ', "type"], ['40', '状态类型  : ', "stateType"], ['10', '金额  : ', "money"], ['40', '数量  : ', "num"], ['40', '备注  : ', "content"],

                ],
                "caleTotal": ["money", "num"]
            },
            "10": {
                "api": api.approval.queryApprovalSalesRefundItem,
                "title": "销售信息",
                "resultname": "approvalSalesRefundItem",
                "args": [['10', '名称  : ', "salesItem.goods.name"], ['40', '颜色  : ', "salesItem.color.name"], ['40', '规格  : ', "salesItem.format.info"], ['10', '售价  : ', "salesItem.selling"], ['40', '退货数量  : ', "num"], ['40', '退货金额  : ', "total"]],
                "caleTotal": ["total"]
            },
            "14": {
                "api": api.approval.queryApprovalCustomerOriginTDecoration,
                "title": "客源信息",
                "resultname": "approvalCustomerOriginTDecoration",
                "args": [['10', '城市: ', "customerOrigin.house.village.cityProper.city.name"], ['10', '城区: ', "customerOrigin.house.village.cityProper.name"], ['10', '楼盘: ', "customerOrigin.house.village.name"], ['10', '楼号: ', "customerOrigin.house.houseNumber"], ['10', '面积: ', "customerOrigin.house.buildArea"], ['10', '房屋类型: ', "houseClass"], ['10', '房屋类别: ', "houseType "], ['10', '客户: ', "customerOrigin.customer.name"], ['10', '业务员: ', "salesman.currentName"], ['10', '业务类型: ', "decorationBusitype.name"], ['10', '业务部: ', "salesman.dept.name"], ['10', '设计师: ', "customerOrigin.designer.currentName"], ['10', '设计部: ', "customerOrigin.designer.dept.name"], ['10', '装修单类型: ', "typeness"], ['10', '总面积: ', "customerOrigin.house.totalArea"], ]
            },
            "17": {
                "api": api.approval.queryApprovalCustomerOrigin,
                "title": "客源信息",
                "resultname": "approvalCustomerOrigin",
                "args": [['10', '城市: ', "customerOrigin.house.village.cityProper.city.name"], ['10', '城区: ', "customerOrigin.house.village.cityProper.name"], ['10', '楼盘: ', "customerOrigin.house.village.name"], ['10', '楼号: ', "customerOrigin.house.houseNumber"], ['10', '面积: ', "customerOrigin.house.buildArea"], ['10', '客户: ', "customerOrigin.customer.name"], ['10', '设计师: ', "customerOrigin.designer.currentName"], ['10', '设计部: ', "customerOrigin.designer.dept.name"], ['10', '总面积: ', "customerOrigin.house.totalArea"], ]
            }
        },

        approvalTypeData: {},
        approvalStatus: {},
        typenesses: {},
        submitUrl: null,
    };

    if (params.urlLoadParams.type == 'send') {
        approvalTrack.url = api.approval.pageApprovalForSend;
        approvalTrack.postData = "approvalSenderTrackPostData";
        approvalTrack.condition = ["approval-receiver-name", "approval-type", "approval-status", "approval-createTime", "approval-approvalTime"];
    } else if (params.urlLoadParams.type == 'receive') {
        approvalTrack.url = api.approval.pageApprovalForReceive;
        approvalTrack.postData = "approvalReceiveTrackPostData";
        approvalTrack.condition = ["approval-sender-name", "approval-type", "approval-status", "approval-approvalTime"];
    } else if (params.urlLoadParams.type == 'dept') {
        approvalTrack.url = api.approval.pageApprovalForReceiveDept;
        approvalTrack.postData = "approvalDeptTrackPostData";
        approvalTrack.condition = ["approval-sender-name", "approval-type", "approval-status"];
    }

    approvalTrack.approvalTypeData = constant.approval().approval.type.keys;
    approvalTrack.approvalStatus = constant.approval().approval.status.keys;
    approvalTrack.typenesses = constant.decoration().decoration.typeness.keys;

    approvalTrack.btns.submitBtn.on("click", approve);

    approvalTrack.modals.approveModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(approvalTrack.items);
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", approvalTrack.url);

    searcher.condition(approvalTrack.condition);

    searcher.history(approvalTrack.postData);

    var lineprops = [{
        fieId: "sender.currentName",
        name: "申请人",
        prop: "sender.currentName",
        clazz: "grey"
    }, {
        fieId: "receiver.currentName",
        name: "审批人",
        prop: "receiver.currentName",
        clazz: "grey"
    }, {
        fieId: "createTime",
        name: "提交时间",
        prop: "createTime",
        clazz: "green"
    }, {
        fieId: "approvalTime",
        name: "审批时间",
        prop: "approvalTime",
        clazz: "green"
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        dataset: constant.approval().approval.status.keys,
        clazz: "red"
    }, {
        field: "contents",
        name: "说明",
        prop: "contents",
        clazz: "blue "
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, {
        field: "annotate",
        name: "批注",
        prop: "annotate",
        clazz: "grey"
    }, ];
    var linebtns = [{
        name: "详情",
        handle: function(v) {

            queryInformationItem(v.aid, v.type);
            return false;
        },
        show: function(v) {

            return [constant.approval().approval.TYPE_MATERIAL_REFUND_INT, constant.approval().approval.TYPE_DECORATION_ACTIVITY_INT, constant.approval().approval.TYPE_SALESREFUND_PAYMENT_INT, constant.approval().approval.TYPE_CUSTOMER_ORIGIN_T_DECORATION_INT, constant.approval().approval.TYPE_CUSTOMER_ORIGIN_INT].indexOf(v.type) != -1;
        }
    }, {
        name: "客户确认",
        clazz: "btn-warning",
        handle: function(v) {

            affirm(v.aid);
            return false;
        },
        show: function(v) {

            return false;
        }
    }, {
        name: "通过",
        clazz: "btn-success",
        handle: function(v) {

            proapprove(v.aid, api.approval.approveApproval, "通过");
            return false;
        },
        show: function(v) {

            return [constant.approval().approval.STATUS_INIT_INT, constant.approval().approval.STATUS_CONFIRM_INT, constant.approval().approval.STATUS_CONFIRMED_INT].indexOf(v.status) != -1 && params.urlLoadParams.type != 'send' && v.piid == null;
        }
    }, {
        name: "拒绝",
        clazz: "btn-danger",
        handle: function(v) {

            proapprove(v.aid, api.approval.refuseApproval, "拒绝");
            return false;
        },
        show: function(v) {

            return [constant.approval().approval.STATUS_INIT_INT, constant.approval().approval.STATUS_CONFIRM_INT, constant.approval().approval.STATUS_CONFIRMED_INT].indexOf(v.status) != -1 && params.urlLoadParams.type != 'send' && v.piid == null;
        }
    }, ];

    searcher.line(function(v) {

        return constant.approval().approval.type.keys[v.type];
    }, lineprops, linebtns).render();

    function proapprove(aid, submitUrl, result) {

        approvalTrack.aid = aid;
        approvalTrack.submitUrl = submitUrl;
        approvalTrack.items.annotate.val("");
        approvalTrack.items.result.text(result);
        approvalTrack.modals.approveModal.modal("show");
    }

    function approve() {

        var options = {
            "approval.aid": approvalTrack.aid,
            "approval.annotate": approvalTrack.items.annotate.val(),
        };

        com.post(approvalTrack.submitUrl, options, function(res) {

            searcher.doSearch();

            approvalTrack.aid = null;
            approvalTrack.submitUrl = null;

            approvalTrack.modals.approveModal.modal("hide");
        });
    }

    function affirm(aid) {

        var options = {
            "approval.aid": aid
        };
        com.post(api.approval.affirmApproval, options, function(res) {

            searcher.doSearch();
        });
    };

    com.focusPage('#addappro', '#pagenation').on("click", function() {

        approvalTrack.aid = null;
        approvalTrack.modals.approveModal.modal("show");
    });

    function queryInformationItem(aid, type) {

        if (com.focusPage('#itemList').children()) {
            com.focusPage('#itemList').empty();
        }

        com.focusPage('#totalMoney').hide();

        var itemInfo = approvalTrack.approvalItemInfo[type];
        var infoList = com.focusPage('#itemList');

        com.post(itemInfo.api, {
            "approval.aid": aid
        }, function(res) {

            var totalMoney = 0;

            com.focusPage("#itemTitle").html(itemInfo.title);

            var data = $.isArray(res[itemInfo.resultname]) ? res[itemInfo.resultname] : [res[itemInfo.resultname]];

            $.each(data, function(i, v) {

                $.each(itemInfo.args, function(j, e) {

                    if (e[2] == "type")
                        infoList.append(approvalUtils.addspan(e[0], e[1], constant.information().awardStock.type.keys[getElement(v, e[2].split('.'))]));
                    if (e[2] == "stateType")
                        infoList.append(approvalUtils.addspan(e[0], e[1], constant.decoration().decorationActivityItem.stateType.keys[getElement(v, e[2].split('.'))]));
                    if (e[2] == "typeness")
                        infoList.append(approvalUtils.addspan(e[0], e[1], constant.decoration().decoration.typeness.keys[getElement(v, e[2].split('.'))]));
                    if (e[2] != "type" && e[2] != "stateType" && e[2] != "typeness")
                        infoList.append(approvalUtils.addspan(e[0], e[1], getElement(v, e[2].split('.'))));
                });

                var caleTotal = itemInfo.caleTotal;

                if (caleTotal && caleTotal.length == 2) {
                    totalMoney += parseFloat(v[caleTotal[0]]) * parseFloat(v[caleTotal[1]]);
                } else if (caleTotal && caleTotal.length == 1) {
                    totalMoney += parseFloat(v[caleTotal[0]]);
                }

                infoList.append('<hr />');
            });

            if (itemInfo.caleTotal)
                com.focusPage('#totalMoney').html("总金额:" + totalMoney).show();

            approvalTrack.modals.itemModel.modal("show");
        });
    }

    function getElement(o, props) {

        var prop = props.shift();
        if (props.length == 0) {
            return o[prop];
        } else if (o[prop]) {
            return getElement(o[prop], props);
        }
        return "";
    }
});
