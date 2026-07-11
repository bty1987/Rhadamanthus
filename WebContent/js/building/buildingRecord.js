jQuery(function($) {

    var buildingRecord = {

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },
        modals: {
            buildingRecordModal: com.focusPage("#buildingRecordModal")
        },
        items: {
            hsNo: com.focusPage("#hsNo"),
            csNo: com.focusPage("#csNo"),
            brType: com.focusPage("#brType"),
            pattern: com.focusPage("#pattern"),
            comment: com.focusPage("#comment")
        },

        recordType: [],
        pattern: [],

        hsid: null,
        csid: null,
        dataFlag: false,

        currenFlag: params.building.flag,
        currentPage: params.building.page,

        buildingRecordHsno: params.buildingHouse.no,
        buildingRecordCsno: params.buildingCustomer.no,
        buildingRecordHsid: params.building.buildingHouse.hsid,
        buildingRecordCsid: params.building.buildingCustomer.csid,
    };

    buildingRecord.btns.saveBtn.on("click", saveData);

    buildingRecord.modals.buildingRecordModal.on("hide.bs.modal", function() {

        com.cleanItems(buildingRecord.items);
        com.closeTip();
    });

    buildingRecord.items.brType.bindData(constant.building().buildingRecord.type.datas, "key", "value");
    buildingRecord.items.pattern.bindData(constant.building().buildingRecord.pattern.datas, "key", "value");

    $.each(constant.building().buildingRecord.type.datas, function(i, v) {

        buildingRecord.recordType[i] = v.value;
    });
    $.each(constant.building().buildingRecord.pattern.datas, function(i, d) {

        buildingRecord.pattern[i] = d.value;
    });

    var brField;
    var brOptionId;

    if (buildingRecord.currenFlag) {
        // 房源
        brOptionId = buildingRecord.buildingRecordHsid;
        brOptionNo = buildingRecord.buildingRecordHsno;
        brField = "hsid";
        com.focusPage('#fl-statement').statement("房源", "跟进记录");
    } else {
        brOptionId = buildingRecord.buildingRecordCsid;
        brOptionNo = buildingRecord.buildingRecordCsno;
        brField = "csid";
        com.focusPage('#fl-statement').statement("客源", "跟进记录");
    }

    var lineprops = (function() {

        return [{
            field: "type",
            name: "记录类型",
            prop: function(v) { return buildingRecord.recordType[v.type]; },
            clazz: "red"
        }, {
            field: "village",
            name: "楼盘名",
            prop: function(v) {
                var v_name = v.buildingHouse.house.village.name == null ? "" : v.buildingHouse.house.village.name;
                var h_number = v.buildingHouse.house.houseNumber == null ? "" : v.buildingHouse.house.houseNumber;
                return v_name + " " + h_number;
            },
            clazz: "grey"
        }, {
            field: "buildingCustomer.customer.name",
            name: "客户名",
            prop: "buildingCustomer.customer.name",
            clazz: "grey"
        }, {
            field: "pattern",
            name: "联系方式",
            prop: function(v) { return buildingRecord.pattern[v.pattern]; },
            clazz: "grey"
        }, {
            field: "operatTime",
            name: "记录时间",
            prop: "operatTime",
            clazz: "green"
        }, {
            field: "comment",
            name: "记录信息",
            prop: "comment",
            clazz: "grey"
        }, {
            field: "operater.userName",
            name: "操作人",
            prop: "operater.userName",
            clazz: "grey"
        }];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.building.queryBuildingRecord, {
        "filters[0].data": brOptionId,
        "filters[0].field": brField
    }, [], "buildingRecordPostData", "buildingRecords", true, null);
    searcher.line(function(v) { return buildingRecord.currenFlag == true ? v.buildingHouse.no : v.buildingCustomer.no; }, lineprops, {}).render();

    // 添加
    com.focusPage("#addBuildingRecord").click(function() {

        com.cleanItems(buildingRecord.items);

        if (buildingRecord.currenFlag) {
            buildingRecord.items.hsNo.prop("disabled", true);
            buildingRecord.items.hsNo.val(buildingRecord.buildingRecordHsno);
        } else {
            buildingRecord.items.csNo.prop("disabled", true);
            buildingRecord.items.csNo.val(buildingRecord.buildingRecordCsno);
        }

        buildingRecord.modals.buildingRecordModal.modal("show");
    });

    function saveData() {

        if (buildingRecord.items.hsNo.val() != "") {
            com.post(api.building.queryBuildingHouseByNo, {
                "buildingHouse.no": buildingRecord.items.hsNo.val()
            }, function(res) {

                buildingRecord.hsid = res.buildingHouse.hsid;
                buildingRecord.dataFlag = false;
            }, function(data) {

                buildingRecord.dataFlag = true;
                com.showAlert(com.warning, "请正确输入房源编号");
            }, false);
        }

        if (buildingRecord.items.csNo.val() != "") {
            com.post(api.building.queryBuildingCustomerByNo, {
                "buildingCustomer.no": buildingRecord.items.csNo.val()
            }, function(res) {

                buildingRecord.csid = res.buildingCustomer.csid;
                buildingRecord.dataFlag = false;
            }, function(data) {

                buildingRecord.dataFlag = true;
                com.showAlert(com.warning, "请正确输入客源编号");
            }, false);
        }

        if (com.validate("buildingRecordModal") || buildingRecord.dataFlag) {
            return false;
        }

        var options = {
            "buildingRecord.buildingHouse.hsid": buildingRecord.hsid,
            "buildingRecord.buildingCustomer.csid": buildingRecord.csid,
            "buildingRecord.comment": buildingRecord.items.comment.val(),
            "buildingRecord.type": buildingRecord.items.brType.val(),
            "buildingRecord.pattern": buildingRecord.items.pattern.val()
        };

        com.post(api.building.addBuildingRecord, options, function() {

            com.showAlert(com.info, "添加成功");
            buildingRecord.hsid = null;
            buildingRecord.csid = null;
            searcher.doSearch();
        });

        buildingRecord.modals.buildingRecordModal.modal("hide");
    }
});
