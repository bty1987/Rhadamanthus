jQuery(function($) {

    var measure = {

        dmid: null,

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

            dmid: com.focusPage("#dlid"),
            actualDate: com.focusPage("#actualDate"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),

            ishovel: com.focusPage("#ishovel"),
            iskey: com.focusPage("#iskey"),
            timeLimit: com.focusPage("#timeLimit"),
            finishTime: com.focusPage("#finishTime"),
            keyTime: com.focusPage("#keyTime"),
            measureTime: com.focusPage("#measureTime"),
            designTime: com.focusPage("#designTime"),
            isCeremony: com.focusPage("#isCeremony"),
            comment: com.focusPage("#comment")
        }
    };

    measure.btns.saveInfoBtn.bindClick(saveInfoData);
    measure.btns.saveBtn.bindClick(saveData);
    measure.btns.updateBtn.bindClick(updateData);

    measure.modals.constructionInfoModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.applyModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.editModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    measure.modals.updateModal.on("hide.bs.modal", function() {

        com.cleanItems(measure.items);
        com.closeTip();
    });

    com.datetime(measure.items.applayTime);
    com.datetime(measure.items.actualDate);
    com.datetime(measure.items.finishTime);
    com.datetime(measure.items.keyTime);
    com.datetime(measure.items.measureTime);
    com.datetime(measure.items.designTime);
    com.datetime(measure.items.startTime, "time");
    com.datetime(measure.items.endTime, "time");

    measure.items.ishovel.bindData(constant.construction().constructionInfo.isHovel.datas, "key", "value");
    measure.items.iskey.bindData(constant.construction().constructionInfo.isKey.datas, "key", "value");
    measure.items.isCeremony.bindData(constant.construction().constructionInfo.isCeremony.datas, "key", "value");


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
            field: "orderTotalPrice",
            name: "合同额",
            prop: "decoration.orderTotalPrice",
            clazz: "blue"
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

                tools.personel.info($this, v.appler.userId);
            }
        }, {
            field: "actualTime",
            name: "量尺时间",
            prop: "actualTime",
            clazz: "green"
        }, {
            field: "startTime",
            name: "开始时间",
            prop: "startTime",
            clazz: "green"
        }, {
            field: "endTime",
            name: "结束时间",
            prop: "endTime",
            clazz: "green"
        }, {
            field: "measureStatus",
            name: "状态",
            prop: function(v) {

                return constant.decoration().measure.status.keys[v.status];
            },
            clazz: "red"
        }, {
            field: "content",
            name: "描述",
            prop: "content",
            clazz: "grey"
        }];
    }

    function buildMeasureLinebtns() {

        return {
            draw: {name: "编辑", clazz: "btn-success", handle: function(v) { showEdit(v); }},
            reset: {name: "重置", clazz: "btn-inverse", handle: function(v) { reset(v.dmid); }}
        };
    }

    var searcher = new Searcher();
    searcher.set("condList", "pagenation", "resultList", api.decoration.pageDecorationMeasure, {"decorationMeasure.status": constant.decoration.measure.STATUS_QUEUE_INT}, ['decoration-orderId', 'decoration-village', 'decoration-houseNumber', 'decoration-measure-status', 'decoration-measure-applayTime', 'decoration-measure-actualDate'], "measureApplyPostData");
    searcher.line(function(v) {
        return v.decoration.orderId;
    }, buildMeasureLineprops(), buildMeasureLinebtns()).render();

//    com.focusPage("#condList").append('<button id="showmeasureApplyInfos" style="marg" class="btn btn-xs btn-yellow btn-search">申请信息</button>');

    function showUpdate(v) {

        com.clearValidator();

        measure.dmid = v.dmid;

        measure.items.applayTime.val(v.applayTime);

        measure.modals.updateModal.modal("show");
    }

    function showEdit(v) {

        com.clearValidator();

        measure.items.dmid.val(v.dmid);
        measure.items.actualDate.val(v.applayTime);
        measure.modals.editModal.modal("show");
    }

    function reset(dmid) {
console.log(dmid);
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
console.log("updateData2");
        if (com.validate("updateModal")) {
            return false;
        }

        var options = {
            "decorationMeasure.dmid": measure.dmid,
            "decorationMeasure.applayTime": measure.items.applayTime.val() + " 00:00:00"
        };

        com.post(api.decoration.updateDecorationMeasure, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        measure.modals.updateModal.modal("hide");
    }

    function saveData() {

        if (com.validate("editModal")) {
            return false;
        }

        var start = Date.parse(measure.items.actualDate.val().replace("-", "/") + " " + measure.items.startTime.val());
        var end = Date.parse(measure.items.actualDate.val().replace("-", "/") + " " + measure.items.endTime.val());

        if (start == NaN || end == NaN || start >= end) {
            com.showAlert(com.info, "起始时间和结束时间非法");
            return;
        }

        var options = {
            "decorationMeasure.dmid": measure.items.dmid.val(),
            "decorationMeasure.startTime": measure.items.actualDate.val() + " " + measure.items.startTime.val(),
            "decorationMeasure.endTime": measure.items.actualDate.val() + " " + measure.items.endTime.val(),
        };

        com.post(api.decoration.applayDecorationMeasure, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        measure.modals.editModal.modal("hide");
    }

    com.focusPage('#showmeasureApplyInfos').click(function() {

        measure.modals.applyModal.modal("show");
    });

    measure.modals.applyModal.on('shown.bs.modal', function(e) {

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
                    "measure.startTime": startTime,
                    "measure.endTime": endTime
                };

                com.post(api.construction.countmeasure, options, function(res) {

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

//    function viewConstructionInfo(orderId) {
//
//        com.post(api.construction.queryConstructionInfoByOrderId, {
//            "constructionInfo.orderId": orderId
//        }, function(res) {
//
//            data = res.constructionInfo;
//
//            measure.items.orderId = orderId;
//
//            measure.items.ishovel.val(data.ishovel);
//            measure.items.iskey.val(data.iskey);
//            measure.items.isCeremony.val(data.isCeremony);
//            measure.items.timeLimit.val(data.timeLimit);
//            if (data.finishTime != null) {
//                measure.items.finishTime.val(data.finishTime.substr(0, 10));
//            }
//            if (data.keyTime != null) {
//                measure.items.keyTime.val(data.keyTime.substr(0, 10));
//            }
//            if (data.measureTime != null) {
//                measure.items.measureTime.val(data.measureTime.substr(0, 10));
//            }
//            if (data.designTime != null) {
//                measure.items.designTime.val(data.designTime.substr(0, 10));
//            }
//            measure.items.comment.val(data.comment);
//        });
//        measure.modals.constructionInfoModal.modal("show");
//
//    }

    function saveInfoData() {

        var options = {
            "constructionInfo.orderId": measure.items.orderId,
            "constructionInfo.decoration.orderId": measure.items.orderId,
            "constructionInfo.timeLimit": measure.items.timeLimit.val(),
            "constructionInfo.ishovel": measure.items.ishovel.val(),
            "constructionInfo.iskey": measure.items.iskey.val(),
            "constructionInfo.isCeremony": measure.items.isCeremony.val(),
            "constructionInfo.finishTime": measure.items.finishTime.val() + " 00:00:00",
            "constructionInfo.keyTime": measure.items.keyTime.val() + " 00:00:00",
            "constructionInfo.measureTime": measure.items.measureTime.val() + " 00:00:00",
            "constructionInfo.designTime": measure.items.designTime.val() + " 00:00:00",
            "constructionInfo.comment": measure.items.comment.val()
        };

        com.post(api.construction.updateConstructionInfoByOrderId, options, function(res) {

            com.showAlert(com.info, "操作成功");

            measure.modals.constructionInfoModal.modal("hide");

        });
    }

});
