jQuery(function($) {

    var drawline = {

        dlid: null,

        btns: {
            saveInfoBtn: com.focusPage("#saveInfoBtn"),
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn"),
        },

        modals: {
            constructionInfoModal: com.focusPage("#constructionInfoModal"),
            applyModal: com.focusPage("#applyModal"),
            editModal: com.focusPage("#editModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {

            applayTime: com.focusPage("#applayTime"),

            dlid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            drawlineTime: com.focusPage("#drawlineTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment")
        }
    };

    drawline.btns.saveInfoBtn.bindClick(saveInfoData);
    drawline.btns.saveBtn.bindClick(saveData);
    drawline.btns.updateBtn.bindClick(updateData);

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

    function buildMeasureLineprops() {

        return [{
            field: "orderId",
            name: "装修单",
            prop: "decoration.orderId",
            clazz: "blue",
            click: function($this, v) {

                tools.decoration.info($this, v.decoration.orderId);
            }
        }, {
            field: "village",
            name: "楼盘",
            prop: function(v) {

                return v.decoration.house.village.name;
            },
            clazz: "grey",
            click: function($this, v) {

                tools.house.info($this, v.decoration.house.hid);
            }
        }, {
            field: "houseNumber",
            name: "楼号",
            prop: "decoration.house.houseNumber",
            clazz: "grey"
        }, {
            field: "customer",
            name: "客户",
            prop: "decoration.customer.name",
            clazz: "grey",
            click: function($this, v) {

                tools.customer.info($this, v.decoration.customer.cid);
            }
        }, {
            field: "designer",
            name: "设计师",
            prop: "decoration.designer.currentName",
            clazz: "grey",
            click: function($this, v) {

                tools.personel.info($this, v.decoration.designer.userId);
            }
        }, {
            field: "supervisor",
            name: "监理",
            prop: function(v) {

                return v.decoration.supervisor == null ? "" : v.decoration.supervisor.currentName;
            },
            clazz: "grey",
            click: function($this, v) {

                tools.personel.info($this, v.decoration.supervisor.userId);
            }
        }, {
            field: "houseArea",
            name: "面积",
            prop: "decoration.house.buildArea",
            clazz: "blue"
        }, {
            field: "orderTotalPrice",
            name: "合同额",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
        }, {
            field: "typeness",
            name: "装修业务",
            prop: function(v) {

                return constant.decoration().decoration.typeness.keys[v.decoration.typeness];
            },
            clazz: "red"
        }, {
            field: "status",
            name: "装修状态",
            prop: function(v) {

                return constant.decoration().decoration.status.keys[v.decoration.status];
            },
            clazz: "red"
        }, {
            field: "version",
            name: "报价版本",
            prop: "decoration.version.name",
            clazz: "grey"
        }, {
            field: "appler",
            name: "申请人",
            prop: "appler.currentName",
            clazz: "grey",
            click: function($this, v) {

                tools.personel.info($this, v.decoration.designer.userId);
            }
        }, {
            field: "actualTime",
            name: "量尺时间",
            prop: "actualTime",
            clazz: "green"
        }, {
            field: "startTime",
            name: "开始时间",
            prop: function(v) {

                return v.startTime != null && v.endTime != null ? v.startTime.substr(11) : "";
            },
            clazz: "green"
        }, {
            field: "endTime",
            name: "结束时间",
            prop: function(v) {

                return v.startTime != null && v.endTime != null ? v.endTime.substr(11) : "";
            },
            clazz: "green"
        }, {
            field: "content",
            name: "描述",
            prop: "content",
            clazz: "grey"
        }];
    }

    function buildMeasureLinebtns() {

        return {
            qeasure: {name: "量房单", clazz: "btn-warning", handle: function(v) {
                params.quotation.orderId = v.decoration.orderId;
                com.popup4page("#layerPopUp", api.index.qeasure4detailIndex.url, "量房单");
            }}
        };
    }

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationMeasure, {
        "decorationMeasure.status": constant.decoration.measure.STATUS_QUEUE_INT
    }, ['decoration-orderId', 'decoration-measure-status', 'decoration-measure-actualDate'], "drawLineApplyPostData");
    searcher.line(function(v) {
        return v.decoration.orderId;
    }, buildMeasureLineprops(), buildMeasureLinebtns()).render();

    // com.focusPage("#condList").append('<button id="showDrawLineApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

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
        drawline.modals.editModal.modal("show");
    }

    function reset(dmid) {

        com.showConfirm("确认重置申请吗?", function() {

            com.post(api.decoration.failureDecorationMeasure, {
                "decorationMeasure.dmid": dmid
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

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.info, "起始时间和结束时间非法");
            return;
        }

        var options = {
            "drawLine.dlid": drawline.items.dlid.val(),
            "drawLine.startTime": drawline.items.actualDate.val() + " " + drawline.items.startTime.val(),
            "drawLine.endTime": drawline.items.actualDate.val() + " " + drawline.items.endTime.val(),
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
