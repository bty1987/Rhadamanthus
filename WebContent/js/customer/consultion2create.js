$(function() {
    var consultion = {
        searcher: new Searcher(),
        condCodeArrs: ["orderId", "orderAddr", "houseNumber", "salesman", "designer", "customerPhone"],
        modals: {
            addAepairModal: com.focusPage("#addAepairModal"),
            addComplainModal: com.focusPage("#addComplainModal")
        },
        items: {
            "comment": com.focusPage("#comment")
        },
        aepairItems: {
            "aepairTargetTime": com.focusPage("#aepairTargetTime"),
            "aepairComment": com.focusPage("#aepairComment")
        },
        complainItems: {
            "complainLevel": com.focusPage("#complainLevel")
        },
        decorationInfo: com.focusPage("#decorationInfo"),
        typeness: {},
        decorationOrderStatus: {},
        designStatus: {},
        sourceStatus: {},
        projectStatusArr: {
            0: '初始',
            1: '开工',
            2: '已完工'
        },
        aepairStatus: {},
        aepairGladness: {},
        complainLevel: {},
        complainStatus: {},
        complainGladness: {}
    };

    // 获得页面控制参数
    var pageConfig = drawNode.getConfig(params.urlLoadParams.depage);

    // 隐藏触发
    consultion.modals.addAepairModal.on('hide.bs.modal', function() {
        com.cleanItems(consultion.aepairItems);
        com.closeTip();
    });

    consultion.modals.addComplainModal.on('hide.bs.modal', function() {
        com.cleanItems(consultion.complainItems);
        com.closeTip();
    });

    // 初始化时间
    com.datetime(consultion.aepairItems.aepairTargetTime);

    consultion.decorationInfo.empty();

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

        var creatLine = function(v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix ');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnContractDetail = $("<a></a>").addClass("btn btn-minier btn-yellow").html("合同信息");
            var $btnPaymentDetail = $("<a></a>").addClass("btn btn-minier btn-success").html("付款信息");
            var $btnExtensionDetail = $("<a></a>").addClass("btn btn-minier btn-warning").html("增减项信息");

            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("查看");
            var $btnBind = $("<a></a>").addClass("btn btn-minier btn-success").html("绑定");

            var propertyArr = [["楼盘地址: ", (v.house.village.cityProper.city.name == null ? " " : v.house.village.cityProper.city.name) + " " + (v.house.village.cityProper == null ? " " : v.house.village.cityProper.name) + " " + v.house.village.name + " " + (v.house.houseNumber == null ? " " : v.house.houseNumber), "grey"], ["客户名: ", v.customer.name, "grey"], ["设计部: ", v.designer.dept.name, "grey"], ["设计师: ", v.designer.currentName, "grey"], ["业务部: ", v.salesman.dept.name, "grey"], ["业务员: ", v.salesman.currentName, "grey"], ["面积: ", v.house.buildArea, "blue"], ["创建时间: ", v.createTime, "green"], ["类型: ", constant.decoration().decoration.typeness.keys[v.typeness], "red"],[ "状态: ", constant.decoration().decoration.status.keys[v.status], "red" ], ["设计状态: ", constant.decoration().decoration.designStatus.keys[v.designStatus], "red"], ["确认状态: ", constant.decoration().decoration.sourceStatus.keys[v.sourceStatus], "red"], ["工程状态: ", consultion.projectStatusArr[v.projectStatus], "red"]];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            // 点击查看
            $btnView.click(function() {
                viewDecorationDetail(v.orderId, v.type, v.typeness, v.version == null ? null : v.version.versionId, v.notSalesmanRate, consultion.decorationOrderStatus[v.status]);
            });

            // 点击 绑定
            $btnBind.click(function() {
                com.focusPage("#notTitle").css("display", "none");
                consultion.decorationInfo.empty();
                drawDecorationInfo(v);
                queryAllDetailInfo();
            });

            $btnContractDetail.click(function() {
                decorationPaymentDrawRecord(v.orderId, 1);
            });

            $btnPaymentDetail.click(function() {
                decorationPaymentDrawRecord(v.orderId, 2);
            });

            $btnExtensionDetail.click(function() {
                decorationPaymentDrawRecord(v.orderId, 3);
            });

            if (v.orderId.substr(0, 2) == "00") {
                $divBtnWrap.append($btnContractDetail).append($btnPaymentDetail).append($btnExtensionDetail);
            }

            if (v.orderId.substr(0, 4) == "EX00") {
                $divBtnWrap.append($btnPaymentDetail).append($btnExtensionDetail);
            }

            $divBtnWrap.append($btnView).append($btnBind);

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

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

    pageSearcherInit(consultion.searcher);

    // 转咨询单
    com.focusPage("#consultionBtn").click(function() {
        if (com.validate("leftBottom"))
            return false;

        var orderId = com.focusPage("#decorationInfo li:first").find("b").html();

        var options = {
            "consultion.decoration.orderId": orderId,
            "consultion.comment": consultion.items.comment.val()
        };

        com.showConfirm("确认转咨询单吗?", function(res) {
            com.post(api.customer.addConsultion, options, function(res) {
                if (orderId != undefined)
                    queryAllDetailInfo();
                com.cleanItems(consultion.items);
                com.showAlert(com.info, "转单成功");
            });
        });
    });

    // 转报修单
    com.focusPage("#aepairBtn").click(function() {
        if (com.validate("leftBottom"))
            return false;

        consultion.modals.addAepairModal.modal("show");
    });

    com.focusPage("#aepairSaveBtn").click(function() {
        if (com.validate("addAepairModal"))
            return false;

        var orderId = com.focusPage("#decorationInfo li:first").find("b").html();

        var options = {
            "consultion.decoration.orderId": orderId,
            "consultion.comment": consultion.items.comment.val(),
            "aepair.targetTime": consultion.aepairItems.aepairTargetTime.val(),
            "aepair.comment": consultion.aepairItems.aepairComment.val()
        };

        com.post(api.customer.addAepair, options, function(res) {
            if (orderId != undefined)
                queryAllDetailInfo();
            com.cleanItems(consultion.items);
            com.showAlert(com.info, "转单成功");
            consultion.modals.addAepairModal.modal("hide");
        });
    });

    // 转投诉单
    com.focusPage("#complainBtn").click(function() {
        if (com.validate("leftBottom"))
            return false;

        consultion.modals.addComplainModal.modal("show");
    });

    com.focusPage("#complainSaveBtn").click(function() {
        if (com.validate("addComplainModal"))
            return false;

        var orderId = com.focusPage("#decorationInfo li:first").find("b").html();

        var options = {
            "consultion.decoration.orderId": orderId,
            "consultion.comment": consultion.items.comment.val(),
            "complain.level": consultion.complainItems.complainLevel.val()
        };

        com.post(api.customer.addComplain, options, function(res) {
            if (orderId != undefined)
                queryAllDetailInfo();
            com.cleanItems(consultion.items);
            com.showAlert(com.info, "转单成功");
            consultion.modals.addComplainModal.modal("hide");
        });
    });

    // 重置
    com.focusPage("#resetBtn").click(function() {
        params[pageConfig.postDataName] = {};
        pageSearcherInit(consultion.searcher);

        com.closeTip();
        com.cleanItems(consultion.items);
        consultion.decorationInfo.empty();
        com.focusPage("#showView").remove();
        com.focusPage("#queryView").css("display", "block");
        com.focusPage("#notTitle").css("display", "block");
    });

    // 详细查询咨询、报修、投诉信息
    function queryAllDetailInfo() {
        com.focusPage("#showView").remove();
        com.focusPage("#queryView").css("display", "none");

        // 画记录Div
        var $showView = $("<div></div>").addClass("col-sm-12").prop("id", "showView").appendTo(com.focusPage("#right"));
        drawRecordRightView($showView, "咨询单", "consultionType");
        drawRecordRightView($showView, "报修单", "aepairType");
        drawRecordRightView($showView, "投诉单", "complainType");

        var orderId = com.focusPage("#decorationInfo li:first").find("b").html();

        com.post(api.customer.queryConsultionByOrderId, {
            "consultion.decoration.orderId": orderId
        }, function(res) {
            var consultions = res.consultions;

            $.each(consultions, function(i, v) {
                var optionConsultionArr = [["装修单号: ", com.checkNull(v.decoration.orderId), "blue"], ["编号: ", v.no, "blue"], ["创建人: ", v.creater.currentName, "grey"]];
                drawRecord(com.focusPage("#consultionTypeUl"), optionConsultionArr, v.comment, "consultion");
            });
        });

        // 报修
        com.post(api.customer.queryAepairByOrderId, {
            "aepair.decoration.orderId": orderId
        }, function(res) {
            var aepairs = res.aepairs;

            $.each(aepairs, function(i, v) {
                var optionAepairArr = [["装修单号: ", com.checkNull(v.decoration.orderId), "blue"], ["创建人: ", v.creater.currentName, "grey"], ["操作人: ", v.updater.currentName, "grey"], ["创建时间: ", v.createTime, "green"], ["预计完成时间: ", v.targetTime, "green"], ["更新时间: ", v.updateTime, "green"], ["完成时间: ", v.finishTime, "green"], ["状态: ", constant.customer().aepair.status.keys[v.status], "red"], ["维修费用: ", v.outlay, "green"], ["已付费用: ", v.outpay, "green"], ["满意度: ", constant.customer().aepair.aepairStatus.keys[v.gladness], "grey"]];
                drawRecord(com.focusPage("#aepairTypeUl"), optionAepairArr, v.comment, "aepair");
            });
        });

        // 投诉
        com.post(api.customer.queryComplainByOrderId, {
            "complain.decoration.orderId": orderId
        }, function(res) {
            var complains = res.complains;

            $.each(complains, function(i, v) {
                var optionComplainArr = [["装修单号: ", com.checkNull(v.decoration.orderId), "blue"], ["创建人: ", v.creater.currentName, "grey"], ["操作人: ", v.updater.currentName, "grey"], ["创建时间: ", v.createTime, "green"], ["操作时间: ", v.updateTime, "green"], ["完成时间: ", v.finishTime, "green"], ["等级: ", constant.customer().complain.complainType.keys[v.level], "green"], ["状态: ", constant.customer().aepair.status.keys[v.status], "red"], ["满意度: ", constant.customer().aepair.aepairStatus.keys[v.gladness], "grey"]];
                drawRecord(com.focusPage("#complainTypeUl"), optionComplainArr, v.decoration.orderId, "complain");
            });
        });
    }

    // 查看
    function viewDecorationDetail(decorationOrderId, type, typeness, versionId, notSalesmanRate, status) {
        params.decoration.decorationOrderId = decorationOrderId;
        params.decoration.orderType = type;
        params.decoration.orderTypeness = typeness;
        params.decoration.versionId = versionId;
        params.decoration.notSalesmanRate = notSalesmanRate;
        params.decoration.orederStatus = status;
        params.decoration.btnViewFlg = false;
        params.decoration.viewNode = Object.values(pageConfig.nodes);
        com.popup4page("#showDecorationInfo", api.index.decorationDetailIndex.url, "装修单信息")
    }

    // 画装修单基础信息
    function drawDecorationInfo(decoration) {
        var optionArr = [["装修单号: ", decoration.orderId, "blue"], ["楼盘地址: ", (decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + (decoration.house.houseNumber == null ? " " : decoration.house.houseNumber), "grey"], ["客户名: ", decoration.customer.name, "grey"], ["面积: ", decoration.house.buildArea, "blue"], ["创建时间: ", decoration.createTime, "green"], ["类型: ", constant.decoration().decoration.typeness.keys[decoration.typeness], "red"], [ "状态: ", constant.decoration().decoration.status.keys[decoration.status], "red" ]];

        $.each(optionArr, function(index, value) {
            var $Lics = $('<li></li>').css({
                "list-style": "none",
                "margin": "5px 0"
            });
            $('<strong></strong>').html(value[0]).appendTo($Lics);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
            $Lics.appendTo(consultion.decorationInfo);
        });
    }

    // 画右部分
    function drawRecordRightView(id, h3, type) {
        var $Div = $('<div></div>').css({
            "margin-bottom": "10px"
        }).addClass("col-sm-12").appendTo(id);
        var $H3Div = $('<div></div>').css({
            "margin-bottom": "10px"
        }).appendTo($Div);
        var $H3 = $('<h4></h4>').addClass("col-sm-11").css({
            "color": "#4383b4",
            "font-weight": "700"
        }).html(h3).appendTo($H3Div);
        var $divUl = $('<div></div>').addClass("col-sm-12").prop("id", type).appendTo($Div);
        var $ul = $('<ul></ul>').addClass("item-list fl-table-list ui-sortable").prop("id", type + "Ul").appendTo($divUl);
    }

    // 画各个单子记录
    function drawRecord(id, optionArr, title, flag) {
        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h3 = $('<h3></h3>').addClass('oid');
        var $small = $('<small></small>').html(title).appendTo($h3);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

        switch (flag) {
            case "consultion":
                $small.addClass('blue');
                break;
            case "aepair":
                $small.addClass('light-red');
                break;
            case "complain":
                $small.addClass('orange');
                break;
        }

        $.each(optionArr, function(index, value) {
            var $Lics = $('<li></li>').css("margin", "0");
            $('<strong></strong>').html(value[0]).appendTo($Lics);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($Lics);
            $Lics.appendTo($ulProperty);
        });

        $liLine.append($h3).append($ulProperty).appendTo(id);
    }

    function decorationPaymentDrawRecord(decorationOrderId, from) {

        var url = "";

        switch (from) {
            case 1:
                url = "/original/contractDetail/" + decorationOrderId + ".html";
                break;
            case 2:
                url = "/original/paymentDetail/" + decorationOrderId + ".html";
                break;
            case 3:
                url = "/original/extensionDetail/" + decorationOrderId + ".html";
                break;
        }

        com.popup4page("#showDecorationPaymentDetail", url, "装修单款项信息")
    }

    function pageSearcherInit(searcher) {
        searcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function(data) {
            displayFunc.init("resultList", data);
        }, "pagenation", pageConfig.postDataName, null, false, null, null);
    }
});