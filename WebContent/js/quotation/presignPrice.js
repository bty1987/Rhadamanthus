jQuery(function($) {

    var presignPrice = {

        presignProduce: params.data.presignProduce,

        btns: {
            createPresignPriceBtn: com.focusPage("#savePresignPriceBtn").on("click", saveData),
        },

        modals: {
            createPresignPriceModal: com.focusPage("#createPresignPriceModal"),
            importPresignPriceModal: com.focusPage("#importPresignPriceModal")
        },

        items: {
            name: com.focusPage("#name", "#createPresignPriceModal"),
            upperArea: com.focusPage("#upperArea", "#createPresignPriceModal"),
            lowerArea: com.focusPage("#lowerArea", "#createPresignPriceModal"),
            price: com.focusPage("#price", "#createPresignPriceModal"),
            costPrice: com.focusPage("#costPrice", "#createPresignPriceModal"),
            mostPrice: com.focusPage("#mostPrice", "#createPresignPriceModal"),
            activityPrice: com.focusPage("#activityPrice", "#createPresignPriceModal"),

            // 导入功能相关
            executeDates: com.focusPage("#executeDates", "#importPresignPriceModal"),
            executeTimes: com.focusPage("#executeTimes", "#importPresignPriceModal"),
            filePath: com.focusPage("#filePath", "#importPresignPriceModal")
        },

        status: {},
        type: {},

        // 导入功能关键字
        keyword: "import_quotation_presignprice"
    };

    presignPrice.modals.createPresignPriceModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(presignPrice.items);
    });

    // 初始化日期和时间选择器
    com.datetime(presignPrice.items.executeDates, "date", false);
    com.datetime(presignPrice.items.executeTimes, "time", false);

    // 初始化文件上传
    com.uploadify("#attachment", "上传文件", api.common.uploadOther, 'btn btn-sm btn-primary lineheight0', "*.xls", {
        'uploadType': 3
    }, 1, function(data) {
        0 == data.errorCode ? presignPrice.items.filePath.val(data.resUrl) : alert(data.errorMsg);
    });

    // 导入模态框关闭事件
    presignPrice.modals.importPresignPriceModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        // 清空文件路径和表单
        presignPrice.items.filePath.val("");
        presignPrice.items.executeDates.val("");
        presignPrice.items.executeTimes.val("");
    });

    var searcher = new Searcher();

    searcher.base("condList2", "pagenation2", "resultList2", api.quotation.pagePresignPrice);

    searcher.condition(["quotation-presignPrice-name", "quotation-presignPrice-status"]);

    searcher.button([{
        id: "createPresignPrice",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }, {
        id: "importPresignPrice",
        name: "导入",
        clazz: "btn-success",
        icon: "icon-upload"
    }]);

    searcher.param({
        "presignPrice.ppid": presignPrice.presignProduce.ppid
    });

    searcher.history("presignPricePostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "upperArea",
        name: "起始面积",
        prop: "upperArea",
        clazz: "blue"
    }, {
        fieId: "lowerArea",
        name: "终止面积",
        prop: "lowerArea",
        clazz: "blue"
    }, {
        fieId: "price",
        name: "价格",
        prop: "price",
        clazz: "blue"
    }, {
        fieId: "costPrice",
        name: "工程成本",
        prop: "costPrice",
        clazz: "blue"
    }, {
        fieId: "mostPrice",
        name: "主材成本",
        prop: "mostPrice",
        clazz: "blue"
    }, {
        fieId: "activityPrice",
        name: "浮动额",
        prop: "activityPrice",
        clazz: "blue"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            presignPrice.pspid = v.pspid;

            presignPrice.items.name.val(v.name);
            presignPrice.items.upperArea.val(v.upperArea);
            presignPrice.items.lowerArea.val(v.lowerArea);
            presignPrice.items.price.val(v.price);
            presignPrice.items.costPrice.val(v.costPrice);
            presignPrice.items.mostPrice.val(v.mostPrice);
            presignPrice.items.activityPrice.val(v.activityPrice);

            presignPrice.modals.createPresignPriceModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deletePresignPrice, {
                "presignPrice.pspid": v.pspid
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updatePresignPriceForStatus, {
                "presignPrice.pspid": v.pspid,
                "presignPrice.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createPresignPrice', '#pagenation2').on("click", function() {

        presignPrice.pspid = null;
        presignPrice.modals.createPresignPriceModal.modal("show");
    });

    // 导入按钮点击事件
    com.focusPage("#confirmImportBtn").on("click", importPresignPrice);

    com.focusPage('#importPresignPrice', '#pagenation2').on("click", function() {

        // 显示导入模态框
        presignPrice.modals.importPresignPriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('createPresignPriceModal'))
            return false;

        var url = api.quotation.addPresignPrice;

        var options = {
            "presignPrice.ppid": presignPrice.presignProduce.ppid,
            "presignPrice.name": presignPrice.items.name.val(),
            "presignPrice.upperArea": presignPrice.items.upperArea.val(),
            "presignPrice.lowerArea": presignPrice.items.lowerArea.val(),
            "presignPrice.price": presignPrice.items.price.val(),
            "presignPrice.costPrice": presignPrice.items.costPrice.val(),
            "presignPrice.mostPrice": presignPrice.items.mostPrice.val(),
            "presignPrice.activityPrice": presignPrice.items.activityPrice.val(),
        };

        if (presignPrice.pspid) {
            url = api.quotation.updatePresignPrice;
            options["presignPrice.pspid"] = presignPrice.pspid;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        presignPrice.modals.createPresignPriceModal.modal("hide");
    }

    // 导入预签价格
    function importPresignPrice() {

        if (com.validate('importPresignPriceModal')) {
            return false;
        }

        var filePath = presignPrice.items.filePath.val();

        if (filePath == null || filePath == "") {
            com.showAlert(com.warning, "上传文件不能为空");
            return false;
        }

        // 将文件路径和ppid拼接为参数
        var args = filePath + "," + presignPrice.presignProduce.ppid;

        var date = presignPrice.items.executeDates.val();
        var time = presignPrice.items.executeTimes.val();

        var executeTime = date.replace(/\-/g, '').substr(2) + time.replace(/:/g, '').substr(0, 4);

        var times = presignPrice.items.executeDates.val() + ' ' + presignPrice.items.executeTimes.val();
        var checkTime = new Date(times);

        // 检查执行时间
        if (typeof planUtils !== 'undefined' && !planUtils.TimeComparison(checkTime, config.planTimeLimit)) {
            com.showAlert(com.warning, "执行时间请大于当前时间" + config.planTimeLimit + "分钟");
            return false;
        }

        var options = {
            "plan.task.keyWord": presignPrice.keyword,
            "plan.executeTime": executeTime,
            "plan.args": args
        };

        com.post(api.information.createPlan, options, function(res) {

            com.showAlert(com.info, "计划创建成功");

            // 关闭模态框
            presignPrice.modals.importPresignPriceModal.modal("hide");

            // 刷新列表
            searcher.doSearch();
        });
    }

});
