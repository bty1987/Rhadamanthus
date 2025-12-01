jQuery(function($) {

    var holiday = {

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#holidayModal").on("click", saveData)
        },

        items: {
            startTime: com.focusPage("#startTime", "#holidayModal"),
            endTime: com.focusPage("#endTime", "#holidayModal"),
            atttype: com.focusPage("#atttype", "#holidayModal"),
        },

        modals: {
            holidayModal: com.focusPage("#holidayModal")
        },

        hdid: null
    };

    holiday.modals.holidayModal.on('show.bs.modal', function(e) {

        com.cleanItems(holiday.items);
        com.clearValidator();
    });
    
    holiday.items.atttype.bindData(constant.data().holiday.atttype.datas, "key", "value");

    com.datetime(holiday.items.startTime);
    com.datetime(holiday.items.endTime);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageHoliday);
    searcher.condition(["data-holiday-startTime", "data-holiday-endTime"]);
    searcher.history("holidayPostData");

    searcher.button([{
        id: "addHoliday",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        field: "period",
        name: "年份",
        prop: "period",
        clazz: "green"
    }, {
        fieId: "startTime",
        name: "开始时间",
        prop: "startTime",
        clazz: "blue"
    }, {
        field: "endTime",
        name: "结束时间",
        prop: "endTime",
        clazz: "blue"
    }, {
        field: "daynum",
        name: "天数",
        prop: "daynum",
        clazz: "green"
    }, {
        fieId: "atttype",
        name: "业务类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.data().holiday.atttype.keys
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-info",
        handle: function(v) {

            holiday.hdid = v.hdid;

            holiday.items.startTime.val(v.startTime);
            holiday.items.startTime.val(v.endTime);
            holiday.items.atttype.val(v.atttype);

            holiday.modals.holidayModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("确认删除数据？", function() {

                com.post(api.data.deleteHoliday, {
                    "holiday.hdid": v.hdid
                }, function(res) {

                    searcher.doSearch();
                    com.showAlert(com.info, "删除成功.");
                });
            })
        }
    }];

    searcher.line("", lineprops, linebtns).render();

    com.focusPage('#addHoliday', '#pagenation').on("click", function() {

        holiday.modals.holidayModal.modal("show");
    });

    function saveData() {

        if (com.validate('holidayModal'))
            return false;

        var startTime = holiday.items.startTime.val();
        var endTime = holiday.items.endTime.val();
        var atttype = holiday.items.atttype.val();

        if (new Date(startTime).getTime() > new Date(endTime).getTime()) {

            com.showAlert(com.error, "结束时间要大于开始时间.");
            return false;
        }

        var url = api.data.addHoliday;
        var options = {
            'holiday.startTime': startTime,
            'holiday.endTime': endTime,
            'holiday.atttype': atttype,
        };

        if (holiday.hdid != null) {

            options["holiday.hdid"] = holiday.hdid;

            url = api.data.updateHoliday;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        holiday.modals.holidayModal.modal("hide");
    }

});
