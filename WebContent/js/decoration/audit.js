jQuery(function($) {

    var audit = {
        decorationStatus: {},
        type: {}
    };

    audit.decorationStatus = constant.decoration().decoration.status.keys;
    audit.type = constant.decoration().decoration.typeness.keys;

    function getAuditPropertyArr(v) {

        var propertyArr = [["楼盘地址:", v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"], ["客户:", v.decoration.customer.name, "grey"], ["设计师:", v.decoration.designer.currentName, "grey"], ["设计部:", v.decoration.designer.dept.name, "grey"], ["面积:", v.decoration.house.buildArea, "blue "], ["量房时间:", v.decoration.measureTime, "green"], ["签单时间:", v.decoration.contractTime, "green"], ["类型:", audit.type[v.decoration.type], "red"], ["状态:", audit.decorationStatus[v.decoration.status], "red"], ["审核状态:", v.auditer ? '已审核' : '未审核', "red"]];

        if (v.auditer) {
            propertyArr.push(["审核人:", v.auditer.currentName, "grey"]);
            propertyArr.push(["审核时间:", v.auditTime, "green"]);
        }

        return propertyArr;
    }

    function buildAuditLineprops() {

        return [{
            field: "address",
            name: "楼盘地址",
            prop: function(v) {

                return v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber;
            },
            clazz: "grey"
        }, {
            field: "customer",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey"
        }, {
            field: "designer",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey"
        }, {
            field: "designDepartment",
            name: "设计部",
            prop: "decoration.designer.dept.name",
            clazz: "grey"
        }, {
            field: "houseArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "measureTime",
            name: "量房时间",
            prop: "decoration.measureTime",
            clazz: "green"
        }, {
            field: "contractTime",
            name: "签单时间",
            prop: "decoration.contractTime",
            clazz: "green"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) {

                return audit.type[v.decoration.type];
            },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {

                return audit.decorationStatus[v.decoration.status];
            },
            clazz: "red"
        }, {
            field: "auditStatus",
            name: "审核状态",
            prop: function(v) {

                return v.auditer ? '已审核' : '未审核';
            },
            clazz: "red"
        }, {
            field: "auditer",
            name: "审核人",
            prop: function(v) {

                return v.auditer ? v.auditer.currentName : "";
            },
            clazz: "grey",
            show: function(v) {

                return v.auditer != null;
            }
        }, {
            field: "auditTime",
            name: "审核时间",
            prop: "auditTime",
            clazz: "green",
            show: function(v) {

                return v.auditer != null;
            }
        }];
    }

    function buildAuditLinebtns() {

        return {
            view: {name: "查看", clazz: "btn-yellow", handle: function(v) { auditScale(v.decoration.orderId, v.decoration.type, v.decoration.typeness, v.versionId, v.notSalesmanRate); }},
            price: {name: "扣款", clazz: "btn-success", handle: function(v) { viewAuditRecord(v.decoration.orderId, v.decoration.designer.uid, v.decoration.designer.dept.no); }},
            addMinus: {name: "信息轴", clazz: "btn-warning", handle: function(v) { viewdecorationTimelineIndex(v.decoration.orderId); }},
            info: {name: "申请审核", clazz: "btn-inverse", show: function(v) { return !v.auditer; }, handle: function(v) { applyAudit(v.aid); }}
        };
    }

    var _condArr = ['decoration-orderId', 'decoration-village', 'decoration-designer', 'decoration-supervisor', 'decoration-design-dept', 'decoration-createTime', 'decoration-signTime', 'decoration-auditTime', 'decoration-status', 'decoration-auditStatus', 'decoration-auditor'];
    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.decoration.pageAudit, null, _condArr, null, null, false);
    searcher.line(function(v) {
        return v.decoration.orderId;
    }, buildAuditLineprops(), buildAuditLinebtns()).render();

    function applyAudit(aid) {

        com.showConfirm("确认审核吗?", function() {

            com.post(api.decoration.applyAudit, {
                "audit.aid": aid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    function viewAuditRecord(orderId, designerId, deptId) {

        params.decoration.orderId = orderId;
        params.decoration.designerId = designerId;
        params.decoration.deptId = deptId;
        params.decoration.auditStatusType = "admin";

        params.historyPage = api.index.auditIndex.url;

        com.switchPage(api.index.auditRecordIndex.url);
    }

    function auditScale(decorationOrderId, type, typeness, versionId, notSalesmanRate) {

        params.decoration.orderId = decorationOrderId;
        params.decoration.orderType = type;
        params.decoration.orderTypeness = typeness;
        params.decoration.versionId = versionId;
        params.decoration.notSalesmanRate = notSalesmanRate;

        params.decoration.viewNode = [{
            type: "basic",
            opt: {
                btn: ["customerInfosBtn"]
            }
        }, {
            type: "quotation",
            opt: {
                btn: ["btnPrintDefaultQuotationInfo"]
            }
        }, {
            type: "picture",
            opt: {
                display: ["OriginalPicture", "designPictures", "projectPictures", "contractMap", "CADProjectPicture"],
                show: ["designPictureUpload", "projectPictureUpload", "CADUpload", "ContractUpload", "OriginalUpload"]
            }
        }, {
            type: "material"
        }, {
            type: "activity"
        }, {
            type: "payment"
        }, {
            type: "belong"
        }, {
            type: "addreduce"
        }];

        params.historyPage = api.index.auditIndex.url;

        com.switchPage(api.index.decorationDetailIndex.url);
    }

    function viewdecorationTimelineIndex(orderId) {

        params.decoration.decorationOrderId = orderId;

        com.switchPage(api.index.decorationTimelineIndex.url);
    }
});
