jQuery(function($) {

    var information = {

        typeness: {},
        projectStatus: {},

        modals: {
            contructionNodeModal: com.focusPage("#contructionNodeModal"),
            checkModal: com.focusPage("#checkModal"),
        },

        btns: {
            checkBtn: com.focusPage("#checkBtn", "#checkModal").click(checkInfo),
        },

        nodeItems: {
            contructionNodes: com.focusPage("#contructionNodes", "#contructionNodeModal"),
        },

        items: {
            isCheck: com.focusPage("#isCheck", "#checkModal"),
        },

        info: null,

        pageType: params.urlLoadParams.type,
    };

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    information.items.isCheck.bindData(constant.construction().constructionInfo.isCheck.datas, "key", "value");

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (!listData || listData.length == 0)
                return false;

            $.each(listData, function(i, v) {

                creatLine(v).appendTo($ul);
            });

            $ul.appendTo($tableWrap);
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.decoration.orderId));

            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $invalid = $('<div></div>').addClass('pull-right');
            var $btnView = $("<a></a>").addClass("btn btn-minier btn-yellow").html("记录");
            var $btnConplan = $('<a></a>').addClass('btn btn-minier btn-warning').html("施工计划");
            var $btnConplanPrint = $('<a></a>').addClass('btn btn-minier btn-success').html("打印");
            var $btnProLine = $('<a></a>').addClass('btn btn-minier btn-inverse').html("预派监理");
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-info').html("验房");
            var $btnProfile = $('<a></a>').addClass('btn btn-minier btn-warning').html("画像");

            var propertyArr = [
            ["装修单: ", v.decoration.orderId, "blue", function(btn) {

                tools.decoration.info(btn, v.decoration.orderId);
            }],
            ["楼盘: ", v.decoration.house.village.name, "grey", function(btn) {

                tools.house.info(btn, v.decoration.house.hid);
            }],
            ["楼号: ", v.decoration.house.houseNumber, "grey"],
            ["客户: ", v.decoration.customer.name, "grey", function(btn) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }],
            ["设计分区:", v.decoration.designer.dept.fatherDept.name, "grey", function(btn) {

                tools.department.info(btn, v.decoration.designer.dept.fatherDept.did);
            }],
            ["设计部:", v.decoration.designer.dept.name, "grey", function(btn) {

                tools.department.info(btn, v.decoration.designer.dept.did);
            }],
            ["设计师:", v.decoration.designer.userName, "grey", function(btn) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }],
            ["监理:", v.decoration.supervisor ? v.decoration.supervisor.userName : "", "grey", function(btn) {

                tools.personel.info(btn, v.decoration.supervisor.userId);
            }],
            ["面积:", v.decoration.house.buildArea, "blue"],
            ["合同额: ", v.decoration.orderTotalPrice, "blue"],
            ["报价版本: ", v.decoration.version.name, "grey"],
            ["签单时间: ", v.decoration.contractTime, "green"],
            ["预计交钥匙时间: ", v.keyTime, "green"],
            ["预计放线时间: ", v.drawlineTime, "green"],
            ["预计完工时间: ", v.finishTime, "green"],
            ["预计设计完成时间: ", v.designTime, "green"],
            ["合同方案确认时间: ", v.decoration.sdesignTime, "green"],
            ["放线方案确认时间: ", v.decoration.edesignTime, "green"],
            ["装修类型: ", constant.decoration().decoration.typeness.keys[v.decoration.typeness], "red"],
            ["工程状态: ", constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus], "red"],
            ["装修状态: ", constant.decoration().decoration.status.keys[v.decoration.status], "red"],
            ["装修业务: ", constant.decoration().decoration.typeness.keys[v.decoration.typeness], "red"],
            ["备注: ", v.comment, "grey"],
            ];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }

                $liProperty.appendTo($ulProperty);
            });

            $btnDiv.append($btnView).append($btnConplanPrint).append($btnConplan).append($btnProLine).append($btnCheck).append($btnProfile).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnView.click(function() {

                params.orderId = v.decoration.orderId;

                com.popup4page("#stockRecordPopUp", api.index.constructionRecordIndex.url, "记录");
            });

            $btnConplanPrint.click(function() {

                params.construction = v;

                com.popup("工程施工进度计划表", api.index.constructionPlan2print.url, null, null, true);
            });

            $btnProLine.click(function() {

                pretreat(v);
            });

            $btnConplan.click(function() {

                params.construction = v;

                com.popup4page("#stockRecordPopUp", "/views/construction/constructionPlan.html", "计划");
            });

            $btnCheck.click(function() {

                information.info = v;

                information.modals.checkModal.modal("show");
            });

            $btnProfile.click(function() {

                viewDecorationProfile(v.decoration.orderId);
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

    var options = {
        "constructionInfo.drawlineTime": ""
    }

    if (information.pageType == "plan") {

        var current = new Date();

        current.setMonth(current.getMonth() + 2)

        options["constructionInfo.decoration.houseType"] = "期房";
        options["constructionInfo.decoration.designStatus"] = constant.decoration().decoration.DESIGNSTATUS_END_INT;
        options["constructionInfo.isIssue"] = 0;
        options["constructionInfo.drawlineTime"] = com.dateFormat(current, "yyyy-MM-dd");
    }

    if (information.pageType == "done") {
        options["constructionInfo.decoration.houseType"] = "现房";
        options["constructionInfo.decoration.designStatus"] = constant.decoration().decoration.DESIGNSTATUS_END_INT;
        options["constructionInfo.isIssue"] = 0;
    }

    if (information.pageType == "issue") {
        options["constructionInfo.isIssue"] = 1;
    }

    searcher.init(['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-designer', 'decoration-supervisor', 'decoration-houseType', 'decoration-designStatus', 'decoration-projectStatus', "construction-info-keyTime", "construction-info-drawlineTime", "construction-info-finishTime", "construction-info-designTime", "decoration-sdesignTime", "decoration-edesignTime", "construction-info-isIssue", "construction-info-isCheck", ], "condList", api.construction.pageConstructionInfo, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "constructionInfoPostData", options, false, null, function() {

        var $exporta = $('<a></a>').addClass('btn btn-minier btn-inverse').attr('id', 'export').css("margin", "0px 3px");
        var $exporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($exporta);
        var $exportspan = $('<span></span>').text('导出').appendTo($exporta);

        return [$exporta];
    }, 'resultList');

    com.focusPage("#export").click(function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 5000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.construction.pageConstructionInfo, $.extend({}, params.constructionInfoPostData, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [
                ["装修单号", "decoration.orderId"],
                ["楼盘地址", "decoration.house.houseNumber"],
                ["面积", "decoration.house.buildArea"],
                ["设计分区", "decoration.designer.dept.fatherDept.name"],
                ["设计部", "decoration.designer.dept.name"],
                ["设计师", "decoration.designer.userName"],
                ["签单时间", "decoration.contractTime"],
                ["预计交钥匙时间", "keyTime"],
                ["预计放线时间", "drawlineTime"],
                ["预计完工时间", 'finishTime'],
                ["预计设计完成时间", 'designTime'],
                ["合同方案确认时间", 'decoration.sdesignTime'],
                ["放线方案确认时间", 'decoration.edesignTime'],
                ["订单类型", "decoration.typeness"],
                ["工程状态", "decoration.projectStatus"]
                ],
                list: res.paging.data

            }, function(v) {

                v.orderId = v.orderId == null ? "" : v.orderId;
                v.decoration.house.houseNumber = (v.decoration.house == null ? " " : v.decoration.house.village.cityProper.city.name + " " + v.decoration.house.village.cityProper.name + " " + v.decoration.house.village.name + " " + v.decoration.house.houseNumber);
                v.decoration.house.buildArea = (v.decoration.house == null ? " " : v.decoration.house.buildArea);
                v.decoration.designer.userName = (v.decoration.designer == null ? " " : v.decoration.designer.userName);
                v.decoration.designer.dept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.name);
                v.decoration.designer.dept.fatherDept.name = (v.decoration.designer == null ? " " : v.decoration.designer.dept.fatherDept.name);
                v.decoration.contractTime = (v.decoration.contractTime == null ? "" : v.decoration.contractTime);
                v.keyTime = (v.keyTime == null ? "" : v.keyTime);
                v.drawlineTime = (v.drawlineTime == null ? "" : v.drawlineTime);
                v.finishTime = (v.finishTime == null ? "" : v.finishTime);
                v.decoration.sdesignTime = (v.decoration.sdesignTime == null ? "" : v.decoration.sdesignTime);
                v.decoration.edesignTime = (v.decoration.edesignTime == null ? "" : v.decoration.edesignTime);
                v.decoration.typeness = constant.decoration().decoration.typeness.keys[v.decoration.typeness];
                v.decoration.projectStatus = constant.decoration().decoration.projectStatus.keys[v.decoration.projectStatus];
            });
        });
    });

    var pretreat = function(v) {

        com.cleanTypeahead("supervisor");

        params.decoration.orderId = v.decoration.orderId;

        information.modals.contructionNodeModal.modal("show");
        information.nodeItems.contructionNodes.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        var constructionNodes = {};

        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes.sort(function(a, b) {

                return a.sort - b.sort;
            });
        }, null, false);

        $.each(constructionNodes, function(index, value) {

            if (value.proset != constant.data().constructionNode.PROSET_PROSET_INT)
                return true;

            var $liLi = $('<li></li>').addClass('item-blue clearfix');
            var $ulPro = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue'));
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').css('padding-top', '6px');

            var propertyArr = [["工期: ", null, "grey"]];

            var $label = $('<label></label>').addClass('control-label').css({
                'color': 'grey',
                'font-size': '20px',
                "font-weight": "bold"
            });

            var _label = $('<label></label>');

            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "sorts",
                "sort": value.sort,
                "cnid": value.cnid,
                "prenum": "",
                "postnum": "",
            }).addClass('ace ace-checkbox-2');

            var $text = $('<input>').attr({
                "type": "text",
                "name": "timeLimits",
                "text_sort": value.sort,
                "value": value.timeLimit,
                "cnid": value.cnid,
            }).addClass('timeLimits ace ace-checkbox-2 v_required');

            var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'normal').html(value.name);

            _label.append($input).append(_span).appendTo($label);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').attr('style', 'font-weight:normal;font-size:20px').html(value[0]).append($text).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($divBtnWrap);

                $label.appendTo($h3);

                $divBtnWrap.appendTo($h3);

                $liLi.append($h3).append($ulPro);
            });

            $liLi.append($h3).append($ulPro).appendTo($uli);
        });

        $uli.appendTo(information.nodeItems.contructionNodes);

        var pace = null;

        com.post(api.data.queryConstructionPace, {
            "constructionPace.lowerArea": v.decoration.house.innerArea
        }, function(res) {

            pace = res.constructionPace;
        }, null, false);

        if (!pace || !pace.cpid)
            return false;

        com.post(api.data.queryConstructionPaceNode, {
            "constructionPaceNode.cpid": pace.cpid
        }, function(res) {

            $.each(res.constructionPaceNodes, function(i, v) {

                com.focusPage("input[cnid='" + v.node.cnid + "'][prenum]", "#contructionNodes").attr("prenum", v.prenum);
                com.focusPage("input[cnid='" + v.node.cnid + "'][postnum]", "#contructionNodes").attr("postnum", v.postnum);

                com.focusPage("input.timeLimits[cnid='" + v.node.cnid + "']", "#contructionNodes").val(v.period);
            });

        }, null, false);

        com.post(api.construction.queryConstructionPlanByOrderId, {
            "constructionPlan.orderId": v.decoration.orderId
        }, function(res) {

            $.each(res.constructionPlans, function(i, v) {

                com.focusPage("input.timeLimits[cnid='" + v.cnid + "']", "#contructionNodes").val(v.connum);
            });
        });
    };

    com.focusPage("#seveSuccess").on("click", function() {

        if (com.validate("contructionNodeModal")) {
            return false;
        }

        var $inputs = com.focusPage('input[name="sorts"]:checked', '#contructionNodes');

        var option = {
            "drawLine.decoration.orderId": params.decoration.orderId,
            "drawLine.decoration.supervisor.userId": com.typeahead("supervisor"),
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            option["constructionNodes[" + i + "].cnid"] = $input.attr('cnid');
            option["constructionNodes[" + i + "].sort"] = $input.attr('sort');
            option["constructionNodes[" + i + "].prenum"] = $input.attr('prenum');
            option["constructionNodes[" + i + "].postnum"] = $input.attr('postnum');
            option["constructionNodes[" + i + "].timeLimit"] = $("input[text_sort=" + $input.attr('sort') + "]").val();
        });

        com.post(api.construction.pretreatDrawLine, option, function(res) {

            com.showAlert(com.info, "放线成功");

            searcher.doSearch();

            information.contructionNodeModal.modal("hide");
        });
    });

    function checkInfo() {

        var option = {
            "constructionInfo.ciid": information.information.ciid,
            "constructionInfo.isCheck": com.typeahead("supervisor"),
        };

        com.post(api.construction.checkConstructionInfo, option, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            information.checkModal.modal("hide");
        });
    }

    // 画像
    function viewDecorationProfile(orderId) {

        params.customer.orderId = orderId;
        params.customer.profile = {
            "orderId": orderId
        }

        com.popup4page("#layerPopUp", api.index.customerProfile4detailIndex.url, "客户画像: ");
    }
});