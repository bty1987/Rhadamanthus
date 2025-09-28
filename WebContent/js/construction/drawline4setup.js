jQuery(function($) {

    var drawline = {

        dlid: null,

        btns: {
            saveInfoBtn: com.focusPage("#saveInfoBtn"),
            saveBtn: com.focusPage("#saveBtn"),
            deployedBtn: com.focusPage("#deployedBtn"),
            seveSuccessBtn: com.focusPage("#seveSuccess"),
        },

        modals: {
            setupModal: com.focusPage("#setupModal"),
            editModal: com.focusPage("#editModal"),
            applyModal: com.focusPage("#applyModal"),
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            contructionNodeModal: com.focusPage("#contructionNodeModal"),
        },

        items: {
            dlid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            drawLineGroup: com.focusPage("#drawLineGroup"),

            orderInfos: com.focusPage("#orderInfos"),
            supervisor: com.focusPage("#supervisor"),

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            drawlineTime: com.focusPage("#drawlineTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment"),
            contructionNodes: com.focusPage("#contructionNodes"),

            status: com.focusPage("#status")
        },

        drawLineGroup: [],
        status: {},
        sorts: [],
        timeLimits: [],

        pageType: params['urlLoadParams'].type
    };

    drawline.btns.saveBtn.bindClick(saveData);
    drawline.btns.saveInfoBtn.bindClick(saveInfoData);
    drawline.btns.deployedBtn.bindClick(deploved);
    drawline.btns.seveSuccessBtn.bindClick(seveSuccess);

    drawline.modals.setupModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.closeTip();
    });

    drawline.modals.editModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.closeTip();
    });

    drawline.modals.applyModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.closeTip();
    });

    drawline.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.cleanTypeahead("supervisor");
        com.closeTip();
    });

    com.initTypeahead('supervisor', api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "工程部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    com.datetime(drawline.items.actualDate);
    com.datetime(drawline.items.finishTime);
    com.datetime(drawline.items.keyTime);
    com.datetime(drawline.items.drawlineTime);
    com.datetime(drawline.items.designTime);

    com.datetime(drawline.items.startTime, "time");
    com.datetime(drawline.items.endTime, "time");

    drawline.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    drawline.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    drawline.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");
    drawline.items.status.bindData(constant.construction().drawLine.status.datas, "key", "value");

    com.post(api.data.queryDrawlineGroup, {}, function(res) {

        drawline.items.drawLineGroup.bindData(res.drawLineGroups, 'gid', 'name');

        $.each(res.drawLineGroups, function(i, v) {

            drawline.drawLineGroup.push(v.name);
        });
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v);
                });
            }
        };

        var creatLine = function(v) {

            var gid = v.group.gid;

            var $tableWrap = com.focusPage("#group" + gid);

            if ($tableWrap.length == 0 && v.group.gid != null) {

                var resultList = com.focusPage("#resultList");

                var groupDiv = $("<div></div>").addClass("col-xs-6 col-md-6 widget-container-span ui-sortable").appendTo(resultList);
                var groupWidgetBox = $("<div></div>").addClass("widget-box transparent").appendTo(groupDiv);
                var groupWidgetHeader = $("<div></div>").addClass("widget-header").appendTo(groupWidgetBox);

                var groupH5 = $("<h4></h4>").appendTo(groupWidgetHeader);
                var groupStrong = $("<strong></strong>").text(v.group.name).appendTo(groupH5);

                var groupWidgetBody = $("<div></div>").addClass("widget-body").appendTo(groupWidgetBox);
                var groupWidgetBodyInner = $("<div></div>").addClass("widget-body-inner").css("display", "block").appendTo(groupWidgetBody);
                var resultList = $('<div></div>').attr("id", "group" + gid).addClass("clearfix tab-pane active").appendTo(groupWidgetBodyInner);

                $tableWrap = resultList;
            }

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable').appendTo($tableWrap);
            var $liLine = $('<li></li>').addClass('ite m-orange clearfix').appendTo($ul);
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html("信息");
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');
            var $btnDeplory = $('<a></a>').addClass('btn btn-minier btn-warning').html('人员部署');
            var $btnReset = $('<a></a>').addClass('btn btn-minier btn-inverse').html('重置');
            var $successBtn = $('<a></a>').addClass('btn btn-minier btn-info').html('放线');

            if (v.startTime != null && v.endTime != null) {
                var startTime = v.startTime.substr(11);
                var endTime = v.endTime.substr(11);
            }

            var actualTime = v.actualTime;

            var propertyArr = [["装修单: ", v.decoration.orderId, "blue", function(btn) {

                tools.decoration.info(btn, v.decoration.orderId);
            }], ["楼盘: ", v.decoration.house.village.name, "grey", function(btn) {

                tools.house.info(btn, v.decoration.house.hid);
            }], ["楼号: ", v.decoration.house.houseNumber, "grey"], ["客户: ", v.decoration.customer.name, "grey", function(btn) {

                tools.customer.info(btn, v.decoration.customer.cid);
            }], ["设计师: ", v.decoration.designer.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.decoration.designer.userId);
            }], ["监理: ", v.decoration.supervisor == null ? "" : v.decoration.supervisor.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.decoration.supervisor.userId);
            }], ["面积: ", v.decoration.house.buildArea, "blue"], ["合同额: ", v.decoration.orderTotalPrice, "blue"], ["装修业务: ", constant.decoration().decoration.typeness.keys[v.decoration.typeness], "red"], ["装修状态: ", constant.decoration().decoration.status.keys[v.decoration.status], "red"], ["报价版本: ", v.decoration.version.name, "grey"], ["申请人: ", v.appler.currentName, "grey", function(btn) {

                tools.personel.info(btn, v.appler.userId);
            }], ["放线时间: ", actualTime, "green"], ["开始时间: ", startTime, "green"], ["结束时间: ", endTime, "green"], ["状态: ", constant.construction().drawLine.status.keys[v.status], "red"], ["描述: ", v.content, "grey"]];

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

            if (drawline.pageType != "open" && v.status == constant.construction().drawLine.STATUS_APPLICATION_INT) {
                $divBtnWrap.append($btnInfo).append($btnEdit).append($btnDeplory).append($btnReset).append($successBtn).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty);

            $btnInfo.click(function() {

                viewConstructionInfo(v.decoration.orderId);
            });

            $btnEdit.click(function() {

                showEdit(v);
            });

            $btnDeplory.click(function() {

                showSetup(v);
            });

            $btnReset.click(function() {

                reset(v.dlid);
            });

            $successBtn.click(function() {

                success(v);
            });
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
    searcher.init(['decoration-orderId', 'construction-drawLine-status', 'construction-drawLine-actualDate'], "condList", api.construction.queryDrawLine, function(data) {

        com.focusPage("#resultList").html("");
        displayFunc.init('resultList', data);
    }, "pagenation", "drawLineOpenPostData", null, true, "drawLines");
    com.focusPage("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');
    com.focusPage('#showDrawLineApplyInfos').on('click', function() {

        drawline.modals.applyModal.modal("show");
    });

    function showEdit(v) {

        drawline.items.dlid.val(v.dlid);
        drawline.items.actualDate.val(v.startTime.substr(0, 10));
        drawline.items.startTime.val(v.startTime.substr(11, 5));
        drawline.items.endTime.val(v.endTime.substr(11, 5));
        drawline.items.drawLineGroup.val(v.group.gid);

        drawline.modals.editModal.modal("show");
    }

    function showSetup(v) {

        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": v.decoration.orderId
        };

        com.post(api.construction.queryConstructionByOrderId, options, function(res) {

            if (res.construction.supervisor) {
                com.updateTypeahead("supervisor", res.construction.supervisor.userId, res.construction.supervisor.userName);
            } else {
                com.cleanTypeahead("supervisor");
            }
        });

        drawline.items.orderInfos.html(v.decoration.orderId + " " + v.decoration.house.village.name);

        drawline.orderId = v.decoration.orderId;

        drawline.modals.setupModal.modal("show");
    }

    function reset(dlid) {

        com.showConfirm("确认重置申请吗?", function() {

            com.post(api.construction.failureDrawLine, {
                "drawLine.dlid": dlid
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });
    }

    function saveData() {

        if (com.validate("editModal")) {
            return false;
        }

        var start = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.startTime.val());
        var end = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.endTime.val());

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.info, "起始时间和结束时间非法");
            return false;
        }

        var options = {
            "drawLine.dlid": drawline.items.dlid.val(),
            "drawLine.startTime": drawline.items.actualDate.val() + " " + drawline.items.startTime.val(),
            "drawLine.endTime": drawline.items.actualDate.val() + " " + drawline.items.endTime.val(),
            "drawLine.group.gid": drawline.items.drawLineGroup.val()

        };
        com.post(api.construction.resetDrawLine, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        drawline.modals.editModal.modal("hide");
    }

    function deploved() {

        if (com.validate("setupModal")) {
            return false;
        }

        var options = {
            "construction.orderId": drawline.orderId,
            "construction.supervisor.userId": com.typeahead("supervisor")
        };

        com.post(api.construction.updateConstructionByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            drawline.modals.setupModal.modal("hide");
        });
    }

    function success(v) {

        // var option = {"drawLine.dlid": v.dlid};

        drawline.dlid = v.dlid;

        drawline.modals.contructionNodeModal.modal("show");
        drawline.items.contructionNodes.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        var constructionNodes = {};

        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes.sort(function(a, b) {

                return a.sort - b.sort;
            });
        }, null, false);

        com.post(api.data.queryConstructionNode, {}, function(res) {

            constructionNodes = res.constructionNodes.sort(function(a, b) {

                return a.sort - b.sort;
            });
        }, null, false);

        $.each(constructionNodes, function(index, value) {

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
                "checked": "checked"
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

        $uli.appendTo(drawline.items.contructionNodes);

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

                com.focusPage("input.timeLimits[cnid='" + v.cnode.cnid + "']", "#contructionNodes").val(v.connum);
            });
        });
    }

    drawline.modals.applyModal.on('shown.bs.modal', function(e) {

        initPlan();
    });

    function seveSuccess() {

        if (com.validate("contructionNodeModal")) {
            return false;
        }

        var $inputs = com.focusPage('input[name="sorts"]:checked', '#contructionNodes');

        var option = {
            "drawLine.dlid": drawline.dlid
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            option["constructionNodes[" + i + "].cnid"] = $input.attr('cnid');
            option["constructionNodes[" + i + "].sort"] = $input.attr('sort');
            option["constructionNodes[" + i + "].timeLimit"] = $("input[text_sort=" + $input.attr('sort') + "]").val();
            option["constructionNodes[" + i + "].prenum"] = $input.attr('prenum');
            option["constructionNodes[" + i + "].postnum"] = $input.attr('postnum');
        });

        com.post(api.construction.successDrawLine, option, function(res) {

            com.showAlert(com.info, "放线成功");
            drawline.modals.contructionNodeModal.modal("hide");
            searcher.doSearch();
        });
    }

    function initPlan() {

        com.focusPage('#calendar').fullCalendar('destroy');
        com.focusPage('#calendar').fullCalendar('today');

        com.focusPage('#calendar').fullCalendar($.extend(com.calendardefault, {
            select: function() {

            },
            events: function(start, end, callback) {

                var startTime = com.dateFormat(new Date(start));
                var endTime = com.dateFormat(new Date(end));

                var options = {
                    "drawLine.startTime": startTime,
                    "drawLine.endTime": endTime
                };

                com.post(api.construction.countDrawLine, options, function(res) {

                    var counts = res.count;
                    var events = [];

                    for ( var i in counts) {

                        var _ = counts[i];
                        var _date = _[1] + "";

                        var event = {
                            title: _[0] + _[2] + "个",
                            start: new Date(_date.substr(0, 4), _date.substr(4, 2) - 1, _date.substr(6, 2)),
                            allDay: true
                        };

                        events.push(event);
                    }

                    callback(events);
                });
            }
        }));
    }

    function viewConstructionInfo(orderId) {

        com.post(api.construction.queryConstructionInfoByOrderId, {
            "constructionInfo.orderId": orderId
        }, function(res) {

            data = res.constructionInfo;

            drawline.items.orderId = orderId;

            drawline.items.ishovel.val(data.ishovel);
            drawline.items.iskey.val(data.iskey);
            drawline.items.isCeremony.val(data.isCeremony);
            drawline.items.timeLimit.val(data.timeLimit);
            if (data.finishTime != null) {
                drawline.items.finishTime.val(data.finishTime.substr(0, 10));
            }
            if (data.keyTime != null) {
                drawline.items.keyTime.val(data.keyTime.substr(0, 10));
            }
            if (data.drawlineTime != null) {
                drawline.items.drawlineTime.val(data.drawlineTime.substr(0, 10));
            }
            if (data.designTime != null) {
                drawline.items.designTime.val(data.designTime.substr(0, 10));
            }
            drawline.items.comment.val(data.comment);
        });

        drawline.modals.constructionInfoModal.modal("show");
    }

    function saveInfoData() {

        var options = {
            "constructionInfo.orderId": drawline.items.orderId,
            "constructionInfo.decoration.orderId": drawline.items.orderId,
            "constructionInfo.timeLimit": drawline.items.timeLimit.val(),
            "constructionInfo.ishovel": drawline.items.ishovel.val(),
            "constructionInfo.iskey": drawline.items.iskey.val(),
            "constructionInfo.isCeremony": drawline.items.isCeremony.val(),
            "constructionInfo.finishTime": drawline.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": drawline.items.keyTime.val() + " 00:00:00",
            "constructionInfo.drawlineTime": drawline.items.drawlineTime.val() + " 00:00:00",
            "constructionInfo.designTime": drawline.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": drawline.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            drawline.modals.constructionInfoModal.modal("hide");
        });
    }

});
