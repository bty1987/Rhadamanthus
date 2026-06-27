jQuery(function($) {

    var approvalCustomerSource = {
        aid: null,
        submitUrl: null,

        btns: {
            submitBtn: com.focusPage("#submitBtn")
        },
        modals: {
            approveModal: com.focusPage("#approveModal"),
        },

        items: {
            result: com.focusPage('#result'),
            annotate: com.focusPage('#annotate'),
        },

        approvalType: {},
    };

    var typeName = params['urlLoadParams'].depage;

    if (typeName == "decoration" || typeName == "origin") {
        typeName = "customerOrigin";
    }

    approvalCustomerSource.pageConfig = getConfig(params['urlLoadParams'].depage);

    var lineprops = (function() {

        var props = [];

        $.each(approvalCustomerSource.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "approval.sender.currentName":
                    props.push({field: "approval.sender.currentName", name: "申请人", prop: "approval.sender.currentName", clazz: "grey"});
                    break;
                case "approval.receiver.currentName":
                    props.push({field: "approval.receiver.currentName", name: "审批人", prop: "approval.receiver.currentName", clazz: "grey", click: function(v, $b) {

                        tools.personel.info($b, v.approval.receiver.userId);
                    }});
                    break;
                case "approval.createTime":
                    props.push({field: "approval.createTime", name: "提交时间", prop: "approval.createTime", clazz: "green"});
                    break;
                case "approval.approvalTime":
                    props.push({field: "approval.approvalTime", name: "审批时间", prop: "approval.approvalTime", clazz: "green"});
                    break;
                case "approval.status":
                    props.push({field: "approval.status", name: "审批状态", prop: function(v) { return constant.approval().approval.status.keys[v.approval.status]; }, clazz: "red"});
                    break;
                case "approval.contents":
                    props.push({field: "approval.contents", name: "说明", prop: "approval.contents", clazz: "grey"});
                    break;
                case "approval.comment":
                    props.push({field: "approval.comment", name: "备注", prop: "approval.comment", clazz: "grey"});
                    break;
                case "approval.annotate":
                    props.push({field: "approval.annotate", name: "批注", prop: "approval.annotate", clazz: "green"});
                    break;
                case "source.name":
                    props.push({field: "source.name", name: "姓名", prop: "source.name", clazz: "green"});
                    break;
                case "source.gender":
                    props.push({field: "source.gender", name: "性别", prop: "source.gender", clazz: "green"});
                    break;
                case "source.purpose":
                    props.push({field: "source.purpose", name: "目的", prop: "source.purpose", clazz: "green"});
                    break;
                case "source.intention":
                    props.push({field: "source.intention", name: "意向", prop: "source.intention", clazz: "green"});
                    break;
                case "source.price":
                    props.push({field: "source.price", name: "需求价格", prop: "source.price", clazz: "green"});
                    break;
                case "source.grade":
                    props.push({field: "source.grade", name: "等级", prop: "source.grade", clazz: "grey"});
                    break;
                case "source.village.name":
                    props.push({field: "source.village.name", name: "楼盘名", prop: "source.village.name", clazz: "grey"});
                    break;
                case "source.houseNumber":
                    props.push({field: "source.houseNumber", name: "楼牌号", prop: "source.houseNumber", clazz: "blue"});
                    break;
                case "source.buildArea":
                    props.push({field: "source.buildArea", name: "建筑面积", prop: "source.buildArea", clazz: "blue"});
                    break;
                case "source.freeArea":
                    props.push({field: "source.freeArea", name: "赠送面积", prop: "source.freeArea", clazz: "blue"});
                    break;
                case "source.innerArea":
                    props.push({field: "source.innerArea", name: "套内面积", prop: "source.innerArea", clazz: "blue"});
                    break;
                case "source.totalArea":
                    props.push({field: "source.totalArea", name: "总面积", prop: "source.totalArea", clazz: "blue"});
                    break;
                case "source.status":
                    props.push({field: "source.status", name: "状态", prop: function(v) { return constant.customer().customerOrigine.status.keys[v.source.status]; }, clazz: "red"});
                    break;
                case "source.phone":
                    props.push({field: "source.phone", name: "客源电话", prop: "source.phone", clazz: "blue"});
                    break;
                case "customerOrigin.name":
                    props.push({field: "customerOrigin.name", name: "姓名", prop: "customerOrigin.name", clazz: "green"});
                    break;
                case "customerOrigin.gender":
                    props.push({field: "customerOrigin.gender", name: "性别", prop: "customerOrigin.gender", clazz: "green"});
                    break;
                case "customerOrigin.purpose":
                    props.push({field: "customerOrigin.purpose", name: "目的", prop: "customerOrigin.purpose", clazz: "green"});
                    break;
                case "customerOrigin.intention":
                    props.push({field: "customerOrigin.intention", name: "意向", prop: "customerOrigin.intention", clazz: "green"});
                    break;
                case "customerOrigin.price":
                    props.push({field: "customerOrigin.price", name: "需求价格", prop: "customerOrigin.price", clazz: "green"});
                    break;
                case "customerOrigin.grade":
                    props.push({field: "customerOrigin.grade", name: "等级", prop: "customerOrigin.grade", clazz: "grey"});
                    break;
                case "customerOrigin.village.name":
                    props.push({field: "customerOrigin.village.name", name: "楼盘名", prop: "customerOrigin.village.name", clazz: "grey"});
                    break;
                case "customerOrigin.houseNumber":
                    props.push({field: "customerOrigin.houseNumber", name: "楼牌号", prop: "customerOrigin.houseNumber", clazz: "blue"});
                    break;
                case "customerOrigin.buildArea":
                    props.push({field: "customerOrigin.buildArea", name: "建筑面积", prop: "customerOrigin.buildArea", clazz: "blue"});
                    break;
                case "customerOrigin.freeArea":
                    props.push({field: "customerOrigin.freeArea", name: "赠送面积", prop: "customerOrigin.freeArea", clazz: "blue"});
                    break;
                case "customerOrigin.innerArea":
                    props.push({field: "customerOrigin.innerArea", name: "套内面积", prop: "customerOrigin.innerArea", clazz: "blue"});
                    break;
                case "customerOrigin.totalArea":
                    props.push({field: "customerOrigin.totalArea", name: "总面积", prop: "customerOrigin.totalArea", clazz: "blue"});
                    break;
                case "customerOrigin.status":
                    props.push({field: "customerOrigin.status", name: "状态", prop: function(v) { return constant.customer().customerOrigine.status.keys[v.customerOrigin.status]; }, clazz: "red"});
                    break;
                case "customerOrigin.phone":
                    props.push({field: "customerOrigin.phone", name: "客源电话", prop: "customerOrigin.phone", clazz: "blue"});
                    break;
                case "sales.customer.name":
                    props.push({field: "sales.customer.name", name: "姓名", prop: "sales.customer.name", clazz: "blue"});
                    break;
                case "sales.customer.gender":
                    props.push({field: "sales.customer.gender", name: "性别", prop: "sales.customer.gender", clazz: "grey"});
                    break;
                case "sales.customer.phone":
                    props.push({field: "sales.customer.phone", name: "客户电话", prop: "sales.customer.phone", clazz: "grey"});
                    break;
                case "sales.orderId":
                    props.push({field: "sales.orderId", name: "装修单号", prop: "sales.orderId", clazz: "grey"});
                    break;
                case "sales.category":
                    props.push({field: "sales.category", name: "商品品类", prop: "sales.category", clazz: "grey"});
                    break;
                case "sales.brand":
                    props.push({field: "sales.brand", name: "商品品牌", prop: "sales.brand.name", clazz: "grey"});
                    break;
                case "sales.salesman.currentName":
                    props.push({field: "sales.salesman.currentName", name: "渠道", prop: "sales.salesman.currentName", clazz: "grey"});
                    break;
                case "sales.dept.name":
                    props.push({field: "sales.dept.name", name: "部门", prop: "sales.dept.name", clazz: "grey"});
                    break;
                case "sales.region.name":
                    props.push({field: "sales.region.name", name: "分区", prop: "sales.region.name", clazz: "grey"});
                    break;
                case "sales.house.village.name":
                    props.push({field: "sales.house.village.name", name: "楼盘", prop: "sales.house.village.name", clazz: "grey"});
                    break;
                case "sales.house.houseNumber":
                    props.push({field: "sales.house.houseNumber", name: "楼号", prop: "sales.house.houseNumber", clazz: "grey"});
                    break;
                case "sales.total":
                    props.push({field: "sales.total", name: "总额", prop: "sales.total", clazz: "grey"});
                    break;
                case "sales.amount":
                    props.push({field: "sales.amount", name: "当前总额", prop: "sales.amount", clazz: "grey"});
                    break;
                case "sales.maling":
                    props.push({field: "sales.maling", name: "抹零", prop: "sales.maling", clazz: "grey"});
                    break;
                case "refund":
                    props.push({field: "refund", name: "退款", prop: "refund", clazz: "grey"});
                    break;
                case "type":
                    props.push({field: "type", name: "类型", prop: function(v) { return constant.sales().refunds.type.keys[v.type]; }, clazz: "red"});
                    break;
                case "sales.status":
                    props.push({field: "sales.status", name: "状态", prop: function(v) { return constant.sales().refunds.status.keys[v.sales.status]; }, clazz: "red"});
                    break;
            }
        });

        return props;
    })();

    var linebtns = (function() {

        var btns = {};

        var showFunc = function(v) {

            return !v.piid && [constant.approval().approval.STATUS_INIT_INT, constant.approval().approval.STATUS_CONFIRM_INT, constant.approval().approval.STATUS_CONFIRMED_INT].indexOf(v.approval.status) != -1 && params.urlLoadParams.type != 'send';
        };

        if (approvalCustomerSource.pageConfig.pageBtn.contains("pass")) {
            btns.pass = {
                name: "通过",
                clazz: "btn-success",
                show: showFunc,
                handle: function(v) {

                    proapprove(v.approval.aid, api.approval.approveApproval, "通过");
                }
            };
        }

        if (approvalCustomerSource.pageConfig.pageBtn.contains("refuse")) {
            btns.refuse = {
                name: "拒绝",
                clazz: "btn-danger",
                show: showFunc,
                handle: function(v) {

                    proapprove(v.approval.aid, api.approval.refuseApproval, "拒绝");
                }
            };
        }

        return btns;
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", approvalCustomerSource.pageConfig.apiPage, {
        "user": params['urlLoadParams'].depage
    }, approvalCustomerSource.pageConfig.condArr, approvalCustomerSource.pageConfig.postDataName, null, false, null);
    searcher.line(function(v) { return constant.approval().approval.type.keys[v.type]; }, lineprops, linebtns).render();

    approvalCustomerSource.btns.submitBtn.on("click", approve);

    function getConfig(page) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subType) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subType);
                return;
            }

            if (subType == 0) {
                o[prop] = value;
            } else if (subType == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subType == 1 && o[prop]) {

                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {

                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }
        com.post(api.right.queryApprovalFunctionRight, {
            "approvalFunctionRight.name": page
        }, function(res) {

            var rights = res.approvalFunctionRights.sort(function(a, b) {

                return a.approvalFunction.sort - b.approvalFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.approvalFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subType);
            });
        }, null, false);

        return pageConfig;
    }

    function proapprove(aid, submitUrl, result) {

        approvalCustomerSource.aid = aid;
        approvalCustomerSource.submitUrl = submitUrl;
        approvalCustomerSource.items.annotate.val("");
        approvalCustomerSource.items.result.text(result);
        approvalCustomerSource.modals.approveModal.modal("show");
    }

    function approve() {

        var options = {
            "approval.aid": approvalCustomerSource.aid,
            "approval.annotate": approvalCustomerSource.items.annotate.val(),
        };

        com.post(approvalCustomerSource.submitUrl, options, function(res) {

            searcher.doSearch();

            approvalCustomerSource.aid = null;
            approvalCustomerSource.submitUrl = null;

            approvalCustomerSource.modals.approveModal.modal("hide");
        });
    }

    function getPropertyArr(v) {

        return lineprops;
    }

});
