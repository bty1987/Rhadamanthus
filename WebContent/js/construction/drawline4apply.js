jQuery(function($) {

    var drawline = {

        dlid: null,
        orderId: null,

        btns: {
            saveInfoBtn: com.focusPage("#saveInfoBtn"),
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn"),

            seveSuccessBtn: com.focusPage("#seveSuccess"),
        },

        modals: {

            applyModal: com.focusPage("#applyModal"),
            editModal: com.focusPage("#editModal"),
            updateModal: com.focusPage("#updateModal"),

            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            contructionNodeModal: com.focusPage("#contructionNodeModal"),
        },

        items: {

            applayTime: com.focusPage("#applayTime"),

            dlid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            drawLineGroup: com.focusPage("#drawLineGroup"),

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            drawlineTime: com.focusPage("#drawlineTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment"),

            contructionNodes: com.focusPage("#contructionNodes", "#contructionNodeModal"),
        }
    };

    drawline.btns.saveInfoBtn.bindClick(saveInfoData);
    drawline.btns.saveBtn.bindClick(saveData);
    drawline.btns.updateBtn.bindClick(updateData);
    drawline.btns.seveSuccessBtn.bindClick(seveSuccess);

    drawline.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.closeTip();
    });

    drawline.modals.applyModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.closeTip();
    });

    drawline.modals.editModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.closeTip();
    });

    drawline.modals.updateModal.on("hide.bs.modal", function() {

        com.cleanItems(drawline.items);
        com.closeTip();
    });

    com.datetime(drawline.items.applayTime);
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

    com.post(api.data.queryDrawlineGroup, {}, function(res) {

        drawline.items.drawLineGroup.bindData(res.drawLineGroups, 'gid', 'name');
    });

    var lineprops = (function() {

        return [{
            field: "decoration.orderId",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function(btn, v) {
                tools.decoration.info(btn, v.decoration.orderId);
            }
        }, {
            field: "decoration.house.village.name",
            name: "楼盘",
            prop: "decoration.house.village.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.house.info(btn, v.decoration.house.hid);
            }
        }, {
            field: "decoration.house.houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "decoration.customer.name",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey",
            click: function(btn, v) {
                tools.customer.info(btn, v.decoration.customer.cid);
            }
        }, {
            field: "decoration.designer.currentName",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.designer.userId);
            }
        }, {
            field: "decoration.supervisor.currentName",
            name: "监理",
            prop: function(v) { return v.decoration.supervisor == null ? "" : v.decoration.supervisor.currentName; },
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.supervisor.userId);
            }
        }, {
            field: "decoration.house.buildArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "decoration.orderTotalPrice",
            name: "合同额",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
        }, {
            field: "decoration.version.name",
            name: "报价版本",
            prop: "decoration.version.name",
            clazz: "grey"
        }, {
            field: "appler.currentName",
            name: "申请人",
            prop: "appler.currentName",
            clazz: "grey",
            click: function(btn, v) {
                tools.personel.info(btn, v.decoration.designer.userId);
            }
        }, {
            field: "applayTime",
            name: "申请时间",
            prop: "applayTime",
            clazz: "green"
        }, {
            field: "count",
            name: "放线次数",
            prop: "count",
            clazz: "blue"
        }, {
            field: "content",
            name: "描述",
            prop: "content",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            info: {
                name: "信息",
                clazz: "btn-yellow",
                handle: function(v) {
                    viewConstructionInfo(v.decoration.orderId);
                }
            },
            pretreat: {
                name: "预放线",
                clazz: "btn-info",
                handle: function(v) {
                    pretreat(v);
                }
            },
            update: {
                name: "更新",
                clazz: "btn-purple",
                handle: function(v) {
                    showUpdate(v);
                }
            },
            draw: {
                name: "放线",
                clazz: "btn-success",
                handle: function(v) {
                    showEdit(v);
                }
            },
            reset: {
                name: "重置",
                clazz: "btn-inverse",
                handle: function(v) {
                    reset(v.dlid);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.construction.pageDrawLine, {
        "drawLine.status": constant.construction.drawLine.STATUS_QUEUE_INT
    }, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'construction-drawLine-status', 'construction-drawLine-applayTime', 'construction-drawLine-actualDate'], "drawLineApplyPostData", null, true, null);
    searcher.line("decoration.orderId", lineprops, linebtns).render();

    com.focusPage("#condList").append('<button id="showDrawLineApplyInfos" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

    function showUpdate(v) {

        com.clearValidator();

        drawline.dlid = v.dlid;

        drawline.items.applayTime.val(v.applayTime);

        drawline.modals.updateModal.modal("show");
    }

    function showEdit(v) {

        com.clearValidator();

        drawline.items.dlid.val(v.dlid);
        drawline.items.actualDate.val(v.applayTime);
        drawline.items.drawLineGroup.get(0).selectedIndex = 0;

        drawline.modals.editModal.modal("show");
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

    function updateData() {

        if (com.validate("updateModal")) {
            return false;
        }

        var options = {
            "drawLine.dlid": drawline.dlid,
            "drawLine.applayTime": drawline.items.applayTime.val() + " 00:00:00"
        };

        com.post(api.construction.updateDrawLine, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        drawline.modals.updateModal.modal("hide");
    }

    function saveData() {

        if (com.validate("editModal")) {
            return false;
        }

        var start = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.startTime.val());
        var end = Date.parse(drawline.items.actualDate.val().replace("-", "/") + " " + drawline.items.endTime.val());

        if (isNaN(start) || isNaN(end) || start >= end) {
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

    com.focusPage('#showDrawLineApplyInfos').click(function() {

        drawline.modals.applyModal.modal("show");
    });

    drawline.modals.applyModal.on('shown.bs.modal', function(e) {

        initPlan();
    });

    function initPlan() {

        com.focusPage('#calendar').fullCalendar('destroy');
        com.focusPage('#calendar').fullCalendar('today');

        com.focusPage('#calendar').fullCalendar($.extend(com.calendardefault, {
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

    function pretreat(v) {

        // var option = {"drawLine.dlid": v.dlid};

        drawline.dlid = v.dlid;
        drawline.orderId = v.decoration.orderId;

        drawline.modals.contructionNodeModal.modal("show");
        drawline.items.contructionNodes.html("");

        var $uli = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        var constructionNodes = {};

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

        var period = null;

        com.post(api.data.queryConstructionPeriod, {
            "constructionPeriod.lowerArea": v.decoration.house.innerArea
        }, function(res) {

            period = res.constructionPeriod;
        }, null, false);
        
        if (!period || !period.cpid)
            return false;

        com.post(api.data.queryConstructionPeriodNodeByCpid, {
            "constructionPeriodNode.cpid": period.cpid
        }, function(res) {

            $.each(res.constructionPeriodNodes, function(i, v) {

                com.focusPage("input.timeLimits[cnid='" + v.constructionNode.cnid + "']", "#contructionNodes").val(v.period);
            });
        });
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

    function seveSuccess() {

        if (com.validate("contructionNodeModal")) {
            return false;
        }

        var $inputs = com.focusPage('input[name="sorts"]:checked', '#contructionNodes');

        var option = {
            "drawLine.decoration.orderId": drawline.orderId
        };

        $.each($inputs, function(i, v) {

            var $input = $(v);

            option["constructionNodes[" + i + "].cnid"] = $input.attr('cnid');
            option["constructionNodes[" + i + "].sort"] = $input.attr('sort');
            option["constructionNodes[" + i + "].timeLimit"] = $("input[text_sort=" + $input.attr('sort') + "]").val();
        });

        com.post(api.construction.pretreatDrawLine, option, function(res) {

            com.showAlert(com.info, "放线成功");
            drawline.modals.contructionNodeModal.modal("hide");
            searcher.doSearch();
        });
    }

});
