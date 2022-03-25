$(function() {

    var addSubtraction = {

        arId: null,

        items: {
            addReduceDes: com.focusPage("#addReduceDes"),
            addReduceType: com.focusPage("#addReduceType"),
            paytype: com.focusPage("#paytype"),
        },

        modals: {
            payAddReduceModal: com.focusPage("#payAddReduceModal"),
        },

        btns: {
            payBtn: com.focusPage("#payBtn").on("click", unpay)
        },

        editFlag: false
    };

    var addReduce = {
        types: ["增项", "减项", "漏项"]
    }

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "ResultList", api.addReduce.pageAddReduce);

    searcher.condition(["quotation-addSubtraction-orderId", "quotation-addSubtraction-designer", "quotation-addSubtraction-village", "quotation-addSubtraction-houseNumber", "quotation-addSubtraction-houseArea"]);
    var lineprops = [{
        field: "decoration.orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "日期",
        prop: "decoration.createTime",
        clazz: "green"
    }, {
        field: "houseClass",
        name: "房屋类型",
        prop: "decoration.houseClass",
        clazz: "grey"
    }, {
        field: "name",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "currentName",
        name: "设计师",
        prop: "decoration.designer.currentName",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: addReduce.types
    }, {
        field: "buildArea",
        name: "面积",
        prop: "decoration.house.buildArea",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "查看",
        clazz: "btn-yellow",
        handle: function(v) {

            params.historyPage = api.index.addSubtractionIndex.url;
            params["addReduce.type"] = v.type;
            params["addReduce"] = v;
            viewDetailAddReduce(v.arId);
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.showConfirm("是否确认删除", function() {

                com.post(api.addReduce.deleteAddReduce, {
                    "addReduce.arId": v.arId
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        },
        show: function(v) {

            return (v.status == 0 || v.status == 1);
        }
    }, {
        name: "确认",
        clazz: "btn-info",
        handle: function(v) {

            com.showConfirm("是否确认增减单", function() {

                var options = {
                    "addReduce.arId": v.arId
                };

                com.post(api.addReduce.confirmAddReduce, options, function(res) {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
        },
        show: function(v) {

            return ((v.status == 0 || v.status == 1) && (v.paytype == 1 || v.paytype == 2));
        }
    }, {
        name: "下拨",
        clazz: "btn-success",
        handle: function(v) {

            addSubtraction.arId = v.arId, com.cleanItems(addSubtraction.items);

            addSubtraction.modals.payAddReduceModal.modal("show");
        },
        show: function(v) {

            return (v.type == 0 && (v.status == 0 || v.status == 1) && v.paytype == 0);
        }
    }];
    searcher.line("decoration.orderId", lineprops, linebtns);
    searcher.render();

    // 查看按钮方法
    function viewDetailAddReduce(addReduceId) {

        params["addReduceId"] = addReduceId;
        com.switchPage(api.index.addReduceDetailIndex.url);
    }

    // 保存按钮
    function unpay() {

        var options = {
            "addReduce.arId": addSubtraction.arId,
            "addReduce.paytype": addSubtraction.items.paytype.val(),
        };

        com.post(api.addReduce.unpayAddReduce, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            addSubtraction.modals.payAddReduceModal.modal("hide");
        });
    }
});