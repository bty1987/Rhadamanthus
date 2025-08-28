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

    approvalCustomerSource.pageConfig = getConfig(params['urlLoadParams'].depage);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        if (typeName == "decoration" || typeName == "origin") {

            typeName = "customerOrigin";
        }

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(constant.approval().approval.type.keys[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $pass = $("<a></a>").addClass("btn btn-minier btn-success").html("通过");
            var $refuse = $("<a></a>").addClass("btn btn-minier btn-danger").html("拒绝");

            var propertyArr = getPropertyArr(v);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            if (!v.piid && [constant.approval().approval.STATUS_INIT_INT, constant.approval().approval.STATUS_CONFIRM_INT, constant.approval().approval.STATUS_CONFIRMED_INT].indexOf(v.approval.status) != -1 && params.urlLoadParams.type != 'send') {
                if (approvalCustomerSource.pageConfig.pageBtn.contains("pass")) {
                    $divBtnWrap.append($pass);
                }
                if (approvalCustomerSource.pageConfig.pageBtn.contains("refuse")) {
                    $divBtnWrap.append($refuse);
                }
            }
            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            // 通过
            $pass.click(function() {

                approvalCustomerSource.aid = v.approval.aid;
                approvalCustomerSource.submitUrl = api.approval.approveApproval;
                approvalCustomerSource.items.annotate.val("");
                approvalCustomerSource.items.result.text("通过");
                approvalCustomerSource.modals.approveModal.modal("show");

            });

            // 拒绝
            $refuse.click(function() {

                approvalCustomerSource.aid = v.approval.aid;
                approvalCustomerSource.submitUrl = api.approval.refuseApproval;
                approvalCustomerSource.items.annotate.val("");
                approvalCustomerSource.items.result.text("拒绝");
                approvalCustomerSource.modals.approveModal.modal("show");
            });

            return $liLine;
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };

    })();

    var searcher = new Searcher();

    searcher.init(approvalCustomerSource.pageConfig.condArr, "condList", approvalCustomerSource.pageConfig.apiPage, function(data) {

        displayFunc.init("resultList", data);
    }, "pagenation", approvalCustomerSource.pageConfig.postDataName, {
        "user": params['urlLoadParams'].depage
    }, false, null);

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

        var propertyArr = [];

        $.each(approvalCustomerSource.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "approval.sender.currentName":
                    propertyArr.push(["申请人:", v.approval.sender.currentName, "grey"]);
                    break;
                case "approval.receiver.currentName":
                    propertyArr.push(["审批人: ", v.approval.receiver.currentName, "grey", function(btn) {

                        tools.personel.info(btn, v.approval.receiver.userId);
                    }]);

                    break;
                case "approval.createTime":
                    propertyArr.push(["提交时间: ", v.approval.createTime, "green"]);
                    break;
                case "approval.approvalTime":
                    propertyArr.push(["审批时间: ", v.approval.approvalTime, "green"]);
                    break;
                case "approval.status":
                    propertyArr.push(["审批状态: ", constant.approval().approval.status.keys[v.approval.status], "red"]);

                    break;
                case "approval.contents":
                    propertyArr.push(["说明: ", v.approval.contents, "grey"]);
                    break;
                case "approval.comment":
                    propertyArr.push(["备注:", v.approval.comment, "grey"]);
                    break;
                case "approval.annotate":
                    propertyArr.push(["批注: ", v.approval.annotate, "green"]);
                    break;
                case "source.name":
                    propertyArr.push(["姓名: ", v.source.name, "green"]);
                    break;
                case "source.gender":
                    propertyArr.push(["性别: ", v.source.gender, "green"]);
                    break;
                case "source.purpose":
                    propertyArr.push(["目的: ", v.source.purpose, "green"]);
                    break;
                case "source.intention":
                    propertyArr.push(["意向: ", v.source.intention, "green"]);
                    break;
                case "source.price":
                    propertyArr.push(["需求价格: ", v.source.price, "green"]);
                    break;
                case "source.grade":
                    propertyArr.push(["等级", v.source.grade, "grey"]);
                    break;
                case "source.village.name":
                    propertyArr.push(["楼盘名: ", v.source.village.name, "grey"]);
                    break;
                case "source.houseNumber":
                    propertyArr.push(["楼牌号: ", v.source.houseNumber, "blue"]);
                    break;
                case "source.buildArea":
                    propertyArr.push(["建筑面积: ", v.source.buildArea, "blue"]);
                    break;
                case "source.freeArea":
                    propertyArr.push(["赠送面积: ", v.source.freeArea, "blue"]);
                    break;
                case "source.innerArea":
                    propertyArr.push(["套内面积: ", v.source.innerArea, "blue"]);
                    break;
                case "source.totalArea":
                    propertyArr.push(["总面积: ", v.source.totalArea, "blue"]);
                    break;
                case "source.status":
                    propertyArr.push(["状态: ", constant.customer().customerOrigine.status.keys[v.source.status], "red"]);
                    break;
                case "source.phone":
                    propertyArr.push(["客源电话: ", v.source.phone, "blue"]);
                    break;
                case "customerOrigin.name":
                    propertyArr.push(["姓名: ", v.customerOrigin.name, "green"]);
                    break;
                case "customerOrigin.gender":
                    propertyArr.push(["性别: ", v.customerOrigin.gender, "green"]);
                    break;
                case "customerOrigin.purpose":
                    propertyArr.push(["目的: ", v.customerOrigin.purpose, "green"]);
                    break;
                case "customerOrigin.intention":
                    propertyArr.push(["意向: ", v.customerOrigin.intention, "green"]);
                    break;
                case "customerOrigin.price":
                    propertyArr.push(["需求价格: ", v.customerOrigin.price, "green"]);
                    break;
                case "customerOrigin.grade":
                    propertyArr.push(["等级", v.customerOrigin.grade, "grey"]);
                    break;
                case "customerOrigin.village.name":
                    propertyArr.push(["楼盘名: ", v.customerOrigin.village.name, "grey"]);
                    break;
                case "customerOrigin.houseNumber":
                    propertyArr.push(["楼牌号: ", v.customerOrigin.houseNumber, "blue"]);
                    break;
                case "customerOrigin.buildArea":
                    propertyArr.push(["建筑面积: ", v.customerOrigin.buildArea, "blue"]);
                    break;
                case "customerOrigin.freeArea":
                    propertyArr.push(["赠送面积: ", v.customerOrigin.freeArea, "blue"]);
                    break;
                case "customerOrigin.innerArea":
                    propertyArr.push(["套内面积: ", v.customerOrigin.innerArea, "blue"]);
                    break;
                case "customerOrigin.totalArea":
                    propertyArr.push(["总面积: ", v.customerOrigin.totalArea, "blue"]);
                    break;
                case "customerOrigin.status":
                    propertyArr.push(["状态: ", constant.customer().customerOrigine.status.keys[v.customerOrigin.status], "red"]);
                    break;
                case "customerOrigin.phone":
                    propertyArr.push(["客源电话: ", v.customerOrigin.phone, "blue"]);
                    break;
                case "sales.customer.name":
                    propertyArr.push(["姓名: ", v.sales.customer.name, "blue"]);
                    break;
                case "sales.customer.gender":
                    propertyArr.push(["性别: ", v.sales.customer.gender, "grey"]);
                    break;
                case "sales.customer.phone":
                    propertyArr.push(["客户电话: ", v.sales.customer.phone, "grey"]);
                    break;
                case "sales.orderId":
                    propertyArr.push(["装修单号: ", v.sales.orderId, "grey"]);
                    break;
                case "sales.category":
                    propertyArr.push(["商品品类: ", v.sales.category, "grey"]);
                    break;
                case "sales.brand":
                    propertyArr.push(["商品品牌: ", v.sales.brand.name, "grey"]);
                    break;
                case "sales.salesman.currentName":
                    propertyArr.push(["渠道: ", v.sales.salesman.currentName, "grey"]);
                    break;
                case "sales.dept.name":
                    propertyArr.push(["部门: ", v.sales.dept.name, "grey"]);
                    break;
                case "sales.region.name":
                    propertyArr.push(["分区: ", v.sales.region.name, "grey"]);
                    break;
                case "sales.house.village.name":
                    propertyArr.push(["楼盘: ", v.sales.house.village.name, "grey"]);
                    break;
                case "sales.house.houseNumber":
                    propertyArr.push(["楼号: ", v.sales.house.houseNumber, "grey"]);
                    break;
                case "sales.total":
                    propertyArr.push(["总额: ", v.sales.total, "grey"]);
                    break;
                case "sales.amount":
                    propertyArr.push(["当前总额: ", v.sales.amount, "grey"]);
                    break;
                case "sales.maling":
                    propertyArr.push(["抹零: ", v.sales.maling, "grey"]);
                    break;
                case "refund":
                    propertyArr.push(["退款: ", v.refund, "grey"]);
                    break;
                case "type":
                    propertyArr.push(["类型: ", constant.sales().refunds.type.keys[v.type], "red"]);
                    break;
                case "sales.status":
                    propertyArr.push(["状态: ", constant.sales().refunds.status.keys[v.sales.status], "red"]);
                    break;

            }
        });

        return propertyArr;
    }

});
